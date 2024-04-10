const mongoose = require('mongoose');

const frequencySchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['daily', 'weekdays', 'custom'],
    required: true,
  },
  // Include custom frequency details if applicable:
  customDays: {
    type: [String], // Array of weekdays (e.g., ['mon', 'tue', 'wed'])
    validate: {
      validator: (v) => v.length > 0 && v.every((day) => ['mon', 'tue', 'wed', 'thu', 'fri'].includes(day)),
      message: 'Custom frequency must include at least one valid weekday (mon, tue, wed, thu, fri)',
    },
  },
});

const notificationSchema = new mongoose.Schema({
  enabled: {
    type: Boolean,
    default: false,
  },
  time: {
    type: String,
    validate: {
      validator: (v) => /^\d{2}:\d{2}$/.test(v),
      message: 'Time must be in the format HH:MM (e.g., 09:00)',
    },
  },
});

const habitSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  frequency: frequencySchema,
  notifications: [notificationSchema],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
});

module.exports = mongoose.model('Habit', habitSchema);
