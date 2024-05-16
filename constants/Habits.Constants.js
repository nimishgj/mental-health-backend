exports.MESSAGE ={
    USER_NOT_FOUND:"No such user found.",
    HABIT_CREATED:"Habit Created Successfully",
    HABIT_CREATION_ERROR:`Error Occured While Creating a Habit`,
    CANNOT_EDIT_MESSAGE:"Please provide at least one field to update",
    NO_HABITS_FOUND:"No such habit found.",
    HABIT_UPDATED:"Habit updated successfully",
    HABIT_UPDATION_ERROR:`Error occurred while updating a habit`,
    HABIT_DELETED:"Habit deleted successfully",
    NO_HABITS_FOR_PROVIDED_USER:"No habits found for the Provided UserId",
    HABITS_FETCHED:"Habits fetched successfully",
    HABIT_FETCHING_ERROR:`Error occurred while fetching habits`,
    INVALID_USER_ID:'Invalid UserId provided'
}

exports.CONTROLLER = {
    GET_HABITS_BY_USERID: "controllers/Habit.controller.js/getHabitsByUserId",
    DELETE_HABIT:"controllers/Habit.controller.js/deleteHabit",
    EDIT_HABIT:"controllers/Habit.controller.js/editHabit",
    CREATE_HABIT:"controllers/Habit.controller.js/createHabit"
}