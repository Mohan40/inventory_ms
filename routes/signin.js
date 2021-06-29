const express = require("express");
const router = express.Router();
const base64 = require("base-64");
const Users = require("../models/users");
var session = require("express-session");
const uuid = require("uuid");

//Parses JSON data from request body
router.use(express.json());

//Session.
router.use(
  session({
    genid: (req) => {
      return uuid.v4();
    },
    secret: "teamsWorkKey",
    resave: false,
    saveUninitialized: true,
    rolling : true,
    cookie: { maxAge: 600000 }
  })
); //Expires after 10 minutes

router.post("/", (req, res) => {
  Users.find({ email: req.body.email }, (err, result) => {
    if (err) {
      console.log("Error: Not able to find email.");
      return res
        .status(400)
        .json({ code: "400", message: "Error while signing in." });
    } else if (result.length === 0) {
      console.log("Email address not found in database.");
      return res
        .status(400)
        .json({ code: "400", message: "Error while signing in." });
    } else {
      sessionID = req.sessionID;
      if (req.body.password === base64.decode(result[0].password)) {
        Users.findOneAndUpdate(
          { email: req.body.email },
          { session_id: sessionID },
          { useFindAndModify: false },
          (err, result) => {
            if (err) {
              console.log("Updation of session id failed.");
              return res
                .status(400)
                .json({ code: "400", message: "Error while signing in." });
            }
          }
        );
        return res
          .status(200)
          .json({ status: "200", message: "Welcome! Successfully signed in.", sessionID: sessionID });
      } else {
        console.log("Passwords don't match.");
        return res
          .status(400)
          .json({ code: "400", message: "Error while signing in." });
      }
    }
  });
});

module.exports = router;
