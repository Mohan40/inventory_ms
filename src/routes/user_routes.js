const express = require("express");
const router = express.Router();
var session = require("express-session");
const uuid = require("uuid");
const { body } = require("express-validator");
const user_controller = require("../controllers/user_controllers");

router.use(express.json());

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

router.post(
  "/signup",
  body("email").isEmail(),
  body("password").isStrongPassword(),
  user_controller.signUp
);
router.post("/signin", user_controller.signIn);
router.post("/signout", user_controller.signOut);

module.exports = router;
