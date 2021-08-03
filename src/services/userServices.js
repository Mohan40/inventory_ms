//File for services that do certain tasks when called from user controller

const base64 = require("base-64");
const user = require("../models/userModel");
const { logger } = require("../logger");
const { dbSave, dbFind, dbUpdate } = require("../db/dbOperations");

//Display error when input format is wrong
const validationError = (errors, email, res) => {
  //logger.log(errors); For debugging only
  if (!errors.isEmpty()) {
    logger.log({
      level: "error",
      email: email,
      message: "Error: Invalid input format.",
    });
    return res.status(400).json({
      status: "400",
      message: "Error: Invalid input format.",
    });
  }
};

//Signup Service to add user details to DB
const signupService = (filter, email, password, res) => {
  if (res.statusCode !== 400) {
    //Check if the user is already signed up.
    dbFind(user, filter)
      .then((document) => {
        if (document.length !== 0) {
          logger.log({
            level: "error",
            email: email,
            message: "Email address already in use.",
          });
          return res
            .status(400)
            .json({ code: "400", message: "Email address already in use." });
        } else {
          //Encoding the password in base64 format
          const encodedPassword = base64.encode(password);
          //Create the document
          const document = new user({
            email: email,
            password: encodedPassword,
          });
          //Save the user credentials to DB
          dbSave(document)
            .then((savedDocument) => {
              logger.log({
                level: "info",
                email: email,
                message: "Success. Account created.",
              });
              return res.status(200).json({
                status: "200",
                message: "Success. Account created.",
                email: email,
                userID: savedDocument.userID,
              });
            })
            .catch((err) => {
              logger.log({
                level: "error",
                email: email,
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
          email: email,
          message: "Lookup for email failed.",
        });
        return res
          .status(400)
          .json({ code: "400", message: "Error while signing up." });
      });
  }
};

//Signin service to verify user credentials in DB
const signinService = (filter, update, email, password, sessionID, res) => {
  if (res.statusCode !== 400) {
    //Check if the user credentials are in DB
    dbFind(user, filter)
      .then((document) => {
        if (document.length === 0) {
          logger.log({
            level: "error",
            email: email,
            message: "Email address not found in database.",
          });
          return res.status(400).json({
            code: "400",
            message: "Email address not found in database.",
          });
        } else {
          //Decode the encoded password from DB and check with input recieved.
          if (password === base64.decode(document[0].password)) {
            //Update the generated sessionID in DB
            dbUpdate(user, filter, update)
              .then((document) => {
                logger.log({
                  level: "info",
                  email: email,
                  message: "Welcome! Successfully signed in.",
                });
                return res.status(200).json({
                  status: "200",
                  message: "Welcome! Successfully signed in.",
                  email: email,
                  sessionID: sessionID,
                });
              })
              .catch((err) => {
                logger.log({
                  level: "error",
                  email: email,
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
              email: email,
              message: "Wrong Password.",
            });
            return res
              .status(400)
              .json({ code: "400", message: "Wrong Password." });
          }
        }
      })
      .catch((err) => {
        logger.log({
          level: "error",
          email: email,
          message: "Signin find() causing error",
        });
        return res
          .status(400)
          .json({ code: "400", message: "Error while signing in." });
      });
  }
};

//Service to will delete the sessionID and signout the user
const signoutService = (req, res) => {
  if (res.statusCode !== 400) {
    if (req.session) {
      //console.log(req.sessionID); For debugging only
      //Delete sessionID in request
      delete req.sessionID;
      const filter = { email: req.body.email };
      const update = { sessionID: "None" };
      //Remove the sessionID in DB
      dbUpdate(user, filter, update)
        .then((document) => {
          if (document === null) {
            logger.log({
              level: "error",
              email: req.body.email,
              message:
                "Deletion Error: No document to update. Empty document returned.",
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
  }
};

module.exports = {
  validationError,
  signupService,
  signinService,
  signoutService,
};
