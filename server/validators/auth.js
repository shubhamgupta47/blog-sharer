const { check } = require("express-validator");

exports.userRegistrationValidator = [
  check("name").not().isEmpty().withMessage("Name is required"),
  check("email").isEmail().withMessage("Must be a valid email address"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

exports.userLoginValidator = [
  check("email").isEmail().withMessage("Must be a valid email address"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

exports.forgotPasswordValidator = [
  check("email").isEmail().withMessage("Must be a valid email address"),
];

exports.resetPasswordValidator = [
  check("resetPasswordLink").not().isEmpty().withMessage("Token is required"),
];
