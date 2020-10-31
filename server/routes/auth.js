const express = require("express");

const router = express.Router();

//import from controllers
const { register, registerActivate } = require("../controllers/auth");

//import from validators
const { userRegistrationValidator } = require("../validators/auth");
const { runValidation } = require("../validators");

//routes
router.post("/register", userRegistrationValidator, runValidation, register);
router.post("/register/activate", registerActivate);

module.exports = router;
