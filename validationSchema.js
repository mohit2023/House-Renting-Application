const Joi = require('joi');

module.exports.houseSchema = Joi.object({
  house: Joi.object({
    name: Joi.string().required(),
    address: Joi.string().required(),
    image: Joi.string().allow(''),
    description: Joi.string().allow(''),
    rent: Joi.number().required().min(0)
  }).required()
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    description: Joi.string().required(),
    rating: Joi.number().required().min(1).max(5)
  }).required()
});