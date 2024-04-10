const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a name"],
    trim: false,
    maxlength: [100, "Name cannot be more than 100 characters"],
    unique: true,
  },  username: {
    type: String,
    required: [true, "Please provide a user name"],
    trim: false,
    maxlength: [100, "Name cannot be more than 100 characters"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    trim: false,
    maxlength: [100, "Password cannot be more than 100 characters"],
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    trim: false,
    unique: true,
    maxlength: [100, "Email cannot be more than 100 characters"],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  notificationPreference: {
    type: Boolean,
    default: false,
  }
});

module.exports = mongoose.model("Users", userSchema);
