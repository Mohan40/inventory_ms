const express = require("express");
const router = express.Router();
const { validationResult, body } = require("express-validator");
const base64 = require("base-64");
const Users = require("../models/signup");

//Parses JSON data from request body
router.use(express.json());

router.post(
  "/",
  body("email").isEmail(),
  body("password").isStrongPassword(),
  (req, res) => {
    const errors = validationResult(req);
    //console.log(errors);
    if (!errors.isEmpty()) {
      console.log("Invalid email address or password.");
      return res
        .status(400)
        .json({ status: "400", message: "Error while signing up." });
    }

    Users.find({ email: req.body.email }, (err, result) => {
      if (err) {
        console.log("Lookup for email failed.");
        return res
          .status(400)
          .json({ code: "400", message: "Error while signing up." });
      } else if (result.length !== 0) {
        console.log("Email address already in use.");
        return res
          .status(400)
          .json({ code: "400", message: "Error while signing up." });
      } else {
        const encodedPassword = base64.encode(req.body.password);
        //console.log(encodedPassword)
        const Users_instance = new Users({
          email: req.body.email,
          password: encodedPassword,
        });
        Users_instance.save((err) => {
          if (err) {
            console.log("Error: Cannot create model instance.");
          }
        });
        return res.status(400).json({"status" : "200", "message" : "Success. Account created."})
      }
    });
    //const decodedPassword = base64.decode(encodedPassword)
    //console.log(decodedPassword)
  }
);

module.exports = router;
