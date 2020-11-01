const express = require("express");

const router = express.Router();

// import middlewares
const {
  requiresSignIn,
  authMiddleware,
  adminMiddleware,
} = require("../controllers/auth");

//import from controllers
const { getUser } = require("../controllers/user");

//routes
router.get("/user", requiresSignIn, authMiddleware, getUser);
router.get("/admin", requiresSignIn, adminMiddleware, getUser);

module.exports = router;
