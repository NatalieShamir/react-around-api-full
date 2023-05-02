const Card = require('../models/card');

const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const InternalServerError = require('../errors/InternalServerError');
const AccessDeniedError = require('../errors/AccessDeniedError');

const getAllCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(InternalServerError));
};

const createCard = (req, res) => {
  const { name, link } = req.body;

  const owner = req.user._id;

  Card.create({
    name, link, owner, likes,
  })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const message = `${Object.values(err.errors).map((error) => error.message).join(', ')}`;

        res.status(BadRequestError).send({ message });
      } else {
        res.status(InternalServerError);
      }
    });
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;

  Card.findById(cardId)
    .orFail(() => new NotFoundError('No card found with that ID'))
    .then((card) => {
      if (!card.owner.equals(req.user._id)) {
        return next(new AccessDeniedError('You cannot delete someone elses card'));
      }
      return card.deleteOne()
        .then(() => res.send({ message: 'Card  deleted successfully' }));
    })
    .catch(next);
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
        res.status(BadRequestError).send('Invalid ID format');
      } else if (err.status === 404) {
        res.status(NotFoundError);
      } else {
        res.status(InternalServerError);
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
