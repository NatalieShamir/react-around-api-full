const mongoose = require('mongoose');
const { AVATAR_LINK_REGEXP } = require('../constants');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [2, 'This field should contain at least 2 characters'],
    maxlength: [30, 'This field should contain maximum 30 characters'],
    required: true,
  },
  about: {
    type: String,
    minlength: [2, 'This field should contain at least 2 characters'],
    maxlength: [30, 'This field should contain maximum 30 characters'],
    required: true,
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator: (v) => AVATAR_LINK_REGEXP.test(v),
      message: 'Please fill-in this field',
    },
  },
  email: {
    type: String,
    required: [true, 'email field is a required field'],
    unique: true,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: 'The email field should be filled-in with a valid email',
    },
  },
  password: {
    type: String,
    required: [true, 'password field is a required field'],
    select: false,
  },
});

module.exports = mongoose.model('user', userSchema);
