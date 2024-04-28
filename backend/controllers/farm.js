const { TryCatch } = require("../middlewares/errorHandler");
const { Farm } = require("../models/farm");
const { Product } = require("../models/product");
const { User } = require("../models/user");
const CustomError = require("../utils/customError");
const { getCoordinates } = require("../utils/mapBoxUtils");

module.exports.newFarm = TryCatch(async (req, res, next) => {
    const { address, pincode, userId } = req.body;
    const coordinates = await getCoordinates(address, pincode);
    const user=await User.findById(userId);
    const newFarm = new Farm({
        address,
        pincode:Number(pincode),
        coordinates,
        user:userId
    });
    
    await newFarm.save();
    user.farm = newFarm._id;
    await user.save();
    
    return res.status(200).json({
        success: true,
        message: "Farm created successfully"
    });
});

module.exports.getSingleFarm=TryCatch(async (req,res,next)=>{
    console.log("req made");
    const id = req.params.id;
    const farm=await Farm.findById(id);

    if(!farm)
    return next(new CustomError("Farm Not Found", 404));
    
    return res.status(200).json({
        success: true,
        farm
    });
})

module.exports.getAllFarms=TryCatch(async (req,res,next)=>{
    const farms = await Farm.find({});

    if(!farms)
    return next(new CustomError("Farms Not Found", 404));
    
    return res.status(200).json({
        success: true,
        farms
    });
})

module.exports.deleteFarm = TryCatch(async (req, res, next) => {
    const id = req.params.id;
    const farm = await Farm.findById(id);
    if(!farm) return next(new CustomError("Farm Not Found", 404));

    farm.products.map(async(id)=>{
        const product = await Product.findById(id);
        await product.deleteOne();
    });
    
    const user=await User.findById(farm.user);
    user.farm=null;

    await user.save();
    await farm.deleteOne();

    return res.status(200).json({
        success: true,
        message: "Farm deleted successfully"
    });
})

