const express = require("express")
const app = express()
const connectDB = require("./src/db_connection")
const user_routes = require("./src/routes/user_routes.js")

connectDB()

app.use("/user", user_routes)

app.listen(443, () => {
    console.log("Server is running on port 443...")
})