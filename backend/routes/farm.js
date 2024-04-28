const express = require("express");
const app = express.Router();

const { newFarm, getSingleFarm, deleteFarm, getAllFarms, getAllOrdersOnFarm } = require("../controllers/farm");

app.post("/new", newFarm);
app.get("/:id", getSingleFarm);
app.get("/all", getAllFarms);
app.get('/allOrders/:id', getAllOrdersOnFarm);
app.delete("/:id", deleteFarm);

module.exports = app;