const express = require('express');
const { createUser, login, verifyUser, changePasswordRequest, changePassword, changeNofiticationPreference, forgotPasswordRequest, deleteUser } = require('../controllers/Users.Controller');
const { signUpSignInLimiter } = require('../middleware/limiter/limiter');
const { validate } = require('../middleware/Validation.middleware');
const { userVerificationSchema, userSchema ,userLoginSchema, changePasswordRequestSchema, changePasswordSchema, forgotPasswordRequestSchema, changeNotificationPreferenceSchema, deleteUserSchema, } = require('../validations/Users.validation');
const { validateUserDeatils } = require('../middleware/UserDetailsValidation.middleware');
const { validateUserBy } = require('../middleware/auth/UserAuthentication');
const router = express.Router();

router.route("/").post(signUpSignInLimiter, validate(userSchema),validateUserDeatils, createUser)
router.route("/").put(validate(userVerificationSchema),validateUserBy('userId'), verifyUser)
router.route("/changePassword").get(validate(changePasswordRequestSchema),validateUserBy('username'), changePasswordRequest)
router.route("/changePassword").post(validate(changePasswordSchema),validateUserBy('email'), changePassword)

router.route("/forgotPassword").get(validate(forgotPasswordRequestSchema),validateUserBy('email'), forgotPasswordRequest)

router.route("/login").post(signUpSignInLimiter,validate(userLoginSchema),validateUserBy('email'), login)

router.route("/:id").delete(validate(deleteUserSchema),validateUserBy('email'), deleteUser)

router.route("/:id/notification-preference").patch(validate(changeNotificationPreferenceSchema),validateUserBy('userId'), changeNofiticationPreference)
module.exports = router;

