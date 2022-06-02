const jwt = require('jsonwebtoken');

const JWT_SECRET_KEY = 'qwerty';

const createToken = (payload) => jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: '7d' });

module.exports = { createToken };
