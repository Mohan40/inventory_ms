const mongoose = require("mongoose");
const schema = mongoose.Schema;
const AutoIncrement = require("mongoose-sequence")(mongoose);

const product_schema = new schema({
  product_name: { type: String, required: true, minLength: 1, maxLength: 30, unique: true },
  product_specifications: {
    type: Object,
    required: true,
    default: "Not available",
  },
  product_quantity: { type: Number, required: true, min: 1, max: 25 },
  product_price: {
    type: schema.Types.Decimal128,
    required: true,
    min: 1,
    max: 1000000,
  },
  delivery_channel: {
    type: String,
    enum: ["road", "train", "ship", "air"],
    required: true,
  },
  created_at: { type: Date, default: Date.now() },
  updated_at: { type: Date, default: Date.now() },
});

product_schema.plugin(AutoIncrement, { inc_field: "product_id" });

const products = mongoose.model("Products", product_schema);

module.exports = products;
