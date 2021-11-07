// eslint-disable-next-line import/no-extraneous-dependencies
const bcrypt = require('bcryptjs');
// eslint-disable-next-line import/no-extraneous-dependencies
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');// 404
const ConflictError = require('../errors/ConflictError');
const UnAuthorizedError = require('../errors/UnAuthorizedError');

const { NODE_ENV, JWT_SECRET_KEY } = process.env;
module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  const userId = req.params.id;
  return User.findById({ _id: userId })
    .then((user) => {
      if (user) {
        res.status(200).send(user);
      } else {
        throw new NotFoundError('Пользователь по данному id отсутствует  в базе');
      }
    })
    .catch(next);
};

module.exports.getCurrentUser = (req, res, next) => {
  const myUserId = req.userId;
  console.log(myUserId);
  return User.findById({ _id: myUserId })
    .orFail(() => {
      console.log('user not found');
      throw new NotFoundError('Пользователь по данному id отсутствует  в базе');
    })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  // eslint-disable-next-line no-unused-expressions
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name: req.body.name,
      about: req.body.about,
      avatar: req.body.avatar,
      email: req.body.email,
      password: hash,
    }))
    .then((user) => {
      res.status(201).send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
      });
    })
    .catch((eerr) => {
      if (eerr.code === 11000) {
        next(new ConflictError('Такой email в базе есть , придумывай другой '));
      } else {
        next(eerr);
      }
    });
};

module.exports.updateUser = (req, res, next) => {
  const newName = req.body.name;
  const newAbout = req.body.about;
  return User.findByIdAndUpdate({ _id: req.userId }, {
    name: newName,
    about: newAbout,
  }, { new: true, runValidators: true })
    .orFail(() => {
      throw new NotFoundError('Пользователь по данному id отсутствует  в базе');
    })
    .then((user) => res.status(200).send(user))
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const userEmail = req.body.email;
  const userPassword = req.body.password;

  return User.findUserByCredentials({ userEmail, userPassword }).then((user) => {
    if (!user) {
      throw new UnAuthorizedError();
    } else {
      const token = jwt.sign({ _id: user.data.id },
        NODE_ENV === 'production' ? JWT_SECRET_KEY : 'dev-secret',
        // 'some-secret-key',
        { expiresIn: '7d' });
      res.status(201).send({ token });
    }
  }).catch(next);
};

module.exports.updateAvatar = (req, res, next) => {
  const newAvatar = req.body.avatar;
  return User.findByIdAndUpdate({ _id: req.userId },
    { avatar: newAvatar },
    { new: true, runValidators: true })
  // если не соответствует- то 404
    .orFail(() => {
      throw new NotFoundError('Пользователь c данным id отсутствует  в базе');
    })
    .then((user) => res.status(200).send(user))
    .catch(next);
};
