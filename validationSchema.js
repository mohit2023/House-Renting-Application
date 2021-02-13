const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
  type: 'string',
  base: joi.string(),
  messages: {
      'string.escapeHTML': '{{#label}} must not include HTML!'
  },
  rules: {
      escapeHTML: {
          validate(value, helpers) {
              const clean = sanitizeHtml(value, {
                  allowedTags: [],
                  allowedAttributes: {},
              });
              if (clean !== value) return helpers.error('string.escapeHTML', { value })
              return clean;
          }
      }
  }
});

const Joi = BaseJoi.extend(extension);

module.exports.houseSchema = Joi.object({
  house: Joi.object({
    name: Joi.string().required().escapeHTML(),
    availableStatus: Joi.boolean(),
    address: Joi.object({
      line1: Joi.string().required().escapeHTML(),
      line2: Joi.string().allow('').escapeHTML(),
      city: Joi.string().required().escapeHTML(),
      state: Joi.string().required().escapeHTML(),
      postalCode: Joi.string().required().escapeHTML(),
      country: Joi.string().required().escapeHTML(),
    }).required(),
    description: Joi.string().allow('').escapeHTML(),
    rent: Joi.number().required().min(0)
  }).required(),
  deleteImages: Joi.array()
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    description: Joi.string().required().escapeHTML(),
    rating: Joi.number().required().min(1).max(5)
  }).required()
});

module.exports.userRegistrationSchema = Joi.object({
  username: Joi.string().required().escapeHTML(),
  password: Joi.string().required().escapeHTML(),
  email: Joi.string().email().required().escapeHTML()
});