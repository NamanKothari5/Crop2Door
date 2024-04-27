const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    user: {
        type: String,
        ref: "User",
        required: true,
    },
    orderItems: [
        {
            name: {
                type: String,
                required: true
            },
            price: {
                type: Number,
                required: true
            },
            quantity: {
                type: Number,
                required: true
            }
        }
    ],
    totalPrice: {
        type: Number,
        required: true
    },
    finalPath: [{
        type: [String],
        required: true
    }],
    min_dist: {
        type: Number,
        required: true
    },
    date: {
        type: String,
        required: [true, "Please enter date"],
    },
    paymentID:{
        type: String,
        required:true
    }
});

module.exports.Order = mongoose.model("Order", orderSchema);