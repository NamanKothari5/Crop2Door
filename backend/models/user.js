const mongoose=require("mongoose");
const validator=require("validator");

const schema=new mongoose.Schema({
    _id:{
        type:String,
        required:[true,"Please enter ID"]
    },
    name:{
        type:String,
        required:[true,"Please enter Name"]
    },
    email: {
        type: String,
        unique: [true, "Email already Exist"],
        required: [true, "Please enter Name"],
        validate: validator.default.isEmail,
    },
    gender: {
        type: String,
        enum: ["male", "female"],
        required: [true, "Please enter Gender"],
    },
    dob: {
        type: Date,
        required: [true, "Please enter Date of birth"],
    },
    role: {
        type: String,
        enum: ["admin", "customer","farmer"],
        default: "customer",
    }
});

module.exports.User=mongoose.model("User",schema);