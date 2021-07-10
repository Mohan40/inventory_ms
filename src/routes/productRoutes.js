//File used to define different product routes with their respective controllers

const express = require("express");
const router = express.Router();
const {
  createProduct,
  searchProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productControllers");
var cookieParser = require("cookie-parser");
const user = require("../models/userModel");
const { loggerError } = require("../logger");

//Middleware to use cookie and JSON parsing
router.use(cookieParser());
router.use(express.json());

//Middleware : Verifying presence of session ID from cookie with DB
const checkSession = (req, res, next) => {
  //console.log(req.sessionID)
  if (req.cookies["connect.sid"]) {
    cookieInfo = req.cookies["connect.sid"];
    sessionID = cookieInfo.substring(2, 38);
    user.find({ session_id: sessionID }, (err, result) => {
      if (err) {
        loggerError.log({
          level: "error",
          email: "Not available",
          message: "Session does not exist in DB.",
        });
        return res
          .status(400)
          .json({ status: "400", message: "Session does not exist in DB." });
      } else {
        //console.log(result[0].email)
        next();
      }
    });
  } else {
    loggerError.log({
      level: "error",
      email: req.body.email,
      message: "Session does not exist.",
    });
    return res
      .status(400)
      .json({ status: "400", message: "Session does not exist." });
  }
};

router.use(checkSession);

const inputValidation = (req, res, next) => {
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
      loggerError.log({
        level: "error",
        email: "Not available",
        message: "Error: Input format is wrong.",
      });
      return res.status(400).json({
        code: "400",
        message: "Error: Input format is wrong.",
      });
    }
  }
  next()
};

router.use(inputValidation);

//Routes and Controllers
router.post("/createproduct", createProduct);
router.get("/searchproduct", searchProduct);
router.patch("/updateproduct", updateProduct);
router.delete("/deleteproduct", deleteProduct);

module.exports = router;
