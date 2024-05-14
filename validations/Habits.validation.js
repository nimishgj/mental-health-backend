const yup = require('yup');

exports.habitValidation = yup.object().shape({
  name: yup.string().required().trim(),
  frequency: yup.object().typeError('Frequency must be an object').required('Frequency is required').nullable(false),
  notifications: yup.array().of(
    yup.object().shape({
      enabled: yup.boolean().default(false),
      time: yup.string().matches(/^\d{2}:\d{2}$/, 'Time must be in the format HH:MM (e.g., 09:00)').required(),
    })
  ),
  userId: yup.string().required(),
});
