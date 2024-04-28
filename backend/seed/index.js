const { Farm } = require("../models/farm");
const { Product } = require("../models/product");
const { User } = require("../models/user");
const { Order } = require("../models/order");
const { products } = require("./products");
const { users } = require("./users");
const {connectDB}=require("../utils/features");
const { getCoordinates } = require("../utils/mapBoxUtils");

async function updateDb() {
    const allUsers=users;
    const allProducts=products;
    
    await User.deleteMany({});
    await Product.deleteMany({});
    await Farm.deleteMany({});
    await Order.deleteMany({});
    const userPromises=allUsers.map(async (userProps)=>{
        const {_id,name,email,address,pincode,role}=userProps;
        const coordinates=await getCoordinates(address,pincode);

        if(role=='farmer'){
            const newFarm=await Farm.create({user:_id,address,pincode,coordinates,orders:[]})
            await User.create({_id,name,email,address,pincode,role,coordinates,farm:newFarm._id});    
        }
        else{
            await User.create({_id,name,email,address,pincode,role,coordinates})
        }
    });
    await Promise.all(userPromises);
    const productPromises= allProducts.map(async(productProps)=>{
        const {name,category,stock,userId,price}=productProps;
        const user=await User.findById(userId);
        const farm=await Farm.findById(user.farm);
        const newProduct=await Product.create({name,category,stock,farm:user.farm._id,price});
        farm.products.push(newProduct._id);
        await farm.save();
    });
    await Promise.all(productPromises);
}
const mongoURI=process.env.MONGO_URI || "mongodb://0.0.0.0:27017";
connectDB(mongoURI);
updateDb();