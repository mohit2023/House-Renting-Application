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
    address: Joi.string().required().escapeHTML(),
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