const mongoose = require("mongoose")

//const mongoDB = "mongodb://127.0.0.1:27017/inventory_ms_db"
const mongoDB = "mongodb://mohan:azsxdc!23@localhost:27017/inventory_ms_db"
mongoose.connect(mongoDB, {useNewUrlParser:true, useUnifiedTopology: true})

const db = mongoose.connection

db.on("error", () => {
    console.log("MongoDB Error: Connection failed.")
})

module.exports = db
