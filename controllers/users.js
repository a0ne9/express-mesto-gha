const User = require('../models/user');

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  if (!name || !about || !avatar) {
    res
      .status(400)
      .send({ message: 'Имя, о себе или аватар введены некорректно!' });
    return;
  }

  User.create({ name, about, avatar })
    .then((user) => {
      res.status(201).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Имя или о себе введены неверно!' });
        return;
      }
      res.status(500).send({
        message: `Произошла ошибка ${err.name} с текстом ${err.message} `,
      });
    });
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.status(200).send(users);
    })
    .catch((err) => {
      res.status(500).send({ message: `Произошла ошибка ${err.message}` });
    });
};

module.exports.getUserByID = (req, res) => {
  const { id } = req.params.id;
  if (!id) {
    res.status(400).send('ID не был передан!');
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
      res.status(500).send({ message: `Произошла ошибка ${err.message}` });
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  const id = req.user._id;
  if (!name || !about) {
    res.status(400).send({ message: 'Имя или о себе введены некорректно!' });
    return;
  }
  User.findByIdAndUpdate(
    id,
    { name, about },
    { new: true, runValidators: true },
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
      res.status(500).send({ message: `Произошла ошибка ${err.message}` });
    });
};

module.exports.updateAvatar = (req, res) => {
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
    .catch((err) => {
      res.status(500).send({ message: `Произошла ошибка ${err.message}` });
    });
};
