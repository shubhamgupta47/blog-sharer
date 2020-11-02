exports.registerEmailParams = (email, token) => {
  return {
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
             <h1>Verify your email address</h1>
             <p>
               Please use the following link to verify your email address
             </p>
             <p>
               ${process.env.CLIENT_URL}/auth/activate/${token}
             </p>
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
};

exports.forgotPasswordParams = (email, token) => {
  return {
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
             <h1>Reset Password</h1>
             <p>
               Please use the following link to reset your password
             </p>
             <p>
               ${process.env.CLIENT_URL}/auth/password/reset/${token}
             </p>
           </html>
         `,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: "Reset Password Link",
      },
    },
  };
};
