//File used to define products collection schema and convert it to model

const mongoose = require("mongoose");
const schema = mongoose.Schema;
const autoIncrement = require("mongoose-sequence")(mongoose);

//products Schema
const productSchema = new schema({
  productName: {
    type: String,
    required: true,
    minLength: 1,
    maxLength: 30,
    unique: true,
  },
  productSpecifications: {
    type: Object,
    required: true,
    default: "Not available",
  },
  productQuantity: { type: Number, required: true, min: 1, max: 25 },
  productPrice: {
    type: schema.Types.Decimal128,
    required: true,
    min: 1,
    max: 1000000,
  },
  deliveryChannel: {
    type: String,
    enum: ["road", "train", "ship", "air"],
    required: true,
  },
  createdAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date, default: Date.now() },
});

productSchema.plugin(autoIncrement, { inc_field: "productID" });

//products Model
const products = mongoose.model("Products", productSchema);

module.exports = products;
