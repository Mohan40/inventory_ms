const { validationResult, cookie } = require("express-validator");
const base64 = require("base-64");
const user = require("../models/user_model");
const { logger_error, logger_info } = require("../logger");

const signUp = (req, res) => {
  const errors = validationResult(req);
  //logger_error.log(errors);
  if (!errors.isEmpty()) {
    logger_error.log({
      level: "error",
      email: req.body.email,
      message: "Invalid email address or password."
    });
    return res
      .status(400)
      .json({ status: "400", message: "Error while signing up." });
  }
  user.find({ email: req.body.email }, (err, result) => {
    if (err) {
      logger_error.log({ level: "error", email: req.body.email, message: "Lookup for email failed." });
      return res
        .status(400)
        .json({ code: "400", message: "Error while signing up." });
    } else if (result.length !== 0) {
      logger_error.log({ level: "error", email: req.body.email, message: "Email address already in use." });
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
          logger_error.log({
            level: "error",
            email: req.body.email,
            message: "Not able to save the instance."
          });
          return res
            .status(400)
            .json({ code: "400", message: "Error while signing up." });
        }
      });
      logger_info.log({
        level: "info",
        email: req.body.email,
        message: "Success. Account created."
      });
      return res
        .status(200)
        .json({ status: "200", message: "Success. Account created." });
    }
  });
};

const signIn = (req, res) => {
  user.find({ email: req.body.email }, (err, result) => {
    if (err) {
      logger_error.log({ level: "error", email: req.body.email, message: "Not able to find email." });
      return res
        .status(400)
        .json({ code: "400", message: "Error while signing in." });
    } else if (result.length === 0) {
      logger_error.log({
        level: "error",
        email: req.body.email,
        message: "Email address not found in database.",
      });
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
              logger_error.log({
                level: "error",
                email: req.body.email,
                message: "Updation of session id failed.",
              });
              return res
                .status(400)
                .json({ code: "400", message: "Error while signing in." });
            }
          }
        ); 
        logger_info.log({
          level: "info",
          email: req.body.email,
          message: "Welcome! Successfully signed in."
        });
        return res.status(200).json({
          status: "200",
          message: "Welcome! Successfully signed in.",
          sessionID: sessionID,
        });
      } else {
        logger_error.log({ level: "error", email: req.body.email, message: "Passwords don't match." });
        return res
          .status(400)
          .json({ code: "400", message: "Error while signing in." });
      }
    }
  });
};

const signOut = (req, res) => {
  if (req.session) {
    logger_error.log(req.sessionID);
    delete req.sessionID;
    user.findOneAndUpdate(
      { email: req.body.email },
      { session_id: "None" },
      { useFindAndModify: false },
      (err, result) => {
        if (err) {
          logger_error.log({
            level: "error",
            email: req.body.email,
            message: "Deletion of session id failed.",
          });
          return res
            .status(400)
            .json({ code: "400", message: "Error while signing out." });
        }
      }
    );
    //console.log(req.sessionID);
    logger_info.log({
      level: "info",
      email: req.body.email,
      message: "Successfully signed out."
    });
    return res.clearCookie("connect.sid").status(200).json({
      status: "200",
      message: "Successfully signed out.",
    });
  }
};

module.exports = { signUp, signIn, signOut };
