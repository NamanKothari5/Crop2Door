const { TryCatch } = require("../middlewares/errorHandler");
const { Farm } = require("../models/farm");
const { User } = require("../models/user");
const CustomError = require("../utils/customError");
const { getCoordinates } = require("../utils/mapBoxUtils");

module.exports.loginUser = TryCatch(async (req, res, next) => {
    
    const { _id, name, email, address, pincode, role } = req.body;

    let user = await User.findById(_id);

    if (user && user.role !== role) {
        return next(new CustomError("Incorrect credentials", 401));
    }
    else if (user && user.role === role) {
        return res.status(200).json({
            success: true,
            message: `Welcome ${user.name}`
        })
    };

    
    const coordinates = await getCoordinates(address, pincode);


    user = await User.create({ _id, name, email, address, pincode: Number(pincode),coordinates, role });

    if(user.role=='farmer'){
        const coordinates = await getCoordinates(address, pincode);
        const newFarm=await Farm.create({address,pincode,user:_id,coordinates});
        user.farm=newFarm._id;
        await user.save();
    }
    res.status(200).json({
        success: true,
        message: `Welcome ${user.name}`
    });
});

module.exports.getAllusers = TryCatch(async (req, res, next) => {
    res.status(200).json({
        success: true,
        message: `I will give you all users`
    });
});

module.exports.getUser = TryCatch(async (req, res, next) => {
    const id = req.params.id;

    const user = await User.findById(id);

    if (!user)
        return next(new CustomError("Invalid Id", 400));

    return res.status(200).json({
        success: true,
        user
    })
})