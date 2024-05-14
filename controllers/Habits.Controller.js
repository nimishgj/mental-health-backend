const { LOG_LEVEL } = require("../constants/LogLevel");
const { LOG_TYPE } = require("../constants/LogType");
const { log } = require("../middleware/logger/logger");
const { sendServerError, sendError } = require("../util/Responses");
const Users = require("../models/User.model");
const { CONTROLLER, MESSAGE } = require("../constants/Habits.Constants");
const HabitsService = require("../services/Habits.Service");
const { HTTP_STATUS } = require("../constants/HttpStatus");

exports.createHabit = async (request, response) => {
    try {
        const { name, frequency, notifications, userId } = request.body;

        const user = await Users.findOne({ _id: userId });
        if (!user) return sendError(response, MESSAGE.USER_NOT_FOUND);
        const newHabit =  await HabitsService.createHabit({
            name: name,
            frequency: frequency,
            notifications: notifications,
            owner: user._id
        })
        log(
            request,
            `${user.name} Created a new Habit`,
            CONTROLLER.CREATE_HABIT,
            LOG_TYPE.REQUEST,
            LOG_LEVEL.INFO
        )
        return response.status(HTTP_STATUS.CREATED).send({
            status: true,
            data: newHabit,
            message: MESSAGE.HABIT_CREATED
        })
    } catch (error) {
        console.log(error);
        log(
            request,
            MESSAGE.HABIT_CREATION_ERROR,
            CONTROLLER.CREATE_HABIT,
            LOG_TYPE.REQUEST,
            LOG_LEVEL.ERROR
        )
        sendServerError(response);
    }
}

exports.editHabit = async (request, response) => {
    try {
        const { name, frequency, notifications } = request.body;
        const habitId = request.params.id;

        const updatedHabit = await HabitsService.editHabit(habitId, { name, frequency, notifications });

        log(
            request,
            `Habit with ID ${habitId} updated`,
            CONTROLLER.EDIT_HABIT,
            LOG_TYPE.REQUEST,
            LOG_LEVEL.INFO
        );

        return response.status(HTTP_STATUS.OK).json({
            status: true,
            message: MESSAGE.HABIT_UPDATED,
            data: updatedHabit,
        });
    } catch (error) {
        console.log(error);
        log(
            request,
            MESSAGE.HABIT_UPDATION_ERROR,
            CONTROLLER.EDIT_HABIT,
            LOG_TYPE.REQUEST,
            LOG_LEVEL.ERROR
        );
        sendServerError(response);
    }
};

exports.deleteHabit = async (request, response) => {
    try {
        const habitId = request.params.id;

        const deletedHabit = await HabitsService.deleteHabit(habitId);
        if (!deletedHabit) return sendError(response, MESSAGE.NO_HABITS_FOUND);

        log(
            request,
            `Habit with ID ${habitId} deleted`,
            CONTROLLER.DELETE_HABIT,
            LOG_TYPE.REQUEST,
            LOG_LEVEL.INFO
        );

        return response.status(HTTP_STATUS.OK).json({
            status: true,
            message:MESSAGE.HABIT_DELETED,
        });
    } catch (error) {
        console.log(error);
        log(
            request,
            `Error occurred while deleting a habit`,
            CONTROLLER.DELETE_HABIT,
            LOG_TYPE.REQUEST,
            LOG_LEVEL.ERROR
        );
        sendServerError(response);
    }
};

exports.getHabitsByUserId = async (request, response) => {
    try {
      const userId = request.params.userId;
      if (!userId) {
        return response.status(HTTP_STATUS.BAD_REQUEST).json({
          status: false,
          message: MESSAGE.USERID_NOT_PROVIDED,
        });
      }

  
        const habits = await HabitsService.getHabitsByUserId(userId);
        if (habits.length === 0) {
            return response.status(HTTP_STATUS.NOT_FOUND).json({ status: false, message: MESSAGE.NO_HABITS_FOR_PROVIDED_USER });
        }

      log(
        request,
        `Habits for user ${userId} retrieved`,
        CONTROLLER.GET_HABITS_BY_USERID,
        LOG_TYPE.REQUEST,
        LOG_LEVEL.INFO
      );
  
      return response.json({
        status: true,
        data: habits,
        message: MESSAGE.HABITS_FETCHED,
      });
    } catch (error) {
      console.log(error);
      log(
        request,
        MESSAGE.HABIT_FETCHING_ERROR,
        CONTROLLER.GET_HABITS_BY_USERID,
        LOG_TYPE.REQUEST,
        LOG_LEVEL.ERROR
      );
      sendServerError(response);
    }
  };
  