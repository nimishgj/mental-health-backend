const { HTTP_STATUS } = require("../constants/HttpStatus");
const UsersService = require("../services/Users.Service");
const { sendServerError } = require("../util/Responses");
const { logRequestError } = require("./logger/logger");

exports.validateUserDeatils = async(request,response,next) => {
  try {
    const userEmail = await UsersService.getUserByEmail(request.body.userDetails.email)
    if (userEmail) {
      return response.status(HTTP_STATUS.BAD_REQUEST).json({
        status: false,
        message:
          "Email " + request.body.userDetails.email + " is already taken, please choose another email",
      });
    }

    const userName = await UsersService.getUserByUserName(request.body.userDetails.username);
    if (userName){
      return response.status(HTTP_STATUS.BAD_REQUEST).json({
        status: false,
        message:
          "Username " +
          request.body.userDetails.username +
          " is already taken, please choose another user name",
      });
    }
    next();
  } catch (error) {
    console.log(error);
    logRequestError(request,"Error occured while validation user details","middleware/userDetailsValidation");
    sendServerError(response);
  }
}