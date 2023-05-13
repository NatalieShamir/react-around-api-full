const jwt = require('jsonwebtoken');

const bcrypt = require('bcrypt');
const User = require('../models/user');
const { JWT_SECRET } = require('../utils/config');

const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const InternalServerError = require('../errors/InternalServerError');
const ConflictError = require('../errors/ConflictError');
const UnauthorizedError = require('../errors/UnauthorizedError');

const getAllUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => next(new InternalServerError('An error has occured on the server')));
};

const getUserData = (id, req, res, next) => {
  User.findById(id)
    .orFail(() => new NotFoundError('The requested resourse was not found'))
    .then((users) => res.send({ data: users }))
    .catch(next);
};

const getCurrentUser = (req, res, next) => {
  getUserData(req.user._id, req, res, next);
};

const getUser = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail(() => new NotFoundError(`No user found with ID of ${req.user._id}`))
    .then((users) => {
      res.send({ data: users });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Invalid ID format'));
      } else if (err.statusCode === 404) {
        next(new NotFoundError('The requested resource was not found'));
      } else {
        next(new InternalServerError('An error has occured on the server'));
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(() => {
      next(new UnauthorizedError('Incorrect email or password'));
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
    .orFail(() => new NotFoundError('The requested resourse was not found'))
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Invalid data'));
      }
      if (err.name === 'CastError') {
        next(new BadRequestError('Invalid ID format'));
      } else if (err.statusCode === 404) {
        next(new NotFoundError('The requested resource was not found'));
      } else {
        next(new InternalServerError('An error has occured on the server'));
      }
    });
};

const updateProfile = (req, res, next) => { // eslint-disable-line consistent-return
  updateUserData(req, res, next);
};

const updateAvatar = (req, res, next) => { // eslint-disable-line consistent-return
  updateUserData(req, res, next);
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
