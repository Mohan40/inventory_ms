//File used to define controllers for user routes

const { validationResult } = require("express-validator");
const base64 = require("base-64");
const user = require("../models/userModel");
const { logger } = require("../logger");
const { dbSave, dbFind, dbUpdate } = require("../db/dbOperations");

//Signup controller
const signUp = (req, res) => {
  //ValidationResult is from middleware used in signup route
  const errors = validationResult(req);
  //logger.log(errors); For debugging only
  if (!errors.isEmpty()) {
    logger.log({
      level: "error",
      email: req.body.email,
      message: "Invalid email address or password format.",
    });
    return res.status(400).json({
      status: "400",
      message: "Invalid email address or password format.",
    });
  }
  //Checking if email address is already present in DB
  const filter = { email: req.body.email };
  dbFind(user, filter)
    .then((document) => {
      if (document.length !== 0) {
        logger.log({
          level: "error",
          email: req.body.email,
          message: "Email address already in use.",
        });
        return res
          .status(400)
          .json({ code: "400", message: "Email address already in use." });
      } else {
        //Encoding the password in base64 format
        const encodedPassword = base64.encode(req.body.password);
        //Create the document
        const document = new user({
          email: req.body.email,
          password: encodedPassword,
        });
        //If no error occurs when saving the document
        dbSave(document)
          .then((savedDocument) => {
            logger.log({
              level: "info",
              email: req.body.email,
              message: "Success. Account created.",
            });
            return res.status(200).json({
              status: "200",
              message: "Success. Account created.",
              email: req.body.email,
              userID: savedDocument.userID,
            });
          })
          .catch((err) => {
            logger.log({
              level: "error",
              email: req.body.email,
              message: "Not able to save the instance.",
            });
            return res
              .status(400)
              .json({ code: "400", message: "Error while signing up." });
          });
      }
    })
    .catch((err) => {
      logger.log({
        level: "error",
        email: req.body.email,
        message: "Lookup for email failed.",
      });
      return res
        .status(400)
        .json({ code: "400", message: "Error while signing up." });
    });
};

//Signin controller
const signIn = (req, res) => {
  //ValidationResult is from middleware used in signup route
  const errors = validationResult(req);
  //logger.log(errors); For debugging only
  if (!errors.isEmpty()) {
    logger.log({
      level: "error",
      email: req.body.email,
      message: "Invalid email address.",
    });
    return res.status(400).json({
      status: "400",
      message: "Invalid email address.",
    });
  }
  //Find the email address in DB
  const filter = { email: req.body.email };
  dbFind(user, filter)
    .then((document) => {
      if (document.length === 0) {
        logger.log({
          level: "error",
          email: req.body.email,
          message: "Email address not found in database.",
        });
        return res
          .status(400)
          .json({
            code: "400",
            message: "Email address not found in database.",
          });
      } else {
        sessionID = req.sessionID;
        //Decode the encoded password from DB and check with input recieved.
        if (req.body.password === base64.decode(document[0].password)) {
          const filter = { email: req.body.email };
          const update = { sessionID: sessionID };
          dbUpdate(user, filter, update)
            .then((document) => {
              logger.log({
                level: "info",
                email: req.body.email,
                message: "Welcome! Successfully signed in.",
              });
              return res.status(200).json({
                status: "200",
                message: "Welcome! Successfully signed in.",
                email: req.body.email,
                sessionID: sessionID,
              });
            })
            .catch((err) => {
              logger.log({
                level: "error",
                email: req.body.email,
                message: "Updation of session id failed.",
              });
              return res.status(400).json({
                code: "400",
                message: "Error while signing in.",
              });
            });
        } else {
          logger.log({
            level: "error",
            email: req.body.email,
            message: "Wrong Password.",
          });
          return res
            .status(400)
            .json({ code: "400", message: "Passwords don't match." });
        }
      }
    })
    .catch((err) => {
      logger.log({
        level: "error",
        email: req.body.email,
        message: "Signin find() causing error",
      });
      return res
        .status(400)
        .json({ code: "400", message: "Error while signing in." });
    });
};

//Signout controller
const signOut = (req, res) => {
  //ValidationResult is from middleware used in signup route
  const errors = validationResult(req);
  //logger.log(errors); For debugging only
  if (!errors.isEmpty()) {
    logger.log({
      level: "error",
      email: req.body.email,
      message: "Error: Invalid email address.",
    });
    return res.status(400).json({
      status: "400",
      message: "Error: Invalid email address.",
    });
  }
  if (req.session) {
    //console.log(req.sessionID); For debugging only
    //Delete sessionID in request
    delete req.sessionID;
    //Find and delete sessionID in DB
    const filter = { email: req.body.email };
    const update = { sessionID: "None" };
    dbUpdate(user, filter, update)
      .then((document) => {
        if (document === null) {
          logger.log({
            level: "error",
            email: req.body.email,
            message: "Deletion Error: No document to update. Empty document returned.",
          });
          return res
            .status(400)
            .json({ code: "400", message: "Error: Unable to signout." });
        } else {
          //console.log(req.sessionID); For debugging only
          logger.log({
            level: "info",
            email: req.body.email,
            message: "Successfully signed out.",
          });
          //Clear cookie in response
          return res.clearCookie("connect.sid").status(200).json({
            status: "200",
            message: "Successfully signed out.",
            email: req.body.email,
          });
        }
      })
      .catch((err) => {
        console.log(err)
        logger.log({
          level: "error",
          email: req.body.email,
          message: "Update() error: Deletion of session ID failed.",
        });
        return res
          .status(400)
          .json({ code: "400", message: "Error: Unable to signout." });
      });
  }
};

module.exports = { signUp, signIn, signOut };
