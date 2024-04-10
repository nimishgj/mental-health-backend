const express = require('express');
const { createHabit, editHabit, deleteHabit, getHabitsByUserId } = require('../controllers/Habits.Controller');


const router = express.Router();

router.route("/").post(createHabit);

router.route("/:id").patch(editHabit); 

router.route("/:id").delete(deleteHabit);
router.route("/user/:userId").get(getHabitsByUserId);


module.exports = router;