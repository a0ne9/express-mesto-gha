const User = require('../models/user');
const bcrypt = require('bcryptjs');
const { createToken, verifyToken } = require('../utils/jwt');

module.exports.createUser = (req, res, next) => {
  const { name, about, avatar, email, password } = req.body;

  if (!email || !password) {
    res.status(400).send({ message: 'Почта или пароль введены неверно!' });
  }

  bcrypt.hash(req.body.password, 10).then((hash) => {
    User.create({ name, about, avatar, email, password: hash })
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
          res.status(400).send({ message: 'Имя или о себе введены неверно!' });
          return;
        }
        if (err.code === 11000) {
          res.status(409).send({ message: 'Почта занята!' });
        }
        next(err);
      });
  });
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.status(200).send(users);
    })
    .catch((err) => next(err));
};

module.exports.getUserByID = (req, res, next) => {
  const id = req.params.id;
  if (!id) {
    res.status(400).send({ message: 'ID не был передан!' });
  }
  User.findById(id)
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: 'Пользователь не найден!' });
        return;
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Некорректный ID' });
        return;
      }
      next(err);
    });
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  const id = req.user._id;
  if (!name || !about) {
    res.status(400).send({ message: 'Имя или о себе введены некорректно!' });
    return;
  }
  User.findByIdAndUpdate(
    id,
    { name, about },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: 'Пользователь не найден!' });
        return;
      }
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Имя или о себе введены неверно!' });
        return;
      }
      next(err);
    });
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const id = req.user._id;
  if (!avatar) {
    res.status(400).send({ message: 'Аватар введен некорректно!' });
    return;
  }
  User.findByIdAndUpdate(id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: 'Пользователь не найден!' });
        return;
      }
      res.status(200).send(user);
    })
    .catch((err) => next(err));
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).send({ message: 'Почта или пароль введены неверно!' });
  }

  User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        res.status(401).send({ message: 'Почта или пароль введены неверно!' });
        return;
      }
      return { matched: bcrypt.compare(password, user.password), user };
    })
    .then(({ matched, user }) => {
      if (!matched) {
        res.status(401).send({ message: 'Неправильные почта или пароль' });
        return;
      }
      return createToken({ id: user._id });
    })
    .then((token) => {
      res.status(200).send({ token });
    })
    .catch((err) => next(err));
};

module.exports.getExactUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        return res
          .status(404)
          .send({ message: 'Пользователь с данным _id не найден!' });
      }
      res.status(200).send(user);
    })
    .catch((err) => next(err));
};
