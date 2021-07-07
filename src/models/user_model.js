const mongoose = require("mongoose");
const schema = mongoose.Schema;
const AutoIncrement = require("mongoose-sequence")(mongoose);

const user_schema = new schema({
  email: { type : String },
  password: { type : String },
  created_time: { type: Date, default: Date.now() },
  session_id: { type: String, default: "None" },
});

user_schema.plugin(AutoIncrement, { inc_field: "user_id" });

const users = mongoose.model("Users", user_schema);

module.exports = users;
