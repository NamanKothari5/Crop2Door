const { TryCatch } = require("../middlewares/errorHandler");
const { User } = require("../models/user");
const CustomError = require("../utils/customError");

module.exports.loginUser = TryCatch(async (req, res, next) => {
    const { _id, name, email, gender, dob, role } = req.body;

    const newUser = await User.create({ _id, name, email,gender,dob, role });

    res.status(200).json({
        success: true,
        message: `Welcome ${newUser.name}`
    });
});