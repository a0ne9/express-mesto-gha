const Card = require('../models/card');

module.exports.createCard = (req, res, next) => {
  const owner = req.user._id;
  const { name, link } = req.body;
  if (!name || !link) {
    res.status(400).send({ message: 'Название или ссылка не введены!' });
    return;
  }
  Card.create({ name, link, owner })
    .then((card) => {
      res.status(201).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(400)
          .send({ message: 'Название или ссылка введены неверно!' });
        return;
      }
      next(err);
    });
};

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      res.status(200).send(cards);
    })
    .catch((err) => next(err));
};

module.exports.deleteCard = (req, res, next) => {
  console.log(req.params.id);
  Card.findById(req.params.id)
    .then((card) => {
      console.log(card)
      console.log(req.user._id);
      console.log(card.owner);
      if (!card) {
        res.status(404).send({ message: 'Нет карточки с таким  ID' });
        return
      }
      if (req.user._id.toString() === card.owner.toString()) {
        Card.findByIdAndRemove(req.params.id)
          .then(() => {
            res.status(200).send({ message: 'Карточка удалена!' });
          })
          .catch((err) => {
            if (err.name === 'CastError') {
              res.status(400).send({ message: 'Некорректный ID' });
              return;
            }
            next(err);
          });
        return;
      }
      res.status(403).send({ message: 'Вы не являетесь автором этой карточки!' });
    })
    .catch((err) => next(err));
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      if (!card) {
        res
          .status(404)
          .send({ message: 'Передан несуществующий _id карточки!' });
        return;
      }
      res.status(200).send({ message: 'Лайк поставлен!' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Некорректный ID' });
        return;
      }
      next(err);
    });
};
module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      if (!card) {
        res
          .status(404)
          .send({ message: 'Передан несуществующий _id карточки!' });
        return;
      }
      res.status(200).send({ message: 'Лайк убран!' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Некорректный ID' });
        return;
      }
      next(err);
    });
};
