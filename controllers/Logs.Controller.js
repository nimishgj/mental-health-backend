const fs = require("fs");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;

const logModel = require("../models/Log.model");
const { logRequestInfo, logRequestError } = require("../middleware/logger/logger");
const { sendError, sendServerError } = require("../util/Responses");
const { MESSAGE} = require("../constants/Logs.Constants")
const { CONTROLLER} = require("../constants/Logs.Constants")
const { HTTP_STATUS } = require("../constants/HttpStatus");

exports.sendLogFile = async (request, response) => {
  try {
    const logs = await logModel.find({});

    if (logs.length === 0) {
      sendError(response,MESSAGE.NO_LOGS_FOUND);
    }

    const csvWriter = createCsvWriter({
      path: "logs.csv",
      header: [
        { id: "logInfo", title: "logInformatio" },
        { id: "filename", title: "filename" },
        { id: "createdAt", title: "Date" },
        { id: "type", title: "type" },
        { id: "level", title: "level" },
        { id: "context", title: "context" },
      ],
    });

    logRequestInfo( request, `${request.user.name} Downloaded the Log File`, CONTROLLER.SEND_LOG_FILE );

    csvWriter
      .writeRecords(logs)
      .then(() => {
        response.setHeader("Content-Type", "text/csv");
        response.setHeader("Content-Disposition", "attachment; filename=logs.csv");

        const fileStream = fs.createReadStream("logs.csv");
        fileStream.pipe(response);

        fileStream.on("end", () => {
          fs.unlinkSync("logs.csv");
        });
      })
      .catch((error) => {
        console.log(error);
        logRequestError( request, MESSAGE.DOWNLOAD_ERROR, CONTROLLER.SEND_LOG_FILE_CSV );
        sendServerError(response);
      });
  } catch (error) {
    console.log(error);
    logRequestError( request, MESSAGE.DOWNLOAD_ERROR, CONTROLLER.SEND_LOG_FILE );
    sendServerError(response);
  }
};

exports.getRecentLogs = async (request, response) => {
  try {
    const logs = await logModel.find({}).sort({ _id: -1 }).limit(10);
    if (logs.length === 0) {
      sendError(response, "No Logs found");
    }

    logRequestInfo( request, `${request.user.name} Fetched Recent 10 Logs`, CONTROLLER.GET_RECENT_LOGS );

    response.status(HTTP_STATUS.OK).json({ success: true, logs });
  } catch (error) {
    console.log(error)
    logRequestError( request, MESSAGE.FETCH_ERROR, CONTROLLER.GET_RECENT_LOGS );
    sendServerError(response);
  }
};
