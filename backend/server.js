if(process.env.NODE_ENV!=="production")
{require("dotenv").config()}

const express=require("express");
const userRoutes=require("./routes/user");

const { connectDB } = require("./utils/features");
const { errorHandler } = require("./middlewares/errorHandler");
const port=process.env.PORT || 4000;
const mongoURI=process.env.MONGO_URI || "";
const app=express();
app.use(express.json());


app.use("/api/user",userRoutes);

app.use(errorHandler);

connectDB(mongoURI);
app.listen(port,()=>{
    console.log(`Server is wozking on ${port}`);
});