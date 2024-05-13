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

