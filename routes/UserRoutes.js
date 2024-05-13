const express = require('express');
const { createUser, login, verifyUser, changePasswordRequest, changePassword, changeNofiticationPreference, forgotPasswordRequest, forgotPassword } = require('../controllers/Users.Controller');
const { signUpSignInLimiter } = require('../middleware/limiter/limiter');
const { validate } = require('../middleware/Validation.middleware');
const { userVerificationSchema, userSchema ,userLoginSchema, changePasswordRequestSchema, changePasswordSchema, forgotPasswordRequestSchema, changeNotificationPreferenceSchema, } = require('../validations/Users.validation');
const router = express.Router();

router.route("/").post(signUpSignInLimiter, validate(userSchema), createUser)
router.route("/").put(validate(userVerificationSchema), verifyUser)
router.route("/changePassword").get(validate(changePasswordRequestSchema), changePasswordRequest)
router.route("/changePassword").post(validate(changePasswordSchema), changePassword)

router.route("/forgotPassword").get(validate(forgotPasswordRequestSchema), forgotPasswordRequest)
router.route("/changePassword").post(validate(changePasswordSchema), forgotPassword)

router.route("/login").post(signUpSignInLimiter,validate(userLoginSchema), login)

router.route("/:id/notification-preference").patch(validate(changeNotificationPreferenceSchema), changeNofiticationPreference)
module.exports = router;

