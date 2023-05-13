const { Joi, celebrate } = require('celebrate');
const { ObjectId } = require('mongoose').Types;

const validator = require('validator');

const { AVATAR_LINK_REGEXP } = require('../constants/index');

const validateUrl = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error('string.uri');
};

// Id Validation
const validateObjId = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().custom((value, helpers) => {
      if (ObjectId.isValid(value)) {
        return value;
      }
      return helpers.message('Invalid ID');
    }),
  }),
});

// Card Validation
const validateCardBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30)
      .messages({
        'string.min': 'The minimum length of the "name" field is 2',
        'string.max': 'The maximum length of the "name" field is 30',
        'string.empty': 'The "name" field must be filled-in',
      }),
    link: Joi.string().required().custom(validateUrl)
      .message('The "link" field must be a valid URL')
      .messages({
        'string empty': 'The "link" field must be filled-in',
      }),
  }),
});

const validateCardId = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().custom((value, helpers) => {
      if (ObjectId.isValid(value)) {
        return value;
      }
      return helpers.message('Invalid card ID');
    }),
  }),
});

// User Validation
const validateUserBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30)
      .messages({
        'string.min': 'The minimum length of the "name" field is 2',
        'string.max': 'The maximum length of the "name" field is 30',
      }),
    about: Joi.string().min(2).max(30)
      .messages({
        'string.min': 'The minimum length of the "about" field is 2',
        'string.max': 'The maximum length of the "about" field is 30',
      }),
    password: Joi.string().required()
      .messages({
        'string.empty': 'The "password" field must be filled-in',
      }),
    email: Joi.string().required().email()
      .message('The "email" field must be a valid email')
      .messages({
        'string.empty': 'The "email" field must be filled-in',
      }),
    avatar: Joi.string()
      .pattern(AVATAR_LINK_REGEXP)
      .message('The "avatar" field must be a valid URL'),
  }),
});

// Login Validation
const validateAuthentication = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email()
      .message('The "email" field must be a valid email')
      .messages({
        'string.required': 'The "email" field must be filled-in',
      }),
    password: Joi.string().required()
      .messages({
        'string.empty': 'The "password" field must be filled-in',
      }),
  }),
});

// Avatar Validation
const validateAvatar = celebrate({
  body: {
    avatar: Joi.string().required().pattern(AVATAR_LINK_REGEXP)
      .message('The "avatar" field must be a valid URL')
      .messages({
        'string empty': 'The "avatar" field must be filled-in',
      }),
  },
});

// Profile Validation
const validateProfile = celebrate({
  body: {
    name: Joi.string().required().min(2).max(30)
      .messages({
        'string.min': 'The minimum length of the "name" field is 2',
        'string.max': 'The maximum length of the "name" field is 30',
        'string.empty': 'The "name" field must be filled-in',
      }),
    about: Joi.string().required().min(2).max(30)
      .messages({
        'string.min': 'The minimum length of the "about" field is 2',
        'string.max': 'The maximum length of the "about" field is 30',
        'string.empty': 'The "about" field must be filled-in',
      }),
  },
});

module.exports = {
  validateObjId,
  validateCardBody,
  validateCardId,
  validateUserBody,
  validateAuthentication,
  validateAvatar,
  validateProfile,
};
