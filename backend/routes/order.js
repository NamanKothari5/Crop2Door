const express = require("express");
const app = express.Router();

const { newOrder, myOrders, getPath } = require("../controllers/order");

app.post("/new", newOrder);
app.get("/my", myOrders);
app.get("/:id", getPath);
module.exports = app;
