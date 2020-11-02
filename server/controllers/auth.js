const AWS = require("aws-sdk");
const jwt = require("jsonwebtoken");
const shortId = require("shortid");
const expressJwt = require("express-jwt");
const _ = require("lodash");

// relative imports
const User = require("../models/user");
const {
  registerEmailParams,
  forgotPasswordParams,
} = require("../helpers/email");

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const ses = new AWS.SES({ apiVersion: "2010-12-01" });

/**
 * REGISTER
 */
exports.register = (req, res) => {
  const { name, email, password } = req.body;

  /**
   * check if user already exists in database
   */

  // findOne() is better performance wise if we need to find just one thing as here
  // else we also have find(). These are "mongoose" methods
  User.findOne({ email }).exec((err, user) => {
    if (user) {
      return res.status(400).json({
        error: "email already exists",
      });
    }

    /**
     * generate token with user's name, email and password
     */
    const token = jwt.sign(
      { name, email, password },
      process.env.JWT_ACCOUNT_ACTIVATION,
      {
        expiresIn: "10m",
      }
    );

    // send email
    /**
     * https://docs.aws.amazon.com/sdk-for-javascript/
     * v2/developer-guide/ses-examples-sending-email.html
     */

    const params = registerEmailParams(email, token);

    const sendEmailOnRegistration = ses.sendEmail(params).promise();

    sendEmailOnRegistration
      .then((data) => {
        console.log("Email sent to the user:", data);
        res.json({
          message: `An email has been sent to ${email}. Please check your mailbox`,
        });
      })
      .catch((error) => {
        console.log("ERROR: ", error);
        res.status(400).json({
          error:
            "Something went wrong while registering you. Please try again.",
        });
      });
  });
};

/**
 * ACTIVATE
 */
exports.registerActivate = (req, res) => {
  const { token } = req.body;

  jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        error: "Activation link has expired. Please register again",
      });
    }

    const { name, email, password } = jwt.decode(token);
    const username = shortId.generate();

    User.findOne({ email }).exec((err, user) => {
      if (user) {
        return res.status(401).json({
          error: "Email already exists.",
        });
      }

      // registering new user
      const newUser = new User({ username, name, email, password });

      newUser.save((err, user) => {
        if (err) {
          return res.status(401).json({
            error: `
              Something went wrong while saving saving the user in databse.
              Please try again later.
            `,
          });
        }
        return res.json({
          message: "Registration successful. You can now login",
        });
      });
    });
  });
};

/**
 * LOGIN
 */
exports.login = (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email }).exec((err, user) => {
    if (err) {
      return res.status(400).json({
        error: "Something went wrong. Please try again",
      });
    }
    if (!user) {
      return res.status(404).json({
        error:
          "The account with this email was not found. Please create a new one.",
      });
    }

    // authenticate
    if (!user.authenticate(password)) {
      return res.status(400).json({
        error: "Email and password don't match. Please try again.",
      });
    }

    // generate token and send to client
    const { _id, name, email, role } = user;
    const token = jwt.sign({ _id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    return res.json({
      token,
      user: { _id, name, email, role },
    });
  });
};

// auth middleware

exports.requiresSignIn = expressJwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["sha1", "RS256", "HS256"],
});

exports.authMiddleware = (req, res, next) => {
  const authUserId = req.user._id;

  User.findOne({ _id: authUserId }).exec((err, user) => {
    if (err || !user) {
      res.status(400).json({
        error: "User not found",
      });
    }

    req.profile = user;
    next();
  });
};

exports.adminMiddleware = (req, res, next) => {
  const adminUserId = req.user._id;
  User.findOne({ _id: adminUserId }).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User not found",
      });
    }

    if (user.role !== "admin") {
      return res.status(401).json({
        error: "You are not authorized to view this page.",
      });
    }

    req.profile = user;
    next();
  });
};

exports.forgotPassword = (req, res) => {
  const { email } = req.body;

  User.findOne({ email }).exec((err, user) => {
    if (err || !user) {
      return res.status(404).json({
        error: "user for found",
      });
    }

    const token = jwt.sign(
      { name: user.name },
      process.env.JWT_RESET_PASSWORD,
      { expiresIn: "10m" }
    );

    // send email
    const params = forgotPasswordParams(email, token);

    return user.updateOne({ resetPasswordLink: token }, (err, success) => {
      if (err) {
        return res.status(400).json({
          error: "Password reset failed. Try again in a few minutes",
        });
      }
      const sendEmail = ses.sendEmail(params).promise();
      sendEmail
        .then((data) => {
          return res.json({
            message: "email with password reset link has been sent",
            data,
          });
        })
        .catch((error) => {
          return res.status(400).json({
            error,
            message: "something went wrong",
          });
        });
    });
  });
};

exports.resetPassword = (req, res) => {
  const { resetPasswordLink, newPassword } = req.body;
  if (resetPasswordLink) {
    jwt.verify(
      resetPasswordLink,
      process.env.JWT_RESET_PASSWORD,
      (err, success) => {
        if (err) {
          return res.status(400).json({
            error: "Link expired. try again",
          });
          //
        }
        User.findOne({ resetPasswordLink }).exec((err, user) => {
          if (err || !user) {
            return res.status(400).json({
              error: "invalid token. try again",
            });
          }

          const updatedFields = {
            password: newPassword,
            resetPasswordLink: "",
          };

          user = _.extend(user, updatedFields);

          user.save((err, result) => {
            if (err) {
              return res.status(400).json({
                error: "Password reset failed. Try again.",
              });
            }

            return res.json({
              message: "Reset successful. You can now login with new password.",
            });
          });
        });
      }
    );
  }
};
