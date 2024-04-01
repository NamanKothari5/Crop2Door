const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter name"]
    },
    category: {
        type: String,
        required: [true, "Please enter category"]
    },
    photo: {
        type: String,
        required: [true, "Please enter photo"]
    },
    stock: {
        type: Number,
        required: [true, "Please enter stock"]
    },
    address: {
        type: String,
        required: [true, "Please enter address"]
    },
    pincode: {
        type: Number,
        required: [true, "Please enter pincode"]
    },
    description: {
        type: String
    },
    type: {
        type: String,
        enum: ["General", "Specialized"],
        required: [true, "Please enter product type"],
    },
    price: {
        type: Number,
    },
    certifications: {
        type: String
    }
});

module.exports.Product = mongoose.model("Product", productSchema);