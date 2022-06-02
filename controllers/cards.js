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
  const { id } = req.params;
  if (!id) {
    res.status(400).send({ message: 'ID не был передан!' });
    return;
  }

  Card.findOne({ id })
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'карточка не найдена' });
        return;
      }
      const user = req.user._id.toString();
      const owner = card.owner.toString();
      if (user === owner) {
        Card.findByIdAndRemove(card.id)
          .then(() => {
            res.status(200).send({ message: 'Карточка удалена!' });
          })
          .catch((err) => {
            res
              .status(403)
              .send({ message: 'Вы не являетесь создателем карточки!' });
            next;
          });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Некорректный ID' });
        return;
      }
      next(err);
    });
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
