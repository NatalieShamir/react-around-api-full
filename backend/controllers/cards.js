const Card = require('../models/card');

const {
  BAD_REQUEST_STATUS,
  NOT_FOUND_STATUS,
  INTERNAL_SERVER_ERROR,
  BAD_REQUEST_ERROR_MESSAGE,
  NOT_FOUND_ERR_MESSAGE,
  INTERNAL_SERVER_ERR_MESSAGE,
} = require('../errors/errors');

const getAllCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(INTERNAL_SERVER_ERROR).send(INTERNAL_SERVER_ERR_MESSAGE));
};

const createCard = (req, res) => {
  const { name, link, likes } = req.body;

  const owner = req.user._id;

  Card.create({
    name, link, owner, likes,
  })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const message = `${Object.values(err.errors).map((error) => error.message).join(', ')}`;

        res.status(BAD_REQUEST_STATUS).send({ message });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send(INTERNAL_SERVER_ERR_MESSAGE);
      }
    });
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;

  Card.findByIdAndDelete(cardId)
    .orFail(() => {
      const error = new Error('No card found with that ID');
      error.status = 404;

      throw error;
    })
    .then((card) => res.send({ message: 'The card has been successfully deleted', data: card }))
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

const updateLikes = (req, res, operator) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  Card.findByIdAndUpdate(
    cardId,
    { [operator]: { likes: userId } },
    { new: true },
  )
    .orFail(() => {
      const error = new Error('No card found with that ID');
      error.status = 404;

      throw error;
    })
    .then((card) => res.send({ data: card }))
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

const likeCard = (req, res) => updateLikes(req, res, '$addToSet');

const dislikeCard = (req, res) => updateLikes(req, res, '$pull');

module.exports = {
  getAllCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
