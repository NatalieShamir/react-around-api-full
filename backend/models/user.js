const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');
const { AVATAR_LINK_REGEXP } = require('../constants');

const UNAUTHORIZED_ERR_MESSAGE = { message: 'Incorrect email or password' };

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: 'Jacques Cousteau',
      minlength: [2, 'This field should contain at least 2 characters'],
      maxlength: [30, 'This field should contain maximum 30 characters'],
    },
    about: {
      type: String,
      default: 'Explorer',
      minlength: [2, 'This field should contain at least 2 characters'],
      maxlength: [30, 'This field should contain maximum 30 characters'],
    },
    avatar: {
      type: String,
      default: 'https://pictures.s3.yandex.net/resources/avatar_1604080799.jpg',
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
  },
  { versionKey: false },
);

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new UNAUTHORIZED_ERR_MESSAGE());
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new UNAUTHORIZED_ERR_MESSAGE());
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
