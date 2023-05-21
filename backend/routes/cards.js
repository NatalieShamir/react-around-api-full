const express = require('express');

const router = express.Router();

const {
  getAllCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

const { validateCardBody, validateCardId } = require('../middleware/validation');

router.get('/', getAllCards);
router.post('/', validateCardBody, createCard);
router.delete('/:cardId', validateCardId, deleteCard);
router.put('/likes/:cardId', validateCardId, likeCard);
router.delete('/likes/:cardId', validateCardId, dislikeCard);

module.exports = {
  cardRouter: router,
};
