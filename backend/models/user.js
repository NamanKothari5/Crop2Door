const mongoose = require("mongoose");
const validator = require("validator");

const schema = new mongoose.Schema({
    _id: {
        type: String,
        required: [true, "Please enter ID"]
    },
    name: {
        type: String,
        required: [true, "Please enter Name"]
    },
    email: {
        type: String,
        unique: [true, "Email already Exist"],
        required: [true, "Please enter Name"],
        validate: validator.default.isEmail,
    },
    address: {
        type: String,
        required: [true, "Please enter Address"],
    },
    pincode: {
        type: Number,
        required: [true, "Please enter pincode"]
    },
    coordinates: {
        type: [String],
        required: true
    },
    role: {
        type: String,
        enum: ["admin", "customer", "farmer"],
        default: "customer",
    },
    farm: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Farm'
    },
    orders: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order'
        }
    ]
});


module.exports.User = mongoose.model("User", schema);