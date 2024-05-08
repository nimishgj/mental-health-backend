const yup = require('yup')

exports.userVerificationSchema = yup.object({
  userId: yup.string().required(),
  token: yup.number().required(),
})
