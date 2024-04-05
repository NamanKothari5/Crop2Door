const express = require("express");
const app = express.Router();

const { newOrder, myOrders } = require("../controllers/order");

app.post("/new", newOrder);
app.get("/my", myOrders);

module.exports = app;