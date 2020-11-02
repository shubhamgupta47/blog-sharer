const express = require("express");

const router = express.Router();

//import from controllers
const {
  register,
  registerActivate,
  login,
  forgotPassword,
  resetPassword,
} = require("../controllers/auth");

//import from validators
const {
  userRegistrationValidator,
  userLoginValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
} = require("../validators/auth");
const { runValidation } = require("../validators");

//routes
router.post("/register", userRegistrationValidator, runValidation, register);
router.post("/register/activate", registerActivate);

router.post("/login", userLoginValidator, runValidation, login);

router.put(
  "/forgot-password",
  forgotPasswordValidator,
  runValidation,
  forgotPassword
);
router.put(
  "/reset-password",
  resetPasswordValidator,
  runValidation,
  resetPassword
);

module.exports = router;
