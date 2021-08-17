//Database connection and routes setup file

const express = require("express");
const app = express();
const connectDB = require("./src/db/dbConnection");
const userRoutes = require("./src/routes/userRoutes");
const productRoutes = require("./src/routes/productRoutes");

//Connecting to the database 
connectDB();
//Middleware to connect to routes
app.use("/user", userRoutes);
app.use("/product", productRoutes);

module.exports = app
