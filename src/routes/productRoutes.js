//File used to define different product routes with their respective controllers

const express = require("express");
const router = express.Router();
const {
  createProduct,
  searchProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productControllers");
const cookieParser = require("cookie-parser");
const user = require("../models/userModel");
const { logger } = require("../logger");
const { dbFind } = require("../db/dbOperations");

//Middleware to use cookie and JSON parsing
router.use(cookieParser());
router.use(express.json());

//Middleware : Verifying presence of session ID from cookie with DB
const checkSession = (req, res, next) => {
  async function getSessionID() {
    if (req.cookies["connect.sid"]) {
      cookieInfo = req.cookies["connect.sid"];
      return cookieInfo.substring(2, 38);
    } else {
      return null;
    }
  }

  async function checkSessioninDB() {
    const sessionID = await getSessionID();
    const filter = { sessionID: sessionID };
    dbFind(user, filter)
      .then((document) => {
        if (document.length !== 0) {
          next();
        } else {
          logger.log({
            level: "error",
            message: "Session does not exist in DB.",
          });
          return res
            .status(400)
            .json({ status: "400", message: "Session does not exist." });
        }
      })
      .catch((err) => {
        logger.log({
          level: "error",
          message: "Session does not exist in DB.",
        });
        return res
          .status(400)
          .json({ status: "400", message: "Session does not exist." });
      });
  }

  checkSessioninDB();
};

router.use(checkSession);

const inputValidationForCreation = (req, res, next) => {
  const productKeysList = [
    "productID",
    "productName",
    "productSpecifications",
    "productQuantity",
    "productPrice",
    "deliveryChannel",
  ];
  for (let key in req.body) {
    if (productKeysList.includes(key) !== true) {
      logger.log({
        level: "error",
        message: "Error: Input format is wrong.",
      });
      return res.status(400).json({
        code: "400",
        message: "Error: Input format is wrong.",
      });
    }
  }
  next();
};

const inputValidationForSearch = (req, res, next) => {
  for (let key in req.body) {
    if (key !== "productName") {
      logger.log({
        level: "error",
        message: "Error: Input format is wrong.",
      });
      return res.status(400).json({
        code: "400",
        message: "Error: Input format is wrong.",
      });
    }
  }
  next();
};

const inputValidationForUpdation = (req, res, next) => {
  const productKeysList = [
    "productID",
    "productSpecifications",
    "productQuantity",
    "productPrice",
  ];
  for (let key in req.body) {
    if (productKeysList.includes(key) !== true) {
      logger.log({
        level: "error",
        message: "Error: Input format is wrong.",
      });
      return res.status(400).json({
        code: "400",
        message: "Error: Input format is wrong.",
      });
    }
  }
  next();
};

const inputValidationForDeletion = (req, res, next) => {
  for (let key in req.body) {
    if (key !== "productID") {
      logger.log({
        level: "error",
        message: "Error: Input format is wrong.",
      });
      return res.status(400).json({
        code: "400",
        message: "Error: Input format is wrong.",
      });
    }
  }
  next();
};

//Routes and Controllers
router.post("/createproduct", inputValidationForCreation, createProduct);
router.get("/searchproduct", inputValidationForSearch, searchProduct);
router.patch("/updateproduct", inputValidationForUpdation, updateProduct);
router.delete("/deleteproduct", inputValidationForDeletion, deleteProduct);

module.exports = router;
