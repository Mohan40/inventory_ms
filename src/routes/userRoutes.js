//File used to define different user routes with their respective controllers

const express = require("express");
const router = express.Router();
var session = require("express-session");
const uuid = require("uuid");
const { body } = require("express-validator");
const { signUp, signIn, signOut } = require("../controllers/userControllers");
const { loggerError } = require("../logger");

//Middleware to JSON parsing
router.use(express.json());

//Middleware : Session ID generation
router.use(
  session({
    genid: (req) => {
      return uuid.v4();
    },
    secret: "teamsWorkKey",
    resave: false,
    saveUninitialized: true,
    rolling: true,
    cookie: { maxAge: 600000 },
  })
);

const inputValidation = (req, res, next) => {
  const userKeysList = ["email", "password"];
  for (let key in req.body) {
    if (userKeysList.includes(key) !== true) {
      loggerError.log({
        level: "error",
        email: "Not available",
        message: "Error: Input format is wrong.",
      });
      return res.status(400).json({
        code: "400",
        message: "Error: Input format is wrong.",
      });
    }
  }
  next();
};

router.use(inputValidation);

//Routes and Controllers
router.post(
  "/signup",
  body("email").isEmail(),
  body("password").isStrongPassword(),
  signUp
);
router.post("/signin", signIn);
router.post("/signout", signOut);

module.exports = router;
