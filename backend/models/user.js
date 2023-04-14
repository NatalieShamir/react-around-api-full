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
});

module.exports = mongoose.model('user', userSchema);
