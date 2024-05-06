const { HTTP_STATUS } = require("../constants/HttpStatus") ;
const { userSchema } = require('../validations/UserValidation');

exports.validateUser  = async (request, response, next) => {
  try {
    console.log("Started execution");
    await userSchema.validate(request.body, { abortEarly: false });
    next();
  } catch (error) {
    console.log(error);
    console.log("Error occured");
    return response.status(HTTP_STATUS.BAD_REQUEST).json({error: error.errors});
  }
}

