const router = require('express').Router();

const { getUsers, getUser } = require('../controllers/users');
const { updateUser } = require('../controllers/users');
const { getCurrentUser } = require('../controllers/users');
const { updateAvatar } = require('../controllers/users');

const { updateAvatarValidate, updateUserValidate, idParamsValidator } = require('../validator/validator');
const { idValidator } = require('../validator/validator');

router.get('/users', getUsers);
router.patch('/users/me', updateUserValidate, updateUser);
router.patch('/users/me/avatar', updateAvatarValidate, updateAvatar);
router.get('/users/me', idValidator, getCurrentUser);
router.get('/users/:id', idParamsValidator, getUser);

module.exports = router;
