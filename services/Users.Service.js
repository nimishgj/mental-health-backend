const Users = require('../models/User.model');
const { createUserVerifcation } = require('../util/helpers/Users.helper');
const userVerification = require("../models/UserVerification.model");
exports.getUserById = async(userId) => {
  try {
    const user = await Users.findById(userId);
    return user;
  } catch (error) {
    throw error;
  }
}
exports.getUserByEmail = async(email) => {
  try {
    const user = await Users.findOne({ email: email });
    return user;
  } catch (error) {
    throw error;
  }
}

exports.getUserByUserName = async(username) => {
  try {
    const user = await Users.findOne({ username: username });
    return user;
  } catch (error) {
    throw error;
  }
}

exports.deleteUserBy = async(userId) => {
  try {
    Users.findByIdAndDelete(userId);
  } catch (error) {
    throw error;
  }
}

exports.updateNotificationPreference = async(user, notificationPreference) => {
  try {
    user.notificationPreference = notificationPreference;
    await user.save();
  } catch (error) {
    throw error;
  }
}

exports.loginUser = async(email, password) => {
  try {
    const user = await this.getUserByEmail(email);
    const isMatch = user.password === password;
    if (!isMatch) {
      throw new Error("Invalid Password");
    } 
  } catch (error) {
    console.log(error)
    throw error;
  }
}

exports.createUser = async(userDetails) => {
  try {
    const user = new Users({
      name: userDetails.name,
      username: userDetails.username,
      email: userDetails.email,
      password: userDetails.password,
    });

    await createUserVerifcation('new account',user);
    await user.save();
    return user;
  } catch (error) {
    throw error;
  }
}

exports.verify = async(user,token) => {
  try {
    if(user.isVerified) {
      throw new Error("User is already verified");
    }
  
    const verificationToken = await userVerification.findOne({
      owner: user._id,
      token,
    });
    if (!verificationToken) {
      throw new Error("Invalid Verification Token provided")
    }

    user.isVerified = true;
    await user.save();
    await userVerification.findByIdAndDelete(verificationToken._id);
  } catch(error) {
    throw error;
  } 
}

exports.requestForPasswordChange = async(user) => {
  try {
    await createUserVerifcation('change password',user);
  } catch(error) {
    throw error;
  } 
}

exports.forgotPasswordRequest = async(user) => {
  try {
    await createUserVerifcation('forgot password',user);
  } catch(error) {
    throw error;
  } 
}

exports.changePassword = async(user) => {
  try {
    const verificationToken = await userVerification.findOne({
      owner: user.id,
      token,
    });

    if (!verificationToken) {
      throw new Error("Invalid Verification Token provided")
    }

    user.password = password;
    await user.save();
    await userVerification.findByIdAndDelete(verificationToken._id);
  } catch(error) {
    throw error;
  } 
}
