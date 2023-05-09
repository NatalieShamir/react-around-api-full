const jwt = require('jsonwebtoken');

const bcrypt = require('bcrypt');
const User = require('../models/user');
const { JWT_SECRET } = require('../utils/config');

const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const InternalServerError = require('../errors/InternalServerError');
const AccessDeniedError = require('../errors/AccessDeniedError');
const ConflictError = require('../errors/ConflictError');

const getAllUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(InternalServerError));
};

const getUserData = (id, res, next) => {
  User.findById(id);
  orFail(() => new NotFoundError())//eslint-disable-line
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
        res.status(BadRequestError).send('Invalid ID format');
      } else if (err.status === 404) {
        res.status(NotFoundError);
      } else {
        res.status(InternalServerError);
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
      next(new { message: 'Incorrect email or password' }());
    });
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, password, email,
  } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new ConflictError('The user with the provided email address already exists');
      } else {
        return bcrypt.hash(password, 10);
      }
    })

    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.status(201).send({ _id: user._id, email: user.email }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(`${Object.values(err.errors).map((error) => error.message).join(', ')}`));
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
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BadRequestError).send({ message: 'Invalid data' });
      }
      if (err.name === 'CastError') {
        res.status(BadRequestError).send({ message: 'Invalid ID format' });
      } else if (err.status === 404) {
        res.status(404).send({ message: err.message });
      } else {
        res.status(InternalServerError);
      }
    });
};

const updateProfile = (req, res) => { // eslint-disable-line consistent-return
  updateUserData(req, res);
};

const updateAvatar = (req, res) => { // eslint-disable-line consistent-return
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
