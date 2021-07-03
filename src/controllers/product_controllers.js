const product = require("../models/product_model");
const logger = require("../logger");

const createProduct = (req, res) => {
  console.log("Test: Product Created");
};

module.exports = { createProduct };
