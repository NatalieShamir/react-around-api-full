const express = require('express');

const router = express.Router();

const {
  getAllUsers, getUser, updateAvatar, updateProfile, getCurrentUser
} = require('../controllers/users');

router.get('/', getAllUsers);
router.get('/me', getCurrentUser);
router.get('/:userId', getUser);
router.patch('/me', updateProfile);
router.patch('/me/avatar', updateAvatar);

module.exports = {
  userRouter: router,
};
