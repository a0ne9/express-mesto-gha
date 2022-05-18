const User = require("../models/user");

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  if (!name || !about || !avatar) {
    return res
      .status(400)
      .send({ message: "Имя, о себе или аватар введены некорректно!" });
  }

  User.create({ name, about, avatar })
    .then((user) => {
      res.status(201).send(user);
    })
    .catch((err) =>
      res.status(500).send({ message: `Произошла ошибка ${err.message}` })
    );
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.status(200).send(users);
    })
    .catch((err) =>
      res.status(500).send({ message: `Произошла ошибка ${err.message}` })
    );
};

module.exports.getUserByID = (req, res) => {
  const id = req.params.id;
  User.findById(id)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "Пользователь не найден!" });
      }
      res.status(200).send(user);
    })
    .catch((err) =>
      res.status(500).send({ message: `Произошла ошибка ${err.message}` })
    );
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  const id = req.user._id;
  if (!name || !about) {
    return res
      .status(400)
      .send({ message: "Имя или о себе введены некорректно!" });
  }
  User.findByIdAndUpdate(id, { name, about })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "Пользователь не найден!" });
      }
      res.status(200).send(user);
    })
    .catch((err) =>
      res.status(500).send({ message: `Произошла ошибка ${err.message}` })
    );
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  const id = req.user._id;
  if (!avatar) {
    return res.status(400).send({ message: "Аватар введен некорректно!" });
  }
  User.findByIdAndUpdate(id, { avatar })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "Пользователь не найден!" });
      }
      res.status(200).send(user);
    })
    .catch((err) =>
      res.status(500).send({ message: `Произошла ошибка ${err.message}` })
    );
};
