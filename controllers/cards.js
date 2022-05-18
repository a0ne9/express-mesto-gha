const Card = require("../models/card");

module.exports.createCard = (req, res) => {
  const owner = req.user._id;
  const { name, link } = req.body;
  if (!name || !link) {
    return res
      .status(400)
      .send({ message: "Название или описание введены некорректно!" });
  }
  Card.create({ name, link, owner })
    .then((card) => {
      res.status(201).send(card);
    })
    .catch((err) =>
      res.status(500).send({ message: `Произошла ошибка ${err.message}` })
    );
};

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.status(200).send(cards);
    })
    .catch((err) =>
      res.status(500).send({ message: `Произошла ошибка ${err.message}` })
    );
};

module.exports.deleteCard = (req, res) => {
  const id = req.params.id;

  Card.findByIdAndRemove(id)
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: "Карточка не найдена!" });
      }
      res.send(card);
    })
    .catch((err) =>
      res.status(500).send({ message: `Произошла ошибка ${err.message}` })
    );
};

module.exports.likeCard = (req, res) =>

  Card.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  ).then(() => {
    if (!req.params.id) {
      res.status(404).send({message: "Передан несуществующий _id карточки!"})
    }
    res.status(200).send({ message: "Лайк поставлен!" })
    }).catch((err) => {
    res.status(500).send({ message: `Произошла ошибка ${err.message}` });
  });

module.exports.dislikeCard = (req, res) =>
  Card.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } },
    { new: true }
  ).then(() => {
    if (!req.params.id) {
      res.status(404).send({message: "Передан несуществующий _id карточки!"})
    }
    res.status(200).send({ message: "Лайк убран!" })
    }).catch((err) => {
    res.status(500).send({ message: `Произошла ошибка ${err.message}` });
  });
