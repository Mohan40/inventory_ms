//File used to define controllers for product routes
const {
  createProductService,
  searchProductService,
  updateProductService,
  deleteProductService,
} = require("../services/productServices");

//Controller for creating a product listing
const createProduct = (req, res) => {
  const filter = { productName: req.body.productName };
  const productInfo = {};
  for (let key in req.body) {
    productInfo[key] = req.body[key];
  }
  //Below service will create a product listing
  createProductService(filter, productInfo, res);
};

//Controller for searching a product listing
const searchProduct = (req, res) => {
  const filter = { productName: req.body.productName };
  //Below service will search for a product listing
  searchProductService(filter, res);
};

//Controller for updating a product listing
const updateProduct = (req, res) => {
  const filter = { productID: req.body.productID };
  let update = {};
  for (let key in req.body) {
    if (key !== "productID") {
      update[key] = req.body[key];
    }
  }
  //Below service will update a product listing
  updateProductService(filter, update, res);
};

//Controller for deleting a product listing
const deleteProduct = (req, res) => {
  filter = { productID: req.body.productID };
  //Below service will delete a product listing
  deleteProductService(filter, res);
};

module.exports = { createProduct, searchProduct, updateProduct, deleteProduct };
