const mongoose = require("mongoose")
const connectDB = require("./db_connection")
const schema = mongoose.Schema
const AutoIncrement = require('mongoose-sequence')(mongoose);

connectDB()

const user_schema = new schema({
    email : String,
    password : String,
    created_time : {type: Date, default: Date.now()}
})

user_schema.plugin(AutoIncrement, {inc_field: 'user_id'});

const Users = mongoose.model("Users", user_schema)

module.exports = Users