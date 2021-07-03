const express = require("express");
const router = express.Router();
const product_controller = require("../controllers/product_controllers");

router.use(express.json());

router.post("/createproduct", product_controller.createProduct);
//router.post("/searchproduct", product_controller.searchProduct)
//router.post("/updateproduct", product_controller.updateProduct)
//router.post("/deleteproduct", product_controller.deleteProduct)

module.exports = router;
