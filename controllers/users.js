const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { createToken } = require('../utils/jwt');
const BadRequestError = require('../errors/BadRequestError');
const DuplicateError = require('../errors/DuplicateError');
const NotFoundError = require('../errors/NotFoundError');
const AuthError = require('../errors/AuthError');

module.exports.createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  if (!email || !password) {
    throw new BadRequestError('Почта или пароль введены неверно!');
  }

  bcrypt.hash(req.body.password, 10).then((hash) => {
    User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    })
      .then((user) => {
        res.status(201).send({
          _id: user._id,
          name: user.name,
          about: user.about,
          avatar: user.avatar,
          email: user.email,
        });
      })
      .catch((err) => {
        if (err.name === 'ValidationError') {
          next(new BadRequestError('Имя или о себе введены неверно!'));
          return;
        }
        if (err.code === 11000) {
          next(new DuplicateError('Почта занята!'));
          return;
        }
        next(err);
      });
  }).catch((err) => next(err));
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.status(200).send(users);
    })
    .catch((err) => next(err));
};

module.exports.getUserByID = (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    throw new BadRequestError('ID не был передан!');
  }
  User.findById(id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден!');
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Некорректный ID'));
        return;
      }
      next(err);
    });
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  const { id } = req.user;
  if (!name || !about) {
    throw new BadRequestError('Имя или о себе введены некорректно!');
  }
  User.findByIdAndUpdate(
    id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден!');
      }
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Имя или о себе введены неверно!'));
        return;
      }
      next(err);
    });
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const { id } = req.user;
  if (!avatar) {
    throw new BadRequestError('Аватар введен некорректно!');
  }
  User.findByIdAndUpdate(id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден!');
      }
      res.status(200).send(user);
    })
    .catch((err) => next(err));
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError('Почта или пароль введены неверно!');
  }

  User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        throw new AuthError('Почта или пароль введены неверно!');
      }
      return { matched: bcrypt.compare(password, user.password), user };
    })
    .then(({ matched, user }) => {
      if (!matched) {
        throw new AuthError('Неправильные почта или пароль');
      }
      return createToken({ id: user._id });
    })
    .then((token) => {
      res.status(200).send({ token });
    })
    .catch((err) => next(err));
};

module.exports.getExactUser = (req, res, next) => {
  User.findById(req.user.id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с данным _id не найден!');
      }
      res.status(200).send(user);
    })
    .catch((err) => next(err));
};
