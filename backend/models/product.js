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
    },
    stock: {
        type: Number,
        required: [true, "Please enter stock"]
    },
    type: {
        type: String,
        enum: ["General", "Specialized"],
        required: [true, "Please enter product type"],
    },
    description: {
        type: String
    },
    price: {
        type: Number,
    },
    certifications: {
        type: String
    },
    farm: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Farm'
    }
});

module.exports.Product = mongoose.model("Product", productSchema);
