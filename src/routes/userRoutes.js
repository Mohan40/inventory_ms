//File used to define different user routes with their respective controllers

const express = require("express");
const router = express.Router();
var session = require("express-session");
const uuid = require("uuid");
const { body } = require("express-validator");
const { signUp, signIn, signOut } = require("../controllers/userControllers");

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
