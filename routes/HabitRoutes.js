const express = require('express');
const { createHabit, editHabit, deleteHabit, getHabitsByUserId } = require('../controllers/Habits.Controller');
const { habitValidation } = require('../validations/Habits.validation');
const { validate } = require('../middleware/Validation.middleware');
const { validateUserBy } = require('../middleware/auth/UserAuthentication');

const router = express.Router();

router.route("/").post(validate(habitValidation),validateUserBy('userId'), createHabit);

router.route("/:id").patch(validate(habitValidation), editHabit); 

router.route("/:id").delete(deleteHabit);
router.route("/user/:id").get(validateUserBy('userId'),getHabitsByUserId);

module.exports = router;