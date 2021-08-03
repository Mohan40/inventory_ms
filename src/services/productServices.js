//File for services that do certain tasks when called from product controller

const product = require("../models/productModel");
const { logger } = require("../logger");
const { dbSave, dbFind, dbUpdate, dbDelete } = require("../db/dbOperations");

//Service to create a product listing
const createProductService = (filter, productInfo, res) => {
  //Check if the product listing is already available in DB
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
          productName: productInfo.productName,
          productSpecifications: productInfo.productSpecifications,
          productQuantity: productInfo.productQuantity,
          productPrice: productInfo.productPrice,
          deliveryChannel: productInfo.deliveryChannel,
        });
        //Save the document in DB
        dbSave(document)
          .then((savedDocument) => {
            logger.log({
              level: "info",
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

//Service to search for a product listing
const searchProductService = (filter, res) => {
  //Check for the product listing in DB
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

//Service to update a product listing
const updateProductService = (filter, update, res) => {
  //Find and update the product listing with updated data present in "update"
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

//Service to delete a product listing
const deleteProductService = (filter, res) => {
  //Find and delete the product listing
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

module.exports = {
  createProductService,
  searchProductService,
  updateProductService,
  deleteProductService,
};