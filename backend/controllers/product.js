const { TryCatch } = require("../middlewares/errorHandler");
const { Farm } = require("../models/farm");
const { Product } = require("../models/product");
const { User } = require("../models/user");
const turf = require("@turf/turf");
const CustomError = require("../utils/customError");
const fs = require("fs");

module.exports.newProduct = TryCatch(async (req, res, next) => {
    const {id}=req.query;
    const userId = id;
    const { name, category, stock, description, price } = req.body;
    
    
    // let photo = "";
    // if(req.files.photo !== undefined)
    //     photo = req.files.photo[0];
    
    // let certifications = "";
    // if(req.files.certifications !== undefined)
    //     certifications = req.files.certifications[0];

    // if (!photo) return next(new CustomError("Please add Photo", 400));

    if (!name || !category || !stock || !price) {
        fs.rm(photo.path, () => {
            console.log("Deleted photo");
        });

        return next(new CustomError("Please enter All Fields", 400));
    }

    const user = await User.findById(userId);
    let newProduct = new Product({
        name,
        category: category.toLowerCase(),
        stock,
        description,
        price,
        farm: user.farm
    });

    await newProduct.save();

    const farm = await Farm.findById(user.farm);
    farm.products.push(newProduct._id);
    await farm.save();

    return res.status(201).json({
        success: true,
        message: "Product Created Successfully",
    });
});

module.exports.getAllProducts = TryCatch(async (req, res, next) => {
    const { userCoordinates } = req.body;
    const allFarms = await Farm.find({});
    
    let query = `${userCoordinates[0]},${userCoordinates[1]}`;

    allFarms.forEach((farm) => {
        const farmLongitude = farm.coordinates[0];
        const farmLatitude = farm.coordinates[1];
        query += `;${farmLongitude},${farmLatitude}`;
    });
    const baseURl = process.env.MAPBOX_BASE_URL;
    const token = process.env.MAPBOX_TOKEN;

    const response = await fetch(`${baseURl}/directions-matrix/v1/mapbox/driving/${query}?sources=0&annotations=distance,duration&access_token=${token}`);
    
    if (!response.ok)
        return next(new CustomError("Error retreiving appropriate products", 400));

    const jsonData = await response.json();
    const distances = jsonData.distances[0];
    

    let validFarms = [];
    for (let idx = 1; idx < distances.length; idx++) {
        if (distances[idx] <= 500000)
        validFarms.push(allFarms[idx - 1]);
    }

    let products = {};
    
    const productPromises = validFarms.map(async (farm) => {
        for (const id of farm.products) {
            const product = await Product.findById(id);
            console.log(product);
            if (product.name in products) {
                products[product.name].quantity += product.stock;
            } else {
                products[product.name] = { quantity: product.stock };
            }
        }
    });

    await Promise.all(productPromises);

    return res.status(200).json({
        success: true,
        products
    });
})

module.exports.getAllProductsByFarmer = TryCatch(async(req,res,next)=>{
    
    const {id} = req.query;
    const user = await User.findById(id);
    const farmId = user.farm;
    const farm = await Farm.findById(farmId).populate("products");

    return res.status(201).json({
        success: true,
        products:farm.products
    });
})
/*
{
    onion:{
        price:23
        Quantity:526321
    },
    Tomato:{
        price:222
        Quantity:5321
    },

}
 */
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

    const { name, category, stock, description, price } = req.body;

    if (name) product.name = name;
    if (category) product.category = category;
    if (stock) product.stock = stock;
    if (description) product.description = description;
    if (price) product.price = price;

    // if (Object.keys(req.files).length >= 1) {
    //     if (req.files.photo !== undefined) {
    //         const photo = req.files.photo[0];
    //         if (photo) {
    //             fs.rm(product.photo, () => {
    //                 console.log("Old Photo Deleted");
    //             });
    //             product.photo = photo.path;
    //         }
    //     }
    // }

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

    // fs.rm(product.photo, () => {
    //     console.log("Product Photo Deleted");
    // });

    const farmId = product.farm;
    const farm = await Farm.findById(farmId);
    farm.products = farm.products.filter(id => String(id) != product._id);

    await farm.save();
    await product.deleteOne();

    return res.status(200).json({
        success: true,
        message: "Product Deleted Successfully",
    });
})
