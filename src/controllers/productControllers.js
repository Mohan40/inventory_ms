//File used to define controllers for product routes

const product = require("../models/productModel");
const { logger } = require("../logger");
const { dbSave, dbFind, dbUpdate, dbDelete } = require("../db/dbOperations");
const { collection, db } = require("../models/productModel");

//Controller for creation of a product route
const createProduct = (req, res) => {
  //Check if the product listing is already avaiable
  const filter = { productName: req.body.productName };
  dbFind(product, filter)
    .then((document) => {
      if (document.length !== 0) {
        logger.log({
          level: "error",
          message: "Product listing already available.",
        });
        return res.status(400).json({
          status: "400",
          message: "Product listing already available.",
        });
      } else {
        //Create the document
        const document = new product({
          productName: req.body.productName,
          productSpecifications: req.body.productSpecifications,
          productQuantity: req.body.productQuantity,
          productPrice: req.body.productPrice,
          deliveryChannel: req.body.deliveryChannel,
        });
        //Save the document
        dbSave(document)
          .then((savedDocument) => {
            logger.log({
              level: "info",
              email: req.body.email,
              message: "Success. Product listing created.",
            });
            return res.status(200).json({
              status: "200",
              message: "Success. Product listing created.",
              product: {
                id: savedDocument.productID,
                name: savedDocument.productName,
              },
            });
          })
          .catch((err) => {
            logger.log({
              level: "error",
              message: "Not able to save the instance.",
            });
            return res.status(400).json({
              code: "400",
              message: "Error creating the product listing.",
            });
          });
      }
    })
    .catch((err) => {
      logger.log({
        level: "error",
        message: "Error generated by find().",
      });
      return res.status(400).json({
        status: "400",
        message: "Error creating the product listing.",
      });
    });
};

//Controller for searching a product route
const searchProduct = (req, res) => {
  //Check if product listing is present in DB
  const filter = { productName: req.body.productName };
  dbFind(product, filter)
    .then((document) => {
      if (document.length === 0) {
        logger.log({
          level: "error",
          message: "No product available.",
        });
        return res.status(400).json({
          status: "400",
          message: "No product available.",
        });
      } else {
        logger.log({
          level: "info",
          message: "Product found.",
        });
        //Send response with product details
        return res.status(200).json({
          status: "200",
          message: "Product found.",
          product: {
            id: document[0].productID,
            name: document[0].productName,
            specifications: document[0].productSpecifications,
            quantity: document[0].productQuantity,
            price: document[0].productPrice,
            deliveryChannel: document[0].deliveryChannel,
          },
        });
      }
    })
    .catch((err) => {
      logger.log({
        level: "error",
        message: "Error generated by find().",
      });
      return res.status(400).json({
        status: "400",
        message: "Error searching for the product listing.",
      });
    });
};

//Controller for updating a product route
const updateProduct = (req, res) => {
  const filter = { productID: req.body.productID };
  let update = {};
  for (let key in req.body) {
    if (key !== "productID") {
      update[key] = req.body[key];
    }
  }
  dbUpdate(product, filter, update)
    .then((document) => {
      logger.log({
        level: "info",
        message: "Successfully updated the product listing.",
      });
      return res.status(200).json({
        status: "200",
        message: "Successfully updated the product listing.",
        product: {
          id: document.productID,
          name: document.productName,
          specifications: document.productSpecifications,
          quantity: document.productQuantity,
          price: document.productPrice,
          deliveryChannel: document.deliveryChannel,
        },
      });
    })
    .catch((err) => {
      logger.log({
        level: "error",
        message: "Error generated by find().",
      });
      return res.status(400).json({
        status: "400",
        message: "Error updating the product listing.",
      });
    });
};

//Controller for deleting a product route
const deleteProduct = (req, res) => {
  //Find and delete the product listing
  filter = { productID: req.body.productID };
  dbDelete(product, filter)
    .then((document) => {
      if (document === null) {
        logger.log({
          level: "error",
          message: "No product available.",
        });
        return res.status(400).json({
          status: "400",
          message: "No product available to delete.",
        });
      } else {
        logger.log({
          level: "info",
          message: "Successfully deleted the product listing.",
        });
        return res.status(200).json({
          status: "200",
          message: "Successfully deleted the product listing.",
        });
      }
    })
    .catch((err) => {
      logger.log({
        level: "error",
        message: "Error in delete function.",
      });
      return res.status(400).json({
        status: "400",
        message: "Unable to delete the product listing.",
      });
    });
};

module.exports = { createProduct, searchProduct, updateProduct, deleteProduct };