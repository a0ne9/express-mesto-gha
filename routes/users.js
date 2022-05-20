const router = require('express').Router();
const {
  getUsers,
  createUser,
  getUserByID,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

router.get('/users/:id', getUserByID);

router.get('/users', getUsers);

router.post('/users', createUser);

router.patch('/users/me', updateUser);

router.patch('/users/me/avatar', updateAvatar);

module.exports.UserRouter = router;
