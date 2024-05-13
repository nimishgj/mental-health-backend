const yup = require('yup')

exports.userLoginSchema = yup.object({
  password: yup.string().min(8).max(12).required(),
  email: yup.string().email().required(),
})

exports.userSchema = yup.object({
  name: yup.string().required(),
  username: yup.string().required(),
  password: yup.string().min(8).max(12).required(),
  email: yup.string().email().required()
})

exports.userVerificationSchema = yup.object({
  userId: yup.string().required(),
  token: yup.number().required(),
})

exports.changePasswordRequestSchema = yup.object({
  username: yup.string().required(),
})

exports.changePasswordSchema = yup.object({
  token: yup.number().required(),
  password: yup.string().min(8).max(12).required(),
  email:  yup.string().email().required(),
})

exports.forgotPasswordRequestSchema = yup.object({
  email: yup.string().email().required(),
})
  
exports.deleteUserSchema = yup.object({
  email: yup.string().email().required(),
})

exports.changeNotificationPreferenceSchema = yup.object({
  userId: yup.string().required(),
  notificationPreference: yup.boolean().required(),
})