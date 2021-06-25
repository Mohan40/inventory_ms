const express = require("express")
const app = express()
const signup_route = require("./routes/signup")

app.use("/signup", signup_route)

app.listen(443, () => {
    console.log("Server is running on port 443...")
})