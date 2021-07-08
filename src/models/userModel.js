//File used to define users collection schema and convert it to model

const mongoose = require("mongoose");
const schema = mongoose.Schema;
const autoIncrement = require("mongoose-sequence")(mongoose);

//users Schema
const userSchema = new schema({
  email: { type: String },
  password: { type: String },
  createdTime: { type: Date, default: Date.now() },
  sessionID: { type: String, default: "None" },
});

userSchema.plugin(autoIncrement, { inc_field: "userID" });

//users Model
const users = mongoose.model("Users", userSchema);

module.exports = users;
