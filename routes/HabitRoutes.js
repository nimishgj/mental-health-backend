const express = require('express');
const { createHabit, editHabit, deleteHabit, getHabitsByUserId } = require('../controllers/Habits.Controller');
const { habitValidation } = require('../validations/Habits.validation');
const { validate } = require('../middleware/Validation.middleware');

const router = express.Router();

router.route("/").post(validate(habitValidation), createHabit);

router.route("/:id").patch(validate(habitValidation), editHabit); 

router.route("/:id").delete(deleteHabit);
router.route("/user/:userId").get(getHabitsByUserId);


module.exports = router;