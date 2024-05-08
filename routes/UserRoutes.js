const express = require('express');
const { createUser, login, verifyUser, changePasswordRequest, changePassword, changeNofiticationPreference, forgotPasswordRequest, forgotPassword } = require('../controllers/Users.Controller');
const { signUpSignInLimiter } = require('../middleware/limiter/limiter');
const { validate } = require('../middleware/Validation.middleware');
const { userSchema } = require('../validations/UserValidation');
const { userVerificationSchema } = require('../validations/UserVerification');
const router = express.Router();


router.route("/").post(signUpSignInLimiter, validate(userSchema), createUser)
router.route("/").put(validate(userVerificationSchema), verifyUser)
router.route("/changePassword").get(changePasswordRequest)
router.route("/changePassword").post(changePassword)

router.route("/forgotPassword").get(forgotPasswordRequest)
router.route("/changePassword").post(forgotPassword)

router.route("/login").post(signUpSignInLimiter,login)

router.route("/:id/notification-preference").patch(changeNofiticationPreference)
module.exports = router;

