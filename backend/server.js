if(process.env.NODE_ENV!=="production")
{require("dotenv").config()}

const express=require("express");
const cors = require('cors');

const port=process.env.PORT || 4000;
const mongoURI=process.env.MONGO_URI || "";

const app = express();
app.use(express.json());
app.use(cors({
  origin: 'https://crop2door-backend.vercel.app/'
}));

const userRoutes = require("./routes/user");
const productRoutes = require("./routes/product");
const farmRoutes = require("./routes/farm");
const orderRoutes=require("./routes/order");
const { connectDB } = require("./utils/features");
const { errorHandler } = require("./middlewares/errorHandler");

app.use("/api/user", userRoutes);
app.use("/api/product", productRoutes);
app.use("/api/farm", farmRoutes);
app.use("/api/order",orderRoutes);

app.use("/uploads", express.static("uploads"));
app.use(errorHandler);
connectDB(mongoURI);

app.listen(port,()=>{
    console.log(`Server is working on ${port}`);
});
