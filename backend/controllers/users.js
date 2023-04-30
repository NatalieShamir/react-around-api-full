const jwt = require('jsonwebtoken');

const bcrypt = require('bcrypt');
const User = require('../models/user');
const { JWT_SECRET } = require('../utils/config');
const {
  BAD_REQUEST_STATUS,
  NOT_FOUND_STATUS,
  INTERNAL_SERVER_ERROR,
  BAD_REQUEST_ERROR_MESSAGE,
  NOT_FOUND_ERR_MESSAGE,
  INTERNAL_SERVER_ERR_MESSAGE,
  UNAUTHORIZED_ERR_MESSAGE,
  ACCESS_DENIED_ERROR,
  CONFLICT_ERROR,
} = require('../errors/errors');

const getAllUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(INTERNAL_SERVER_ERROR).send(INTERNAL_SERVER_ERR_MESSAGE));
};

const getUserData = (id, res, next) => {
  User.findById(id);
  orFail(() => new NOT_FOUND_ERR_MESSAGE())//eslint-disable-line
    .then((users) => res.send({ data: users }))
    .catch(next);
};

const getCurrentUser = (req, res, next) => {
  getUserData(req.user._id, res, next);
};

const getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail(() => {
      const error = new Error(`No user found with ID of ${req.user._id}`);
      error.status = 404;
      throw error;
    })
    .then((users) => {
      res.send({ data: users });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST_STATUS).send(BAD_REQUEST_ERROR_MESSAGE);
      } else if (err.status === 404) {
        res.status(NOT_FOUND_STATUS).send(NOT_FOUND_ERR_MESSAGE);
      } else {
        res.status(INTERNAL_SERVER_ERROR).send(INTERNAL_SERVER_ERR_MESSAGE);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
      res.send({ data: user.toJSON(), token });
    })
    .catch(() => {
      next(new UNAUTHORIZED_ERR_MESSAGE());
    });
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, password, email,
  } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new CONFLICT_ERROR('The user with the provided email address already exists');
      } else {
        return bcrypt.hash(password, 10);
      }
    })

    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((data) => res.status(201).send({ data }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BAD_REQUEST_STATUS(`${Object.values(err.errors).map((error) => error.message).join(', ')}`));
      } else {
        next(err);
      }
    });
};

const updateUserData = (req, res, next) => {
  const id = req.user._id;
  const { body } = req;

  User.findByIdAndUpdate(id, body, { new: true, runValidators: true })
    .orFail(() => {
      const error = new Error(`No user found with ID of ${req.user._id}`);
      error.status = 404;
      throw error;
    })
    .then((user) => {
      if (!user.equals(req.user._id)) {
        next(new ACCESS_DENIED_ERROR({ message: 'You can only edit your own profile information' }));
      } else {
        res.send({ data: user });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST_STATUS).send({ message: 'Invalid data' });
      }
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST_STATUS).send(BAD_REQUEST_ERROR_MESSAGE);
      } else if (err.status === 404) {
        res.status(404).send({ message: err.message });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send(INTERNAL_SERVER_ERR_MESSAGE);
      }
    });
};

const updateProfile = (req, res) => { // eslint-disable-line consistent-return
  const { name, about } = req.body;

  if (!name || !about) {
    return res.status(BAD_REQUEST_STATUS).send({ message: 'Please fill-in name and about fields' });
  }

  updateUserData(req, res);
};

const updateAvatar = (req, res) => { // eslint-disable-line consistent-return
  const { avatar } = req.body;

  if (!avatar) {
    return res.status(BAD_REQUEST_STATUS).send({ message: 'Please fill-in avatar field' });
  }

  updateUserData(req, res);
};

module.exports = {
  getAllUsers,
  getUser,
  createUser,
  updateAvatar,
  updateProfile,
  login,
  getCurrentUser,
};
