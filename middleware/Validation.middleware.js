const { HTTP_STATUS } = require("../constants/HttpStatus") ;

exports.validate = (schema) => {
  return (request, response, next) => {
    schema.validate(request.body, { abortEarly: false })
      .then(() => {
        next();
      })
      .catch((error) => {
        response.status(HTTP_STATUS.BAD_REQUEST).json({ error: error.errors });
      });
  };
};

