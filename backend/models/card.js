const mongoose = require('mongoose');
const { AVATAR_LINK_REGEXP } = require('../constants');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [2, 'This field should contain at least 2 characters'],
    maxlength: [30, 'This field should contain maximum 30 characters'],
    required: true,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator: (v) => AVATAR_LINK_REGEXP.test(v),
      message: 'Please fill-in this field',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'user',
  },
  likes: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', userSchema);
