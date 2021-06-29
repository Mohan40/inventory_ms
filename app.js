const express = require("express")
const app = express()
const signup_route = require("./routes/signup")
const signin_route = require("./routes/signin")


app.use("/signup", signup_route)
app.use("/signin", signin_route)

app.listen(443, () => {
    console.log("Server is running on port 443...")
})