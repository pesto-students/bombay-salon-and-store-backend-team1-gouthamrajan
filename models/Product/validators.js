const Joi = require('@hapi/joi');


exports.validateCreateProduct = data => {
  const schema = Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string().required(),
    image_url: Joi.string().required(),
    type: Joi.string().required(),
    category: Joi.string().required(),
    duration: Joi.string().required(),
    price: Joi.number().required(),
    quantity: Joi.number(),
  });
  return schema.validate(data);
}