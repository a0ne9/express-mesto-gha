const jwt = require('jsonwebtoken');
const User = require('../models/user');
const JWT_SECRET_KEY = 'qwerty';

const isAuthorised = (req, res, next) => {
  const auth = req.headers.authorization;

  if (!auth) {
    res.status(401).send({ message: 'Требуется авторизация!' });
    return;
  }
  const token = auth.replace('Bearer ', '');

  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET_KEY);
  } catch {
    res.status(401).send({ message: 'Требуется авторизация!' });
    return;
  }
  return User.findOne({ _id: decoded.id })
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: 'Пользователь не найден!' });
        return;
      }
      req.user = user
      next();
    })
    .catch((err) => {
      res.status(500).send({ message: `Произошла ошибка ${err.message}` });
    });
};

module.exports = { isAuthorised };
