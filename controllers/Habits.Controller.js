const { LOG_LEVEL } = require("../constants/LogLevel");
const { LOG_TYPE } = require("../constants/LogType");
const { log } = require("../middleware/logger/logger");
const Habits = require("../models/Habit.model");
const { sendServerError } = require("../util/Responses");
const Users = require("../models/User.model");
const { CONTROLLER, MESSAGE } = require("../constants/Habits.Constants");

exports.createHabit = async (request, response) => {
    try {
        const { name, frequency, notifications, userId } = request.body;

        const errors = {}

        if (!name) {
            errors.name = MESSAGE.NAME_NOT_PROVIDED;
        }
        if (!frequency) {
            errors.frequency = MESSAGE.FREQUENCY_NOT_PROVIDED;
        }
        if (!notifications) {
            errors.notifications = MESSAGE.NOTIFICATIONS_NOT_PROVIDED;
        }
        if (!userId) {
            errors.userId = MESSAGE.USERID_NOT_PROVIDED;
        }
        if (Object.keys(errors).length > 0) {
            return response.status(400).json({
                status: false,
                message: errors,
            });

        }

        const user = await Users.findOne({ _id: userId });
        if (!user) return sendError(response, MESSAGE.USER_NOT_FOUND);
        const newHabit = new Habits({
            name: name,
            frequency: frequency,
            notifications: notifications,
            owner: user._id
        })
        await newHabit.save();
        log(
            request,
            `${user.name} Created a new Habit`,
            CONTROLLER.CREATE_HABIT,
            LOG_TYPE.REQUEST,
            LOG_LEVEL.INFO
        )
        return response.status(201).send({
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
        const { name, frequency, notifications } = request.body; // Optional fields for editing
        const habitId = request.params.id;

        const errors = {};
        if (!name && !frequency && !notifications) {
            errors.general = MESSAGE.CANNOT_EDIT_MESSAGE;
        }
        if (Object.keys(errors).length > 0) {
            return response.status(400).json({
                status: false,
                message: errors,
            });
        }

        const habit = await Habits.findById(habitId);
        if (!habit) return sendError(response, MESSAGE.NO_HABITS_FOUND);
        if (name) habit.name = name;
        if (frequency) habit.frequency = frequency;
        if (notifications) habit.notifications = notifications;

        await habit.save();

        log(
            request,
            `Habit with ID ${habitId} updated`,
            CONTROLLER.EDIT_HABIT,
            LOG_TYPE.REQUEST,
            LOG_LEVEL.INFO
        );

        return response.status(200).json({
            status: true,
            message: MESSAGE.HABIT_UPDATED,
            data: habit,
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

        const habit = await Habits.findByIdAndDelete(habitId);
        if (!habit) return sendError(response,MESSAGE.NO_HABITS_FOUND);
        log(
            request,
            `Habit with ID ${habitId} deleted`,
            CONTROLLER.DELETE_HABIT,
            LOG_TYPE.REQUEST,
            LOG_LEVEL.INFO
        );

        return response.status(200).json({
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
        return response.status(400).json({
          status: false,
          message: MESSAGE.USERID_NOT_PROVIDED,
        });
      }

  
      const habits = await Habits.find({ owner: userId });
      if (habits.length === 0) {
        return response.status(404).json({
          status: false,
          message: MESSAGE.NO_HABITS_FOR_PROVIDED_USER,
        });
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
  