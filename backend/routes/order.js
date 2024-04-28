const express = require("express");
const app = express.Router();

const { newOrder, myOrders, getPath, getAllOrdersOnFarm } = require("../controllers/order");

app.post("/new", newOrder);
app.get("/my", myOrders);
app.get("/:id", getPath);
app.get('/allOrders/:id', getAllOrdersOnFarm);
module.exports = app;
