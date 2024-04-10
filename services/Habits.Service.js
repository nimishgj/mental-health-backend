const Habits = require("../models/Habit.model");

exports.createHabit = async (habitData) => {
    try {
        const newHabit = new Habits(habitData);
        await newHabit.save();
        return newHabit;
    } catch (error) {
        throw error;
    }
};

exports.editHabit = async (habitId, habitData) => {
    try {
        const habit = await Habits.findById(habitId);
        if (!habit) throw new Error(MESSAGE.NO_HABITS_FOUND);

        if (habitData.name) habit.name = habitData.name;
        if (habitData.frequency) habit.frequency = habitData.frequency;
        if (habitData.notifications) habit.notifications = habitData.notifications;

        await habit.save();
        return habit;
    } catch (error) {
        throw error;
    }
};

exports.deleteHabit = async (habitId) => {
    try {
        const deletedHabit = await Habits.findByIdAndDelete(habitId);
        return deletedHabit;
    } catch (error) {
        throw error;
    }
};

exports.getHabitsByUserId = async (userId) => {
    try {
        const habits = await Habits.find({ owner: userId });
        return habits;
    } catch (error) {
        throw error;
    }
};