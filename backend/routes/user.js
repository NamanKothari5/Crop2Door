const { loginUser, getAllusers, getUser } = require("../controllers/user");

const express=require("express");
const { adminOnly, customerOnly } = require("../middlewares/auth");
const app=express.Router();

app.post("/login",loginUser);
app.get("/all",adminOnly,getAllusers);
app.get("/:id",getUser);

module.exports=app;