const AWS = require("aws-sdk");
const jwt = require("jsonwebtoken");
const shortId = require("shortid");

// relative imports
const User = require("../models/user");
const { registerEmailParams } = require("../helpers/email");

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const ses = new AWS.SES({ apiVersion: "2010-12-01" });

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

exports.registerActivate = (req, res) => {
  const { token } = req.body;

  jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        error: "Activation link has expired. Please register again",
      });
    }

    const { name, email, password } = jwt.decode(token);
    const username = shortId;

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
