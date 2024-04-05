const { TryCatch } = require("../middlewares/errorHandler");
const { Order } = require("../models/order");
const { User } = require("../models/user");
const CustomError = require("../utils/customError");

module.exports.newOrder = TryCatch(async (req, res, next) => {
    const { id } = req.query;
    const { orderItems } = req.body;

    let totalPrice = 0;
    for (let i = 0; i < orderItems.length; i++) {
        let currQuantity = Number(orderItems[i].quantity);
        let currPrice = Number(orderItems[i].price);
        totalPrice += currQuantity * currPrice;
    }

    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const currentDate = `${day}-${month}-${year}`;
    const order = await Order.create({
        user: id,
        orderItems,
        totalPrice,
        date: currentDate
    });

    const user = await User.findById(id);
    user.orders.push(order._id);
    await user.save();

    return res.status(200).json({
        success: true,
        message: "Order Created Successfully"
    });
})

module.exports.myOrders = TryCatch(async (req, res, nect) => {
    const { id } = req.query;
    const user = await User.findById(id).populate("orders");

    return res.status(200).json({
        success: true,
        orders:user.orders
    });
});

