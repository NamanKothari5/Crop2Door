const express = require("express");
const app = express.Router();
const { adminOnly, customerOnly } = require("../middlewares/auth");
const { multiUpload } = require("../middlewares/multer");

const { newProduct, getAllProducts, getAllCategories, getSingleProduct, updateProduct, deleteProduct } = require("../controllers/product");

app.post("/new", multiUpload, newProduct);
app.get("/all", getAllProducts);
app.get("/categories", getAllCategories);

app.get("/:id", getSingleProduct);
app.put("/:id", multiUpload, updateProduct);
app.delete("/:id", deleteProduct);

module.exports = app;