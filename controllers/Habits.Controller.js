const { logRequestError, logRequestInfo } = require("../middleware/logger/logger");
const { sendServerError, sendError } = require("../util/Responses");
const { CONTROLLER, MESSAGE } = require("../constants/Habits.Constants");
const HabitsService = require("../services/Habits.Service");
const { HTTP_STATUS } = require("../constants/HttpStatus");

exports.createHabit = async (request, response) => {
    try {
        const { name, frequency, notifications } = request.body;

        const newHabit =  await HabitsService.createHabit({
            name: name,
            frequency: frequency,
            notifications: notifications,
            owner: request.user._id
        })
        
        logRequestInfo( request, `${request.user.name} Created a new Habit`, CONTROLLER.CREATE_HABIT )

        return response.status(HTTP_STATUS.CREATED).send({
            status: true,
            data: newHabit,
            message: MESSAGE.HABIT_CREATED
        })
    } catch (error) {
        console.log(error)
        logRequestError( request, MESSAGE.HABIT_CREATION_ERROR, CONTROLLER.CREATE_HABIT )
        sendServerError(response);
    }
}

exports.editHabit = async (request, response) => {
    try {
        const { name, frequency, notifications } = request.body;
        const habitId = request.params.id;

        const updatedHabit = await HabitsService.editHabit(habitId, { name, frequency, notifications });

        logRequestInfo( request, `Habit with ID ${habitId} updated`, CONTROLLER.EDIT_HABIT )

        return response.status(HTTP_STATUS.OK).json({
            status: true,
            message: MESSAGE.HABIT_UPDATED,
            data: updatedHabit,
        });
    } catch (error) {
        console.log(error)
        logRequestError( request, MESSAGE.HABIT_UPDATION_ERROR, CONTROLLER.EDIT_HABIT );
        sendServerError(response);
    }
};

exports.deleteHabit = async (request, response) => {
    try {
        const habitId = request.params.id;

        const deletedHabit = await HabitsService.deleteHabit(habitId);
        if (!deletedHabit) return sendError(response, MESSAGE.NO_HABITS_FOUND);

        logRequestInfo( request, `Habit with ID ${habitId} deleted`, CONTROLLER.DELETE_HABIT );

        return response.status(HTTP_STATUS.OK).json({
            status: true,
            message:MESSAGE.HABIT_DELETED,
        });
    } catch (error) {
        console.log(error)
        logRequestError( request, `Error occurred while deleting a habit`, CONTROLLER.DELETE_HABIT );
        sendServerError(response);
    }
};

exports.getHabitsByUserId = async (request, response) => {
    try {
      const userId = request.user._id;

      const habits = await HabitsService.getHabitsByUserId(userId);
        if (habits.length === 0) {
            return response.status(HTTP_STATUS.OK).json({ status: false, message: MESSAGE.NO_HABITS_FOR_PROVIDED_USER });
        }

      logRequestInfo( request, `Habits for user ${userId} retrieved`, CONTROLLER.GET_HABITS_BY_USERID );
  
      return response.json({
        status: true,
        data: habits,
        message: MESSAGE.HABITS_FETCHED,
      });
    } catch (error) {
      console.log(error)
      logRequestError( request, MESSAGE.HABIT_FETCHING_ERROR, CONTROLLER.GET_HABITS_BY_USERID );
      sendServerError(response);
    }
  };
  