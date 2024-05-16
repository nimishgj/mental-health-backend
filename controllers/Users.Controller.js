const { HTTP_STATUS } = require("../constants/HttpStatus");
const { MESSAGE, CONTROLLER } = require("../constants/Users.Constants");
const { logSignUpInfo, logSignUpError, logLoginInfo, logLoginError, logVerifyInfo, logVerifyError, logRequestInfo, logRequestError } = require("../middleware/logger/logger");
const UsersService = require("../services/Users.Service");
const { sendServerError, sendError } = require("../util/Responses");

exports.createUser = async (request, response) => {
  try {
    const { userDetails } = request.body;

    const user = await UsersService.createUser(userDetails);
    logSignUpInfo( request, `${user.name} Created an Unverified Account`, CONTROLLER.CREATE_USER );

    return response.status(HTTP_STATUS.CREATED).json({
      status: true,
      message: MESSAGE.USER_CREATED,
      user,
    });
  } catch (error) {
    console.log(error);
    logSignUpError( request, MESSAGE.USER_CREATION_ERROR, CONTROLLER.CREATE_USER );
    sendServerError(response);
  }
};

exports.login = async (request, response) => {
  try {
    const { email, password } = request.body;

    await UsersService.loginUser(email, password);

    logLoginInfo(request, `${request.user.name} Logged in`, CONTROLLER.LOGIN );

    return response.status(HTTP_STATUS.OK).json({
      status: true,
      message: MESSAGE.USER_LOGGED_IN,
      user:request.user,
    });
  
  } catch (error) {
    console.log(error);
    logLoginError( request, MESSAGE.USER_LOGIN_ERROR, CONTROLLER.LOGIN );
    sendServerError(response);
  }
};

exports.verifyUser = async (request, response) => {
  try {
    const { token } = request.body;
    const user = request.user;

    await UsersService.verify(user,token);

    logVerifyInfo( request, `${user.name} Verified their Email`, CONTROLLER.VERIFY_EMAIL );
    return response.status(HTTP_STATUS.OK).json({
      status: true,
      message: MESSAGE.USER_VERIFIED,
    });
  } catch (error) {
    if(error.message === "Invalid Verification Token provided"){
      return sendError(response, MESSAGE.INVALID_TOKEN_PROVIDED, HTTP_STATUS.BAD_REQUEST)
    }
    
    if(error.message === "User is already verified"){
      return sendError(response, MESSAGE.USER_ALREADY_VERIFIED, HTTP_STATUS.BAD_REQUEST)
    }

    console.log(error);
    logVerifyError( request, MESSAGE.USER_VERIFICATION_ERROR, CONTROLLER.VERIFY_EMAIL );
    sendServerError(response);
  }
};

exports.changePasswordRequest = async (request, response) => {
  try {
    const user = request.user;

    await UsersService.requestForPasswordChange(user);

    logRequestInfo(request, `${user.name} requested for Password Change`,"UsersController/changePasswordRequest");

    response
      .status(HTTP_STATUS.OK)
      .json({ status: true, message: MESSAGE.EMAIL_SENT });
  } catch (error) {
    console.log(error);
    logRequestError( request, MESSAGE.CHANGE_PASSWORD_VERIFICATION_TOKEN_CREATION_ERROR, CONTROLLER.CHANGE_PASSWORD_REQUEST );
    sendServerError(response);
  }
};


exports.changePassword = async (request, response) => {
  try {
    const { token, password } = request.body;
    const user = request.user;

    await UsersService.changePassword(user,password,token);

    logRequestInfo( request, `${user.name} changed their password`, CONTROLLER.CHANGE_PASSWORD );
    response.send({ status: true, message: MESSAGE.PASSWORD_RESET_SUCCESSFULL });
  } catch (error) {
    console.log(error);
    logRequestError( request, MESSAGE.PASSWORD_RESET_ERROR, CONTROLLER.CHANGE_PASSWORD );
    sendServerError(response);
  }
};


exports.forgotPasswordRequest = async (request, response) => {
  try {
    const user = request.user;

    await UsersService.forgotPasswordRequest(user);
    logRequestInfo(request, `${user.name} forgot their password`,"UsersController/forgotPasswordRequest");

    response.status(HTTP_STATUS.OK).json({
      success: true,
      message: MESSAGE.EMAIL_SENT,
    });
  } catch (error) {
    console.log(error);
    logRequestError( request, MESSAGE.FORGOT_PASSWORD_VERIFICATION_TOKEN_CREATION_ERROR, CONTROLLER.FORGOT_PASSWORD_REQUEST );
    sendServerError(response);
  }
};

exports.deleteUser = async (request, response) => {
  try {
    const user = request.user;

    await UsersService.deleteUserBy(user._id);

    logRequestInfo( request, `${user.name} Deleted their Account`, CONTROLLER.DELETE_USER );
    response.send({ success: true, message: MESSAGE.USER_DELETED });
  } catch (error) {
    console.log(error);
    logRequestError( request, MESSAGE.USER_DELETION_ERROR, CONTROLLER.DELETE_USER );
    sendServerError(response);
  }
};

exports.changeNofiticationPreference = async (request, response) => {
  try {
    const { notificationPreference } = request.body;

    await UsersService.updateNotificationPreference(request.user, notificationPreference);

    logRequestInfo( request, `${user.name} Changed their Notification Preference`, CONTROLLER.CHANGE_NOTIFICATION_PREFERENCE )
    response.send({ success: true, message: MESSAGE.NOTIFICATION_PREFERENCE_CHANGED });

  } catch (error) {
    console.log(error);
    logRequestError( request, MESSAGE.NOTIFICATION_PREFERENCE_CHANGE_ERROR, CONTROLLER.CHANGE_NOTIFICATION_PREFERENCE );
    sendServerError(response);
  }
}
