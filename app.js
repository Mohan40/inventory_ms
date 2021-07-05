const express = require("express");
const app = express();
const connectDB = require("./src/db_connection");
const user_routes = require("./src/routes/user_routes.js");
const product_routes = require("./src/routes/product_routes");
const { logger_info } = require("./src/logger");

//process.env.NODE_ENV = 'development';

//To execute file in production "PORT=9999 node app.js"
const PORT = process.env.PORT || 443;
connectDB();

app.use("/user", user_routes);
app.use("/product", product_routes);

app.listen(PORT, () => {
  logger_info.log({ level: "info", message: "Server is running on port 443..." });
  console.log("Server is running on port 443...");
});
