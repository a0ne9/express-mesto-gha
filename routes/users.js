const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUsers,
  getUserByID,
  updateUser,
  updateAvatar,
  getExactUser,
} = require('../controllers/users');

router.get('/users/me', getExactUser);

router.get(
  '/users/:id',
  celebrate({
    params: Joi.object().keys({
      id: Joi.string().required().hex().length(24),
    }),
  }),
  getUserByID,
);

router.get('/users', getUsers);

router.patch(
  '/users/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      about: Joi.string().required().min(2).max(30),
    }),
  }),
  updateUser,
);

router.patch(
  '/users/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string()
        .required()
        .pattern(
          /(http|www|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:~+#-]*[\w@?^=%&~+#-])/,
        ),
    }),
  }),
  updateAvatar,
);

module.exports.UserRouter = router;
