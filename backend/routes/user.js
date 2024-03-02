const { loginUser } = require("../controllers/user");

const express=require("express");
const app=express.Router();

app.post("/login",loginUser);

module.exports=app;