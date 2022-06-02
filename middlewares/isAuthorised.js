const jwt = require('jsonwebtoken');
const User = require('../models/user');
const JWT_SECRET_KEY = 'qwerty';
const AuthError = require('../errors/AuthError');

const isAuthorised = (req, res, next) => {
  const auth = req.headers.authorization;

  if (!auth) {
    throw new AuthError('Требуется авторизация!');
  }
  const token = auth.replace('Bearer ', '');

  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET_KEY);
  } catch {
    throw new AuthError('Требуется авторизация!');
    return;
  }
  req.user = payload;
  next();
};
module.exports = { isAuthorised };
