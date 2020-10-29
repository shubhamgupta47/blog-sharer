const express = require("express");

const router = express.Router();

//import from controllers
const { register } = require("../controllers/auth");

//import from validators
const { userRegistrationValidator } = require("../validators/auth");
const { runValidation } = require("../validators");

//routes
router.post("/register", userRegistrationValidator, runValidation, register);

module.exports = router;
