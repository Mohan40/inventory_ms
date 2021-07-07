const express = require("express");
const router = express.Router();
const product_controller = require("../controllers/product_controllers");
const session = require("express-session");
var cookieParser = require("cookie-parser");
const user = require("../models/user_model");
const { logger_error, logger_info } = require("../logger");

router.use(cookieParser());
router.use(express.json());

const checkSession = (req, res, next) => {
  //console.log(req.sessionID)
  if (req.cookies["connect.sid"]) {
    cookieInfo = req.cookies["connect.sid"];
    sessionID = cookieInfo.substring(2, 38);
    user.find({ session_id: sessionID }, (err, result) => {
      if (err) {
        logger_error.log({
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
    logger_error.log({
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

router.post("/createproduct", product_controller.createProduct);
router.get("/searchproduct/:productName", product_controller.searchProduct);
router.patch("/updateproduct", product_controller.updateProduct)
router.post("/deleteproduct", product_controller.deleteProduct)

module.exports = router;
