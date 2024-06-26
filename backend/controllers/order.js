const { TryCatch } = require("../middlewares/errorHandler");
const { Order } = require("../models/order");
const { User } = require("../models/user");
const { Farm } = require("../models/farm");
const CustomError = require("../utils/customError");
const { Product } = require("../models/product");
const { generateClusters, findCluster } = require("../utils/mapBoxUtils");

module.exports.newOrder = TryCatch(async (req, res, next) => {
  const { id } = req.query;
  const { orderItems, paymentID } = req.body;

  let totalPrice = 0;
  let requiredProducts = {};
  for (let i = 0; i < orderItems.length; i++) {
    let currQuantity = Number(orderItems[i].quantity);
    let currPrice = Number(orderItems[i].price);
    totalPrice += currQuantity * currPrice;
  }
  requiredProducts = orderItems.reduce((obj, item) => {
    obj[item.name] = item.quantity;
    return obj;
  }, {});

  // console.log(products)

  const date = new Date();
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  const user = await User.findById(id);

  const coordinates = user.coordinates;

  const allFarms = await Farm.find({});

  let query = `${coordinates[0]},${coordinates[1]}`;

  allFarms.forEach((farm) => {
    const farmLongitude = farm.coordinates[0];
    const farmLatitude = farm.coordinates[1];
    query += `;${farmLongitude},${farmLatitude}`;
  });
  const baseURl = process.env.MAPBOX_BASE_URL;
  const token = process.env.MAPBOX_TOKEN;

  let response = await fetch(
    `${baseURl}/directions-matrix/v1/mapbox/driving/${query}?sources=0&annotations=distance,duration&access_token=${token}`
  );

  if (!response.ok)
    return next(new CustomError("Error retreiving appropriate products", 400));

  let jsonData = await response.json();
  let distances = jsonData.distances[0];

  let validFarms = [];
  for (let idx = 1; idx < distances.length; idx++) {
    if (distances[idx] <= 500000) validFarms.push(allFarms[idx - 1]);
  }

  // console.log(validFarms);
  
  let produce = validFarms.map((e) => {
    return {};
  });
  for (let i = 0; i < validFarms.length; i++) {
    for (let j = 0; j < validFarms[i].products.length; j++) {
      const productId = validFarms[i].products[j];
      const product = await Product.findById(productId);
      produce[i][product.name] = product.stock;
    }
  }
  let currClusterQuantity = {};
  let allClusters = [];
  let currCluster = [validFarms.length];

  for (const crop in requiredProducts) currClusterQuantity[crop] = 0;

  const addresses = validFarms.map((farm) => farm.coordinates);
  addresses.push(coordinates);
  query = "";
  addresses.forEach((coordinates) => {
    const farmLongitude = coordinates[0];
    const farmLatitude = coordinates[1];
    query += `${farmLongitude},${farmLatitude};`;
  });
  query = query.slice(0, -1);

  response = await fetch(
    `${baseURl}/directions-matrix/v1/mapbox/driving/${query}?annotations=distance&access_token=${token}`
  );

  if (!response.ok)
    return next(new CustomError("Error retreiving farm distances", 400));

  jsonData = await response.json();
  distances = jsonData.distances;

  generateClusters(
    requiredProducts,
    produce,
    0,
    currClusterQuantity,
    currCluster,
    allClusters
  );
  if(allClusters.length==0){
    return next(new CustomError("Stock Not Available",404));
  }
  let { min_dist, finalPath } = findCluster(distances, allClusters);

  const finalPathIdx = finalPath;
  finalPath = finalPath.map((idx) => {
    if (idx < validFarms.length) {
      const farm = validFarms[idx];
      return {
        pincode: farm.pincode,
        address: farm.address,
        coordinates: farm.coordinates,
      };
    } else {
      return {
        pincode: user.pincode,
        address: user.address,
        coordinates: user.coordinates,
      };
    }
  });


  const currentDate = `${day}-${month}-${year}`;
  const order = await Order.create({
    user: id,
    orderItems,
    totalPrice,
    finalPath: finalPath.map((location) => location.coordinates),
    min_dist,
    date: currentDate,
    paymentID,
  });
  user.orders.push(order._id);
  await user.save();
  
  for (farmIdx in finalPathIdx) {
    if (finalPathIdx[farmIdx] < validFarms.length) {
      const farm = validFarms[finalPathIdx[farmIdx]];
      const farmProducts = validFarms[finalPathIdx[farmIdx]].products;
      
      let farmOrderItems = [];
      await Promise.all(farmProducts.map(async (productId) => {
        const product = await Product.findById(productId);
        if (product.name in requiredProducts && requiredProducts[product.name] > 0) {
          const currQuantity = Math.min(product.stock, requiredProducts[product.name]);
          product.stock -= currQuantity;
          requiredProducts[product.name] -= currQuantity;
          farmOrderItems.push({
            name: product.name,
            price: product.price,
            quantity: currQuantity,
          });

          if(product.stock>0)
          await product.save();
          
          if(product.stock==0){
            farm.products=farm.products.filter((id )=> {
              return String(id)!=String(product._id);
            });
            await product.deleteOne();
          }
        
        }
      }));
      if (farmOrderItems.length > 0)
        farm.orders.push({
        orderId: order._id,
        orderItems: farmOrderItems,
      });
      await farm.save();
    }
  }

  return res.status(200).json({
    success: true,
    message: "Order Created Successfully",
    finalPath,
    min_dist,
    paymentID,
  });
});

module.exports.myOrders = TryCatch(async (req, res, next) => {
  const { id } = req.query;
  const user = await User.findById(id).populate("orders");

  return res.status(200).json({
    success: true,
    orders: user.orders,
  });
});

module.exports.getPath = TryCatch(async (req, res, next) => {
  const { id } = req.params;
  const order = await Order.findById(id);

  return res.status(200).json({
    success: true,
    finalPath: order.finalPath,
    distance:order.min_dist
  });
});

module.exports.getAllOrdersOnFarm = TryCatch(async (req, res, next) => {
  const id = req.params.id;
  const farm = await Farm.findById(id);
  if(!farm) return next(new CustomError("Farm Not Found", 404));

  return res.status(200).json({
      success: true,
      orders: farm.orders,
      
  })
});

module.exports.getAllOrders = TryCatch(async(req, res, next)=>{
  const orders = await Order.find({});
  const farms = await Farm.find({});


  const allOrders = orders.map((order)=>{
    const orderId = order._id;
    const paymentID = order.paymentID;
    let orderDetails=[];
    let adminRevenue = 0;
    
    farms.forEach((farm)=>{
      farm.orders.forEach((farmOrder) => {
        if(String(farmOrder.orderId) === String(orderId)){
          farmOrder.orderItems.forEach((orderItem)=>{
            orderDetails.push({name:orderItem.name,price:orderItem.price,quantity:orderItem.quantity,farmUser:farm.user});
            adminRevenue += orderItem.price * orderItem.quantity * 0.25;
          })
        }
      });
    });

    
    return {orderId,paymentID, orderDetails, adminRevenue};
  });
  
  return res.status(200).json({
    success: true,
    allOrders
  });
})

/*
[orderid:
    paymentid:
    orderdetail: {farmid, produce, subtotal} ]

farms=[{
  id:"11".
  orders:[
    {
      orderId:"111".
      orderDetails:[{name:"Tomato",price:11,quantity:11},{name:"Potato",price:12,quantity:12}]
    }
  ]
},
{
  id:"11".
  orders:[
    {
      orderId:"111".
      orderDetails:[{name:"Potato",price:12,quantity:12},{name:"Tomato",price:11,quantity:12}]
    }
  ]
},
]

Output:
[{
  orderId:"1111",
  payment:11,
  orderDetail:[
    {name:"Tomato",price:11,quantity:11,farmId},{name:"Potato",price:12,quantity:12,farmId},{name:"Potato",price:12,quantity:12,farmId},{name:"Potato",price:12,quantity:12,farmId}
  ]
}]
*/