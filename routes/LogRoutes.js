const express = require('express');
const { sendLogFile, getRecentLogs } = require('../controllers/Logs.Controller');
const { validateUserBy } = require('../middleware/auth/UserAuthentication');
const router = express.Router();
router.route("/downloadLogs").get(validateUserBy('userId'), sendLogFile);

router.route("/getRecentLogs").get(validateUserBy('userId'), getRecentLogs);
module.exports = router;