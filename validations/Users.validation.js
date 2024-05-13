const yup = require('yup')

exports.userLoginSchema = yup.object({
  password: yup.string().min(8).max(12).required(),
  email: yup.string().email().required(),
})

