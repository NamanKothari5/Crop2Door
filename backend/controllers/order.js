const { TryCatch } = require("../middlewares/errorHandler");
const { Order } = require("../models/order");
const { User } = require("../models/user");
const { Farm } = require("../models/farm");
const CustomError = require("../utils/customError");
const { Product } = require("../models/product");
const { generateClusters, findCluster } = require("../utils/mapBoxUtils");

module.exports.newOrder = TryCatch(async (req, res, next) => {
    const { id } = req.query;
    const { orderItems } = req.body;

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
    }, {})
    
    // console.log(products)
    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const currentDate = `${day}-${month}-${year}`;
    const order = await Order.create({
        user: id,
        orderItems,
        totalPrice,
        date: currentDate
    });

    const user = await User.findById(id);
    user.orders.push(order._id);
    await user.save();

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

    let response = await fetch(`${baseURl}/directions-matrix/v1/mapbox/driving/${query}?sources=0&annotations=distance,duration&access_token=${token}`);

    if (!response.ok)
        return next(new CustomError("Error retreiving appropriate products", 400));

    let jsonData = await response.json();
    let distances = jsonData.distances[0];

    let validFarms = [];
    for (let idx = 1; idx < distances.length; idx++) {
        if (distances[idx] <= 200000)
            validFarms.push(allFarms[idx - 1]);
    }

    let produce = validFarms.map((e) => {
        return {};
    });
    for(let i=0; i<validFarms.length; i++){
        for(let j=0; j<validFarms[i].products.length; j++){
            const productId = validFarms[i].products[j];
            const product = await Product.findById(productId);
            produce[i][product.name] = product.stock;
        }
    }
    let currClusterQuantity = {};
    let allClusters = [];
    let currCluster = [validFarms.length];

    const addresses = validFarms.map((farm)=>farm.coordinates);
    addresses.push(coordinates);
    query="";
    addresses.forEach((coordinates) => {
        const farmLongitude = coordinates[0];
        const farmLatitude = coordinates[1];
        query += `${farmLongitude},${farmLatitude};`;
    });
    query = query.slice(0, -1);
    
    response=await fetch(`${baseURl}/directions-matrix/v1/mapbox/driving/${query}?annotations=distance&access_token=${token}`);

    if(!response.ok)
    return next(new CustomError("Error retreiving farm distances", 400));

    jsonData=await response.json();
    distances = jsonData.distances;

    console.log(distances);
    generateClusters(requiredProducts, produce, 0, currClusterQuantity, currCluster, allClusters);

    const {min_dist, finalPath} = findCluster(distances, allClusters);
    console.log(min_dist);
    console.log(finalPath);

    return res.status(200).json({
        success: true,
        message: "Order Created Successfully"
    });
})

module.exports.myOrders = TryCatch(async (req, res, nect) => {
    const { id } = req.query;
    const user = await User.findById(id).populate("orders");

    return res.status(200).json({
        success: true,
        orders:user.orders
    });
});

