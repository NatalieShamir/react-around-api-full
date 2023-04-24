const express = require('express');

const router = express.Router();

const {
  getAllUsers, getUser, updateAvatar, updateProfile, getCurrentUser,
} = require('../controllers/users');

const { validateObjId, validateAvatar, validateProfile } = require('../middleware/validation');

router.get('/', getAllUsers);
router.get('/me', getCurrentUser);
router.get('/:userId', validateObjId, getUser);
router.patch('/me', validateProfile, updateProfile);
router.patch('/me/avatar', validateAvatar, updateAvatar);

module.exports = {
  userRouter: router,
};
