const { User } = require("../models/user");
const CustomError = require("../utils/customError");
const { TryCatch } = require("./errorHandler");

module.exports.adminOnly=TryCatch(async(req,res,next)=>{
    const {id}=req.query;

    if(!id)
    return next(new CustomError("Please login",401));

    const user=await User.findById(id);

    if(!user)
    return next(new CustomError("Invalid user",401));

    if(user.role!=="admin")
    return next(new CustomError("Only admin can access this request",401));

    next();
});

module.exports.customerOnly=TryCatch(async(req,res,next)=>{
    const {id}=req.query;

    if(!id)
    return next(new CustomError("Please login",401));

    const user=await User.findById(id);

    if(!user)
    return next(new CustomError("Invalid user",401));

    if(user.role!=="customer")
    return next(new CustomError("Only customer can access this request",401));

    next();
});

module.exports.farmerOnly=TryCatch(async(req,res,next)=>{
    const {id}=req.query;

    if(!id)
    return next(new CustomError("Please login",401));

    const user=await User.findById(id);

    if(!user)
    return next(new CustomError("Invalid user",401));

    if(user.role!=="farmer")
    return next(new CustomError("Only farmer can access this request",401));

    next();
});