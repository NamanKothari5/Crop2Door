const express = require("express");
const app = express.Router();

const { newOrder, myOrders, getPath, getAllOrdersOnFarm, getAllOrders } = require("../controllers/order");

app.post("/new", newOrder);
app.get("/my", myOrders);
app.get('/adminOrders', getAllOrders);
app.get("/:id", getPath);
app.get('/allOrders/:id', getAllOrdersOnFarm);

module.exports = app;
