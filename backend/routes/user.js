const { loginUser, getAllusers, getUser } = require("../controllers/user");

const express = require("express");
const app = express.Router();
const { adminOnly, customerOnly } = require("../middlewares/auth");


app.post("/login",loginUser);
app.get("/all",adminOnly,getAllusers);
app.get("/:id",getUser);

module.exports = app;