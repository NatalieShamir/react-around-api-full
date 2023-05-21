const express = require('express');

const router = express.Router();

const {
  getAllCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

const { validateCardBody, validateCardId } = require('../middleware/validation');

router.get('/', getAllCards);
router.post('/', validateCardBody, createCard);
router.delete('/cards', validateCardId, deleteCard);
router.put('/cards/likes', validateCardId, likeCard);
router.delete('/cards/likes', validateCardId, dislikeCard);

module.exports = {
  cardRouter: router,
};
