const express = require('express');
const { createUser, login, verifyUser, changePasswordRequest, changePassword, changeNofiticationPreference, forgotPasswordRequest, forgotPassword } = require('../controllers/Users.Controller');
const { signUpSignInLimiter } = require('../middleware/limiter/limiter');
const { validateUser } = require('../middleware/Validation.middleware');
const router = express.Router();


router.route("/").post(signUpSignInLimiter,validateUser,createUser)
router.route("/").put(verifyUser)
router.route("/changePassword").get(changePasswordRequest)
router.route("/changePassword").post(changePassword)

router.route("/forgotPassword").get(forgotPasswordRequest)
router.route("/changePassword").post(forgotPassword)

router.route("/login").post(signUpSignInLimiter,login)

router.route("/:id/notification-preference").patch(changeNofiticationPreference)
module.exports = router;

