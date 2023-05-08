const express = require('express');

const router = express.Router();

const {
  getAllCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

const { validateCardBody, validateObjId } = require('../middleware/validation');

router.get('/', getAllCards);
router.post('/', validateCardBody, createCard);
router.delete('/:cardId', validateObjId, deleteCard);
router.put('/:cardId/likes', validateObjId, likeCard);
router.delete('/:cardId/likes', validateObjId, dislikeCard);

module.exports = {
  cardRouter: router,
};
