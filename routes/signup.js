const express = require("express")
const router = express.Router()
const { validationResult, body } = require("express-validator")
const base64 = require('base-64');
const signup_model = require("../models/signup")

//Parses JSON data from request body
router.use(express.json())

router.post("/", body("email").isEmail(), body("password").isStrongPassword(), (req, res) => {
    const errors = validationResult(req)
    console.log(errors)
    if(!errors.isEmpty()) {
        console.log("Invalid email address or password.")
        return res.status(400).json({"status": "400", "message": "Error while signing up."})
    }
    
    const encodedPassword = base64.encode(req.body.password)
    console.log(encodedPassword)

    const signup_model_instance = new signup_model({
        email : req.body.email,
        password : encodedPassword
    })
    signup_model_instance.save((err) => {
        if (err) {
            console.log("Error: Cannot create model instance.")
        }
    })
    //const decodedPassword = base64.decode(encodedPassword)
    //console.log(decodedPassword)
    res.send("Success")
})

module.exports = router