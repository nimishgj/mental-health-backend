const express = require('express');
const { sendLogFile, getRecentLogs } = require('../controllers/Logs.Controller');
const router = express.Router();

router.route("/downloadLogs").get(sendLogFile);

router.route("/getRecentLogs").get(getRecentLogs);
module.exports = router;