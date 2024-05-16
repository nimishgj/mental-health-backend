const { logSignUpInfo, logSignUpError, logRequestError, logVerifyError } = require("../../middleware/logger/logger");
const userVerification = require("../../models/UserVerification.model");
const { sendServerError } = require("../Responses");
const { generateChangePasswordEmailTemplate } = require("../mailTemplates/ChangePasswordTemplate");
const { generateForgotPasswordEmailTemplate } = require("../mailTemplates/ForgotPassword");
const { generateVerifyUserEmailTemplate } = require("../mailTemplates/VerifyUser");
const { generateOtp, mailTransport } = require("../mails/mail");

exports.createUserVerifcation = async(reason, user) => {
try {
  const OTP = generateOtp();

  const verificationToken = new userVerification({
    owner: user._id,
    token: OTP,
  });

  await verificationToken.save();

  if (process.env.NODE_ENV !== 'development') {
    let emailTemplate;
    if (reason == 'unverified account'){
      emailTemplate = generateVerifyUserEmailTemplate(OTP);
    } else if( reason == 'forgot password'){
      emailTemplate = generateForgotPasswordEmailTemplate(OTP);
    } else if(reason == 'change password') {
      emailTemplate = generateChangePasswordEmailTemplate(OTP);
    }

    mailTransport().sendMail(
      {
        from: "test.mail.nimish@gmail.com",
        to: user.email,
        subject: "Verify your email account",
        html: emailTemplate,
      },
      (err, info) => {
        if (err) {
          console.log(err);
        } else {
          console.log("Mail sent Succesfully");
          console.log(info.response);
        }
      }
    );
  }
} catch (error) {
  console.log(error);
  throw error;
}
}
