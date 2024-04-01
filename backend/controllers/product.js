const { TryCatch } = require("../middlewares/errorHandler");
const { Product } = require("../models/product");
const CustomError = require("../utils/customError");
const fs = require("fs");

module.exports.newProduct = TryCatch(async (req, res, next) => {
    const { name, category, stock, address, pincode, description, type, price } = req.body;

    if(!type){
        return next(new CustomError("Please enter All Fields", 400));
    }
    
    const photo = req.files.photo[0];
    let certifications = "";
    if(type == "Specialized"){
        if(req.files.certifications === undefined)
            return next(new CustomError("Please enter All Fields", 400));
        else
            certifications = req.files.certifications[0];
    }

    if (!photo) return next(new CustomError("Please add Photo", 400));

    if (!name || !category || !stock || !address || !pincode || !type || (type == "Specialized" && !price)) {
      fs.rm(photo.path, () => {
        console.log("Deleted photo");
      });
      fs.rm(certifications.path, () => {
        console.log("Deleted certifications");
      });

      return next(new CustomError("Please enter All Fields", 400));
    }


    if(type == "General"){
        await Product.create({
            name,
            category: category.toLowerCase(),
            stock,
            address,
            pincode,
            description,
            type,
            photo: photo.path,
        });
    }
    else if(type == "Specialized"){
        await Product.create({
            name,
            category: category.toLowerCase(),
            stock,
            address,
            pincode,
            description,
            type,
            price,
            photo: photo.path,
            certifications: certifications.path,
        });
    }
    

    return res.status(201).json({
        success: true,
        message: "Product Created Successfully",
    });
});

module.exports.getAllProducts = TryCatch(async (req, res, next) => {
    const products = await Product.find({});

    return res.status(201).json({
        success: true,
        products
    });
})

module.exports.getAllCategories = TryCatch(async (req, res, next) => {
    const categories = await Product.distinct("category");

    return res.status(201).json({
        success: true,
        categories
    });
})

module.exports.getSingleProduct = TryCatch(async (req, res, next) => {
    const id = req.params.id;
    const product = await Product.findById(id);
    if (!product) return next(new CustomError("Product Not Found", 404));

    return res.status(200).json({
        success: true,
        product
    });
})

module.exports.updateProduct = TryCatch(async (req, res, next) => {
    const id = req.params.id;
    const product = await Product.findById(id);
    if (!product) return next(new CustomError("Product Not Found", 404));

    const { name, category, stock, address, pincode, description, type, price } = req.body;
    
    if(name) product.name = name;
    if(category) product.category = category;
    if(stock) product.stock = stock;
    if(address) product.address = address;
    if(pincode) product.pincode = pincode;
    if(description) product.description = description;
    if(type) product.type = type;
    if(product.type == "Specialized" && price) product.price = price;

    if(Object.keys(req.files).length >= 1){
        console.log(req.files);
        if(req.files.photo !== undefined){
            const photo = req.files.photo[0];
            if(photo) {
                fs.rm(product.photo, () => {
                  console.log("Old Photo Deleted");
                });
                product.photo = photo.path;
            }
        }

        if(product.type == "Specialized"){
            if(req.files.certifications !== undefined){
                const certifications = req.files.certifications[0];
                if(certifications) {
                    fs.rm(product.certifications, () => {
                        console.log("Old Certificate Deleted");
                    });
                    product.certifications = certifications.path;
                }
            }   
        }
    }


    await product.save();

    return res.status(200).json({
        success: true,
        message: "Product updated successfully"
    });
})

module.exports.deleteProduct = TryCatch(async (req, res, next) => {
    const id = req.params.id;
    const product = await Product.findById(id);
    if (!product) return next(new CustomError("Product Not Found", 404));

    console.log(product);
  
    fs.rm(product.photo, () => {
      console.log("Product Photo Deleted");
    });
    if(product.type == "Specialized"){
        fs.rm(product.certifications, () => {
            console.log("Product Certification Deleted");
        });
    }

    console.log(product);
  
    await product.deleteOne();

    return res.status(200).json({
        success: true,
        message: "Product Deleted Successfully",
    });
})
