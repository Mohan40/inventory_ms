const { validationResult, cookie } = require("express-validator");
const base64 = require("base-64");
const user = require("../models/user_model");

const signup = (req, res) => {
  const errors = validationResult(req);
  //console.log(errors);
  if (!errors.isEmpty()) {
    console.log("Invalid email address or password.");
    return res
      .status(400)
      .json({ status: "400", message: "Error while signing up." });
  }

  user.find({ email: req.body.email }, (err, result) => {
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
      const user_instance = new user({
        email: req.body.email,
        password: encodedPassword,
      });
      user_instance.save((err) => {
        if (err) {
          console.log("Not able to save the instance.");
          return res
            .status(400)
            .json({ code: "400", message: "Error while signing up." });
        }
      });
      return res
        .status(200)
        .json({ status: "200", message: "Success. Account created." });
    }
  });
};

const signin = (req, res) => {
  user.find({ email: req.body.email }, (err, result) => {
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
        user.findOneAndUpdate(
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
        return res.status(200).json({
          status: "200",
          message: "Welcome! Successfully signed in.",
          sessionID: sessionID,
        });
      } else {
        console.log("Passwords don't match.");
        return res
          .status(400)
          .json({ code: "400", message: "Error while signing in." });
      }
    }
  });
};

const signout = (req, res) => {
  if (req.session) {
    console.log(req.sessionID);
    delete req.sessionID;
    user.findOneAndUpdate(
      { email: req.body.email },
      { session_id: "None" },
      { useFindAndModify: false },
      (err, result) => {
        if (err) {
          console.log("Deletion of session id failed.");
          return res
            .status(400)
            .json({ code: "400", message: "Error while signing out." });
        }
      }
    );
    console.log(req.sessionID);
    return res.clearCookie("connect.sid").status(200).json({
      status: "200",
      message: "Successfully signed out.",
    });
  }
};

module.exports = { signup, signin, signout };
