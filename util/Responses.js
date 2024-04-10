const { HTTP_STATUS } = require("../constants/HttpStatus");

exports.sendError = (response, error, status = 300) => {
  response.status(status);
  response.json({ success: false, message: error });
};

exports.sendInvalidParameterResponse = (response) => {
  response.status(HTTP_STATUS.BAD_REQUEST);
  response.json({ success: false, error: "Invalid Request,Missing Parameters" });
};

exports.sendServerError = (response) => {
  response.status(HTTP_STATUS.INTERNAL_SERVER_ERROR);
  response.json({ success: false, error: "Internal Server Error" });
};
