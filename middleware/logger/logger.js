const { LOG_LEVEL } = require("../../constants/LogLevel");
const { LOG_TYPE } = require("../../constants/LogType");
const logModel = require("../../models/Log.model");
const getCurrentContextData = require("../../util/ContextData");

/**
 * Saves log info to the database
 * @param request - request object
 * @param logInfo {string} - log message
 * @param type {string} - log type (sign in, sign out, api requests)
 * @param level {string} - log level (error, warning, info)
 */

exports.log = async (request, logInfo, filename, type, level) => {
  try {
    let context = null;
    if (request) {
      const { ip, country, city, browser, platform, os, device, deviceType } =
        getCurrentContextData(request);

      context = `IP: ${ip}, Country: ${country}, City: ${city}, Device Type: ${deviceType}, Browser: ${browser}, Platform: ${platform}, OS: ${os}, Device: ${device}`;
    }

    const log = new logModel({
      context,
      logInfo,
      type,
      level,
      filename,
    });

    await log.save();
  } catch (error) {
    console.log(error);
  }
};

exports.logRequestInfo = async (request, logInfo, filename) => {
  try {
    let context = null;
    if (request) {
      const { ip, country, city, browser, platform, os, device, deviceType } =
        getCurrentContextData(request);

      context = `IP: ${ip}, Country: ${country}, City: ${city}, Device Type: ${deviceType}, Browser: ${browser}, Platform: ${platform}, OS: ${os}, Device: ${device}`;
    }

    const log = new logModel({
      context,
      logInfo,
      type:LOG_TYPE.REQUEST,
      level:LOG_LEVEL.INFO,
      filename,
    });

    await log.save();
  } catch (error) {
    console.log(error);
  }
};

exports.logRequestError = async (request, logInfo, filename) => {
  try {
    let context = null;
    if (request) {
      const { ip, country, city, browser, platform, os, device, deviceType } =
        getCurrentContextData(request);

      context = `IP: ${ip}, Country: ${country}, City: ${city}, Device Type: ${deviceType}, Browser: ${browser}, Platform: ${platform}, OS: ${os}, Device: ${device}`;
    }

    const log = new logModel({
      context,
      logInfo,
      type:LOG_TYPE.REQUEST,
      level:LOG_LEVEL.ERROR,
      filename,
    });

    await log.save();
  } catch (error) {
    console.log(error);
  }
};

exports.logSignUpInfo = async (request, logInfo, filename) => {
  try {
    let context = null;
    if (request) {
      const { ip, country, city, browser, platform, os, device, deviceType } =
        getCurrentContextData(request);

      context = `IP: ${ip}, Country: ${country}, City: ${city}, Device Type: ${deviceType}, Browser: ${browser}, Platform: ${platform}, OS: ${os}, Device: ${device}`;
    }

    const log = new logModel({
      context,
      logInfo,
      type:LOG_TYPE.SIGN_UP,
      level:LOG_LEVEL.INFO,
      filename,
    });

    await log.save();
  } catch (error) {
    console.log(error);
  }
};

exports.logSignUpError = async (request, logInfo, filename) => {
  try {
    let context = null;
    if (request) {
      const { ip, country, city, browser, platform, os, device, deviceType } =
        getCurrentContextData(request);

      context = `IP: ${ip}, Country: ${country}, City: ${city}, Device Type: ${deviceType}, Browser: ${browser}, Platform: ${platform}, OS: ${os}, Device: ${device}`;
    }

    const log = new logModel({
      context,
      logInfo,
      type:LOG_TYPE.SIGN_UP,
      level:LOG_LEVEL.ERROR,
      filename,
    });

    await log.save();
  } catch (error) {
    console.log(error);
  }
};

exports.logLoginInfo = async (request, logInfo, filename) => {
  try {
    let context = null;
    if (request) {
      const { ip, country, city, browser, platform, os, device, deviceType } =
        getCurrentContextData(request);

      context = `IP: ${ip}, Country: ${country}, City: ${city}, Device Type: ${deviceType}, Browser: ${browser}, Platform: ${platform}, OS: ${os}, Device: ${device}`;
    }

    const log = new logModel({
      context,
      logInfo,
      type:LOG_TYPE.LOGIN,
      level:LOG_LEVEL.INFO,
      filename,
    });

    await log.save();
  } catch (error) {
    console.log(error);
  }
};

exports.logLoginError = async (request, logInfo, filename) => {
  try {
    let context = null;
    if (request) {
      const { ip, country, city, browser, platform, os, device, deviceType } =
        getCurrentContextData(request);

      context = `IP: ${ip}, Country: ${country}, City: ${city}, Device Type: ${deviceType}, Browser: ${browser}, Platform: ${platform}, OS: ${os}, Device: ${device}`;
    }

    const log = new logModel({
      context,
      logInfo,
      type:LOG_TYPE.LOGIN,
      level:LOG_LEVEL.ERROR,
      filename,
    });

    await log.save();
  } catch (error) {
    console.log(error);
  }
};

exports.logVerifyInfo = async (request, logInfo, filename) => {
  try {
    let context = null;
    if (request) {
      const { ip, country, city, browser, platform, os, device, deviceType } =
        getCurrentContextData(request);

      context = `IP: ${ip}, Country: ${country}, City: ${city}, Device Type: ${deviceType}, Browser: ${browser}, Platform: ${platform}, OS: ${os}, Device: ${device}`;
    }

    const log = new logModel({
      context,
      logInfo,
      type:LOG_TYPE.VERIFY,
      level:LOG_LEVEL.INFO,
      filename,
    });

    await log.save();
  } catch (error) {
    console.log(error);
  }
};

exports.logVerifyError = async (request, logInfo, filename) => {
  try {
    let context = null;
    if (request) {
      const { ip, country, city, browser, platform, os, device, deviceType } =
        getCurrentContextData(request);

      context = `IP: ${ip}, Country: ${country}, City: ${city}, Device Type: ${deviceType}, Browser: ${browser}, Platform: ${platform}, OS: ${os}, Device: ${device}`;
    }

    const log = new logModel({
      context,
      logInfo,
      type:LOG_TYPE.VERIFY,
      level:LOG_LEVEL.ERROR,
      filename,
    });

    await log.save();
  } catch (error) {
    console.log(error);
  }
};
