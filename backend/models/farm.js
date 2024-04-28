const mongoose = require("mongoose");

const farmSchema = new mongoose.Schema({
  user: {
    type: String,
    required: [true, "Please login as farmer"],
  },
  address: {
    type: String,
    required: [true, "Please enter address"],
  },
  pincode: {
    type: Number,
    required: [true, "Please enter pincode"],
  },
  coordinates: {
    type: [String],
    required: true,
  },
  orders: [
    {
      orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
      },
      orderItems: [
        {
          name: {
            type: String,
            required: true,
          },
          price: {
            type: Number,
            required: true,
          },
          quantity: {
            type: Number,
            required: true,
          },
          _id: false,
        },
      ],
      _id: false
    },
  ],
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
});

module.exports.Farm = mongoose.model("Farm", farmSchema);
