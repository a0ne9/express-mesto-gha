const jwt = require('jsonwebtoken');
const AuthError = require('../errors/AuthError');

const JWT_SECRET_KEY = 'qwerty';

const isAuthorised = (req, res, next) => {
  const auth = req.headers.authorization;

  if (!auth) {
    throw new AuthError('Требуется авторизация!');
  }
  const token = auth.replace('Bearer ', '');

  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET_KEY);
  } catch (err) {
    throw new AuthError('Требуется авторизация!');
  }
  req.user = payload;
  next();
};
module.exports = { isAuthorised };
