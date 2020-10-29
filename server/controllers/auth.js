const AWS = require("aws-sdk");

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const ses = new AWS.SES({ apiVersion: "2010-12-01" });

exports.register = (req, res) => {
  const { name, email, password } = req.body;
  /**
   * https://docs.aws.amazon.com/sdk-for-javascript/
   * v2/developer-guide/ses-examples-sending-email.html
   */
  const params = {
    Destination: {
      ToAddresses: [email],
    },
    Source: process.env.EMAIL_FROM,
    ReplyToAddresses: [process.env.EMAIL_TO],
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `
            <html>
              <body>
                <h1>Hello ${name}</h1>
                <p>Welcome to BlogSharer app. Share your favourite blog links with
                  the BlogSharer community and also view the listed blogs.
                  Just click on the link below so that we can verify you and get started.
                </p>
              </body>
            </html>
          `,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: "Completing the registration",
      },
    },
  };

  const sendEmailOnRegistration = ses.sendEmail(params).promise();

  sendEmailOnRegistration
    .then((data) => {
      console.log("Email sent to the user:", data);
      res.send("Email sent");
    })
    .catch((err) => {
      console.log("ERROR: ", err);
      res.send("Email failed");
    });
};
