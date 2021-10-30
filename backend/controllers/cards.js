const Card = require('../models/card');
const NotFoundError = require('../errors/NotFoundError');// 404 например, когда мы не нашли ресурс по переданному _id;
const BadRequestError = require('../errors/BadRequestError');// 400 когда с запросом что-то не так; eslint-disable-next-line max-len
const ForbiddenError = require('../errors/ForbiddenError');// 403

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate('user')
    .then((cards) => res.status(200).send({ cards }));
};

module.exports.createCard = (req, res, next) => {
  const newName = req.body.name;
  const newLink = req.body.link;
  return Card.create({
    owner: req.userId,
    name: newName,
    link: newLink,
  })
    .then((card) => res.status(200).send({ card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Невалидный id пользователя '));
      }
      next(err);
      // res.status(500).send({ message: `Произошла ошибка:  ${err.message}` });
    }).catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  const cardId = req.params.id;
  Card.findById({ _id: cardId })
    //  выдает ошибку, если ни один документ не соответствует id
    .orFail(() => {
      throw new NotFoundError('Нет карточки с таким id в базе');
    })
    .then((card) => {
      // если собственник идентичен текущему юзеру
      console.log(`owner id ${card.owner.toString()}`);
      console.log(`user  id ${req.userId}`);
      if (card.owner.toString() === req.userId) {
        Card.deleteOne({ _id: cardId })
          .then(() => res.status(200).send({ message: 'Карточка удалена.' }));
      } else { throw new ForbiddenError('Чужие карточки не удаляют'); }
    }).catch(next);
};

module.exports.likeCard = (req, res, next) => {
  const cardId = req.params.id;
  const myUserId = req.userId;

  Card.findByIdAndUpdate({ _id: cardId },
    { $addToSet: { likes: myUserId } },
    { new: true, runValidators: true })
    .then((card) => {
      if (card) {
        res.status(200).send({ card });
      } else {
        throw new NotFoundError('Нет такого id для лайка');
      }
    })
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  const cardId = req.params.id;
  const myUserId = req.userId;

  Card.findByIdAndUpdate({ _id: cardId },
    { $pull: { likes: myUserId } },
    { new: true, runValidators: true })
    .then((card) => {
      if (card) {
        res.status(200).send({ card });
      } else {
        throw new NotFoundError({ message: 'Нет такого id для лайка' });
      }
    })
    .catch(next);
};
