const mongoose = require("mongoose");
const { hashPassword, comparePassword } = require("../utils/PasswordUtils");

const userSchema = new mongoose.Schema({
  username: {
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
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  // Use custom compare function
  return await comparePassword(enteredPassword, this.password);
};

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next(); // Return here to prevent moving to the next middleware
  }
  // Use custom hash function
  this.password = await hashPassword(this.password);
  next();
});

module.exports = mongoose.model("Users", userSchema);
