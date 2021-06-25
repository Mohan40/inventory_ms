const mongoose = require("mongoose")
const db_conn = require("./db_connection")
const schema = mongoose.Schema

const signup_schema = new schema({
    user_id : schema.Types.ObjectId,
    email : String,
    password : String,
    created_time : {type: Date, default: Date.now}
})

const signup_model = mongoose.model("signup_model", signup_schema)

module.exports = signup_model