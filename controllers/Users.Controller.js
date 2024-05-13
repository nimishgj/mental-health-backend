const { HTTP_STATUS } = require("../constants/HttpStatus");
const { LOG_LEVEL } = require("../constants/LogLevel");
const { LOG_TYPE } = require("../constants/LogType");
const { MESSAGE, CONTROLLER } = require("../constants/Users.Constants");
const { log } = require("../middleware/logger/logger");
const Users = require("../models/User.model");
const userVerification = require("../models/UserVerification.model");
const { generateOtp, mailTransport } = require("../util/mails/mail");
const { generateChangePasswordEmailTemplate } = require("../util/mailTemplates/ChangePasswordTemplate");
const { generateForgotPasswordEmailTemplate } = require("../util/mailTemplates/ForgotPassword");
const { generateVerifyUserEmailTemplate } = require("../util/mailTemplates/VerifyUser");
const { sendServerError, sendError } = require("../util/Responses");
const { NODE_ENV } = process.env;

exports.createUser = async (request, response) => {
  try {
    const { name, username, email, password } = request.body;

    const userEmail = await Users.findOne({ email: email });
    if (userEmail)
      return response.status(HTTP_STATUS.BAD_REQUEST).json({
        status: false,
        message:
          "Email " + email + " is already taken, please choose another email",
      });

    const userName = await Users.findOne({ username: username });
    if (userName)
      return response.status(HTTP_STATUS.BAD_REQUEST).json({
        status: false,
        message:
          "Username " +
          username +
          " is already taken, please choose another user name",
      });
    const user = new Users({
      name: name,
      username: username,
      email: email,
      password: password,
    });

    const OTP = generateOtp();

    const verificationToken = new userVerification({
      owner: user._id,
      token: OTP,
    });

    await verificationToken.save();

    log(
      request,
      `${user.name} Generated New Verification Token with ObjectID ${verificationToken._id} for Account Verification`,
      CONTROLLER.CREATE_USER,
      LOG_TYPE.SIGN_UP,
      LOG_LEVEL.INFO
    );

    if (NODE_ENV !== 'development') {
      const emailTemplate = generateVerifyUserEmailTemplate(OTP);

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
            console.log("sent");
            console.log(info.response);
          }
        }
      );
    }

    await user.save();

    log(
      request,
      `${user.name} Created an Unverified Account`,
      CONTROLLER.CREATE_USER,
      LOG_TYPE.SIGN_UP,
      LOG_LEVEL.INFO
    );

    return response.status(HTTP_STATUS.CREATED).json({
      status: true,
      message: MESSAGE.USER_CREATED,
      user,
    });
  } catch (error) {
    console.log(error);
    log(
      request,
      MESSAGE.USER_CREATION_ERROR,
      CONTROLLER.LOGIN,
      LOG_TYPE.LOGIN,
      LOG_LEVEL.INFO
    );

    sendServerError(response);
  }
};

exports.login = async (request, response) => {
  try {
    const { email, password } = request.body;
    
    const user = await Users.findOne({ email: email });
    if (!user)
      return response.status(HTTP_STATUS.BAD_REQUEST).json({
        status: false,
        message: "Email " + email + " is not registered",
      });
    if (!user.isVerified)
      return response.status(HTTP_STATUS.BAD_REQUEST).json({
        status: false,
        message: MESSAGE.VERIFY_USER,
      });

    const isMatch = user.password === password;
    if (!isMatch) {
      return response.status(HTTP_STATUS.BAD_REQUEST).json({
        status: false,
        message: MESSAGE.INCORRECT_PASSWORD,
      });
    } else {
      log(
        request,
        `${user.name}  Logged in `,
        CONTROLLER.LOGIN,
        LOG_TYPE.REQUEST,
        LOG_LEVEL.INFO
      );
      return response.status(HTTP_STATUS.OK).json({
        status: true,
        message: MESSAGE.USER_LOGGED_IN,
        user,
      });
    }
  } catch (error) {
    console.log(error);
    log(
      request,
      MESSAGE.USER_LOGIN_ERROR,
      CONTROLLER.LOGIN,
      LOG_TYPE.LOGIN,
      LOG_LEVEL.INFO
    );

    sendServerError(response);
  }
};

exports.verifyUser = async (request, response) => {
  try {
    const { token, userId } = request.body;

    const user = await Users.findById(userId);
    if (!user) return sendError(response, MESSAGE.USER_NOT_FOUND);
    if (user.isVerified)
      return sendError(response, MESSAGE.USER_ALREADY_VERIFIED);

    const verificationToken = await userVerification.findOne({
      owner: userId,
      token,
    });
    if (!verificationToken) return sendError(response, MESSAGE.INVALID_TOKEN_PROVIDED);

    user.isVerified = true;
    await user.save();
    await userVerification.findByIdAndDelete(verificationToken._id);

    log(
      request,
      `${user.name} Verified their Email`,
      CONTROLLER.VERIFY_EMAIL,
      LOG_TYPE.SIGN_UP,
      LOG_LEVEL.INFO
    );
    response.send({
      success: true,
      message: MESSAGE.USER_VERIFIED
    });
  } catch (error) {
    console.log(error);
    log(
      request,
      MESSAGE.USER_VERIFICATION_ERROR,
      CONTROLLER.VERIFY_EMAIL,
      LOG_TYPE.VERIFY,
      LOG_LEVEL.ERROR
    );
    sendServerError(response);
  }
};

exports.changePasswordRequest = async (request, response) => {
  try {
    const { username } = request.body;

    const user = await Users.findOne({ username: username });

    if (!user) return sendError(response, MESSAGE.USER_NOT_FOUND);

    const OTP = generateOtp();
    const verificationToken = new userVerification({
      owner: user.id,
      token: OTP,
    });

    await verificationToken.save();

    log(
      request,
      `${user.name} Generated New Verification Token with ObjectID ${verificationToken._id} for Password Reset`,
      CONTROLLER.CHANGE_PASSWORD_REQUEST,
      LOG_TYPE.REQUEST,
      LOG_LEVEL.INFO
    );

    if (NODE_ENV !== 'development') {
      const emailTemplate = generateChangePasswordEmailTemplate(OTP);

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
            console.log("sent");
            console.log(info.response);
          }
        }
      );
    }
    response
      .status(HTTP_STATUS.OK)
      .json({ success: true, message: MESSAGE.EMAIL_SENT });
  } catch (error) {
    console.log(error);
    log(
      request,
      MESSAGE.CHANGE_PASSWORD_VERIFICATION_TOKEN_CREATION_ERROR,
      CONTROLLER.CHANGE_PASSWORD_REQUEST,
      LOG_TYPE.REQUEST,
      LOG_LEVEL.ERROR
    );
    sendServerError(response);
  }
};


exports.changePassword = async (request, response) => {
  try {
    const { token, password, email } = request.body;

    const user = await Users.findOne({ email: email });

    if (!user) return sendError(response, MESSAGE.USER_NOT_FOUND);

    const verificationToken = await userVerification.findOne({
      owner: user.id,
      token,
    });
    if (!verificationToken) return sendError(response, MESSAGE.INVALID_TOKEN_PROVIDED);

    user.password = password;
    await user.save();
    await userVerification.findByIdAndDelete(verificationToken._id);

    log(
      request,
      `${user.name} changed their password`,
      CONTROLLER.CHANGE_PASSWORD,
      LOG_TYPE.REQUEST,
      LOG_LEVEL.INFO
    );
    response.send({ success: true, message: MESSAGE.PASSWORD_RESET_SUCCESSFULL });
  } catch (error) {
    console.log(error);
    log(
      request,
      MESSAGE.PASSWORD_RESET_ERROR,
      CONTROLLER.CHANGE_PASSWORD,
      LOG_TYPE.REQUEST,
      LOG_LEVEL.ERROR
    );
    sendServerError(response);
  }
};


exports.forgotPasswordRequest = async (request, response) => {
  try {
    const { email } = request.body;

    const user = await Users.findOne({ email });
    if (!user) return sendError(response, MESSAGE.USER_NOT_FOUND);

    const OTP = generateOtp();

    const verificationToken = new userVerification({
      owner: user._id,
      token: OTP,
    });

    await verificationToken.save();

    log(
      request,
      `${user.name} Generated New Verification Token with ObjectID ${verificationToken._id} for Forgot Password`,
      CONTROLLER.FORGOT_PASSWORD_REQUEST,
      LOG_TYPE.REQUEST,
      LOG_LEVEL.INFO
    );
    if (NODE_ENV !== 'development') {
      const emailTemplate = generateForgotPasswordEmailTemplate(OTP);

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
            console.log("sent");
            console.log(info.response);
          }
        }
      );
    }
    response.status(HTTP_STATUS.OK).json({
      success: true,
      message: MESSAGE.EMAIL_SENT,
    });
  } catch (error) {
    log(
      request,
      MESSAGE.FORGOT_PASSWORD_VERIFICATION_TOKEN_CREATION_ERROR,
      CONTROLLER.FORGOT_PASSWORD_REQUEST,
      LOG_TYPE.REQUEST,
      LOG_LEVEL.ERROR
    );
    sendServerError(response);
  }
};

exports.forgotPassword = async (request, response) => {
  try {
    const { email, token, password } = request.body;

    const user = await Users.findOne({ email });
    if (!user) return sendError(response, MESSAGE.USER_NOT_FOUND);

    const verificationToken = await userVerification.findOne({
      owner: user._id,
      token,
    });
    if (!verificationToken) return sendError(response, MESSAGE.INVALID_TOKEN_PROVIDED);

    user.password = password;
    await user.save();
    await userVerification.findByIdAndDelete(verificationToken._id);

    log(
      request,
      `${user.name} changed their password`,
      CONTROLLER.FORGOT_PASSWORD,
      LOG_TYPE.REQUEST,
      LOG_LEVEL.INFO
    );

    response.send({
      success: true,
      message: MESSAGE.PASSWORD_RESET_SUCCESSFULL,
    });
  } catch (error) {
    log(
      request,
      MESSAGE.PASSWORD_RESET_ERROR,
      CONTROLLER.FORGOT_PASSWORD,
      LOG_TYPE.REQUEST,
      LOG_LEVEL.INFO
    );
    sendServerError(response);
  }
};

exports.deleteUser = async (request, response) => {
  try {
    const { email } = request.body;

    const user = await Users.findOne({ email: email });

    if (!user) return sendError(response, MESSAGE.USER_NOT_FOUND);

    await Users.findByIdAndDelete(user.id);

    log(
      request,
      `${user.name} Deleted their Account`,
      CONTROLLER.DELETE_USER,
      LOG_TYPE.REQUEST,
      LOG_LEVEL.INFO
    );
    response.send({ success: true, message: MESSAGE.USER_DELETED });
  } catch (error) {
    console.log(error);
    log(
      request,
      MESSAGE.USER_DELETION_ERROR,
      CONTROLLER.DELETE_USER,
      LOG_TYPE.REQUEST,
      LOG_LEVEL.INFO
    );
    sendServerError(response);
  }
};

exports.changeNofiticationPreference = async (request, response) => {
  try {
    const userId = request.params.id;
    const { notificationPreference } = request.body;

    const user = await Users.findOne({ _id: userId });
    if (!user) return sendError(response, MESSAGE.USER_NOT_FOUND);
    user.notificationPreference = notificationPreference;
    await user.save();
    log(
      request,
      `${user.name} Changed their Notification Preference`,
      CONTROLLER.CHANGE_NOTIFICATION_PREFERENCE,
      LOG_TYPE.REQUEST,
      LOG_LEVEL.INFO
    )
    response.send({ success: true, message: MESSAGE.NOTIFICATION_PREFERENCE_CHANGED });

  } catch (error) {
    log(
      request,
      MESSAGE.NOTIFICATION_PREFERENCE_CHANGE_ERROR,
      CONTROLLER.CHANGE_NOTIFICATION_PREFERENCE,
      LOG_TYPE.REQUEST,
      LOG_LEVEL.ERROR
    );
    console.log(error);
    sendServerError(response);
  }
}
