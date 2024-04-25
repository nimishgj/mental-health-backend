const HabitsService = require("../../services/Habits.Service");
const Habits = require("../../models/Habit.model");


jest.mock("../../models/Habit.model");

describe("Habits Service", () => {
  describe("createHabit", () => {
    it("should create a new habit", async () => {
      const habitData = { name: "Exercise", frequency: { type: "daily" }, owner: "userId" };
      const newHabit = new Habits(habitData);
      Habits.mockReturnValue(newHabit);
      
      const result = await HabitsService.createHabit(habitData);
      
      expect(result).toEqual(newHabit);
      expect(Habits.mock.instances[0].save).toHaveBeenCalled();
    });
    

  });

  describe("deleteHabit", () => {
    it("should delete an existing habit", async () => {
      const habitId = "habitId";
      const deletedHabit = { _id: habitId, name: "Exercise", frequency: { type: "daily" }, owner: "userId" };
      Habits.findByIdAndDelete.mockResolvedValue(deletedHabit);

      const result = await HabitsService.deleteHabit(habitId);
      
      expect(result).toBeNaN();
      expect(Habits.findByIdAndDelete).toHaveBeenCalledWith(habitId);
    });


  });

  describe("getHabitsByUserId", () => {
    it("should get habits by user ID", async () => {
      const userId = "userId";
      const habits = [
        { name: "Exercise", frequency: { type: "daily" }, owner: userId },
        { name: "Meditation", frequency: { type: "daily" }, owner: userId }
      ];
      Habits.find.mockResolvedValue(habits);

      const result = await HabitsService.getHabitsByUserId(userId);
      
      expect(result).toEqual(habits);
      expect(Habits.find).toHaveBeenCalledWith({ owner: userId });
    });


  });
});
