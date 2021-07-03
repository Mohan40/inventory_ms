const mongoose = require("mongoose");
const schema = mongoose.Schema;
const AutoIncrement = require("mongoose-sequence")(mongoose);

const product_schema = new schema({
  product_name: String,
  product_specifications: {},
  product_quantity: Number,
  product_price: schema.Types.Decimal128,
  delivery_channel: String,
  created_at: { type: Date, default: Date.now() },
  updated_at: { type: Date, default: Date.now() },
});

product_schema.plugin(AutoIncrement, { inc_field: "product_id" });

const products = mongoose.model("Products", product_schema);

module.exports = products;
