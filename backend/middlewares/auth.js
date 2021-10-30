// eslint-disable-next-line import/no-extraneous-dependencies
const jwt = require('jsonwebtoken');
const UnAuthorizedError = require('../errors/UnAuthorizedError');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer')) {
    // return res.status(401).send({ message: 'Необходима авторизация' });
    throw new UnAuthorizedError('Необходима авторизация!');
  }
  const token = authorization.replace('Bearer ', '');
  /*  let payload; */
  try {
    jwt.verify(token, 'some-secret-key');
    req.userId = jwt.decode(token)._id;
    next();
  } catch (e) {
    const err = new UnAuthorizedError('Необходима авторизация');
    next(err);
  }
/*
  try {
    // зашифрованный объект пользователя в строку
    payload = jwt.verify(token, 'some-secret-key');
    req.userId = jwt.decode(token)._id;
  } catch (err) {
    throw new UnAuthorizedError('Необходима авторизация!!!');
  }
  req.user = payload;// записываем пейлоуд в объект запроса
  next();
*/
};
