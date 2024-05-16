const yup = require('yup')

exports.userLoginSchema = yup.object({
  password: yup.string().min(8).max(12).required(),
  email: yup.string().email().required(),
})
  
exports.userSchema = yup.object({
  userDetails: yup.object().shape({
    name: yup.string().required('Name is required'),
    username: yup.string().required('Username is required'),
    password: yup.string()
      .min(8, 'Password must be at least 8 characters long')
      .max(12, 'Password must be at most 12 characters long')
      .required('Password is required'),
    email: yup.string().email('Invalid email format').required('Email is required'),
  }),
});


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