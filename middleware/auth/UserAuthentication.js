const { getUserById, getUserByEmail, getUserByUserName } = require("../../services/Users.Service");
const { sendServerError, sendUserNotFoundError } = require("../../util/Responses");
const { HTTP_STATUS } = require("../../constants/HttpStatus");
const { logRequestError } = require("../logger/logger");
const { CastError } = require('mongoose');


exports.validateUserBy = (validationType) => {
  return async(request, response, next) => {
    try {
      let user;
        if(validationType=='email') {
          const email = request.body.email;
          user = await getUserByEmail(email);

        } else if(validationType=='userId') {
          const userId = request.body.userId || request.params.id;
          user = await getUserById(userId);

        } else if(validationType=='username') {
          const username = request.body.username;
          user = await getUserByUserName(username);
        }
  
      if(!user) {
        return response.status(HTTP_STATUS.NOT_FOUND).json({
          status: false,
          message: "No Such User found"
        });
      }

      if (!user.isVerified && request.method !== "PUT" && request.url != "/api/v1/users") {
        return response.status(HTTP_STATUS.BAD_REQUEST).json({
          status: false,
          message: "Please Verify your Account",
        });
      }

      request.user = user;
      next();
      
    } catch (error) {
      if(error instanceof CastError && error.path === '_id'){
        sendUserNotFoundError(response);
      }
      logRequestError(request, "Error occured while feting user", "middleware/UserAuthentication")
      console.log(error)
      sendServerError(response);
    }
  }
}