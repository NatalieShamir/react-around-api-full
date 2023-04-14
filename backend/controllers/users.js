const User = require('../models/user');

const {
  BAD_REQUEST_STATUS,
  NOT_FOUND_STATUS,
  INTERNAL_SERVER_ERROR,
  BAD_REQUEST_ERROR_MESSAGE,
  NOT_FOUND_ERR_MESSAGE,
  INTERNAL_SERVER_ERR_MESSAGE,
} = require('../utils');

const getAllUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(INTERNAL_SERVER_ERROR).send(INTERNAL_SERVER_ERR_MESSAGE));
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

const createUser = (req, res) => {
  const { name, avatar, about } = req.body;

  User.create({ name, avatar, about })
    .then((user) => res.status(201).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const message = `${Object.values(err.errors).map((error) => error.message).join(', ')}`;

        res.status(BAD_REQUEST_STATUS).send({ message });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send(INTERNAL_SERVER_ERR_MESSAGE);
      }
    });
};

const updateUserData = (req, res) => {
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
};
