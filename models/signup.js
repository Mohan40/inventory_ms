const mongoose = require("mongoose")
const connectDB = require("./db_connection")
const { connecDB } = require("./db_connection")
const schema = mongoose.Schema

const user_schema = new schema({
    user_id : schema.Types.ObjectId,
    email : String,
    password : String,
    created_time : {type: Date, default: Date.now}
})

connectDB()
const Users = mongoose.model("Users", user_schema)

module.exports = Users