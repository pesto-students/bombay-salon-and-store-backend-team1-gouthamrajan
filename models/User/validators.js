const Joi = require('@hapi/joi');


exports.validateRegisterUser = user => {
  const schema = Joi.object().keys({
    name: Joi.string().required(),
    gender: Joi.string().valid('male', 'female', 'other'),
    email: Joi.string()
      .email()
      .required(),
		mobile: Joi.number().integer().min(1000000000).max(9999999999).required(),
    password: Joi.string().required(),
		confirm_password: Joi.string().required()
  });
  return schema.validate(user);
};