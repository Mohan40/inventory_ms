//File used to define controllers for user routes

const { response } = require("express");
const { validationResult } = require("express-validator");
const {
  validationError,
  signupService,
  signinService,
  signoutService,
} = require("../services/userServices");

//Signup controller
const signUp = async (req, res) => {
  //ValidationResult is from middleware used in signup route
  const errors = validationResult(req);
  const email = req.body.email;
  const password = req.body.password;
  const filter = { email: req.body.email };

  //Display error if input format is wrong
  await validationError(errors, email, res);
  //Signup Service to add user details to DB
  signupService(filter, email, password, res);
};

//Signin controller
const signIn = async (req, res) => {
  //ValidationResult is from middleware used in signup route
  const errors = validationResult(req);
  const email = req.body.email;
  const password = req.body.password;
  const sessionID = req.sessionID;
  const filter = { email: req.body.email };
  const update = { sessionID: req.sessionID };

  //Display error if input format is wrong
  await validationError(errors, email, res);
  //Signin service to verify user credentials in DB
  signinService(filter, update, email, password, sessionID, res);
};

//Signout controller
const signOut = async (req, res) => {
  //ValidationResult is from middleware used in signup route
  const errors = validationResult(req);
  const email = req.body.email;

  //Display error if input format is wrong
  await validationError(errors, email, res);
  //Service to will delete the sessionID and signout the user
  signoutService(req, res);
};

module.exports = { signUp, signIn, signOut };
