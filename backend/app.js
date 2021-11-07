import { config } from 'dotenv';

config();

// console.log(process.env.NODE_ENV);

// eslint-disable-next-line import/no-extraneous-dependencies
const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');// не нужен
const { errors } = require('celebrate');
const router = require('express').Router(); // корневой роутер
// const { logger } = require('express-winston');
const rateLimit = require('express-rate-limit');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const routes = require('./routes/users');
const cardRoutes = require('./routes/cards');
require('./middlewares/auth');
const NotFoundError = require('./errors/NotFoundError');
const { createUser, login } = require('./controllers/users');

const { PORT = 3624 } = process.env;

const app = express();
app.use(helmet());

app.disable('x-powered-by');

// для выявления приложений на базе Express и активации целенаправленных атак
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 60 minutes
  max: 10000, // limit each IP to 100 requests per windowMs
  message: 'limit each IP to 100 requests  Превышен лимит запросов с Вашего IP',
});

/*
const apiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 60 minutes
  max: 10000, // start blocking after 100 requests
  message: 'start blocking after 100 requests Заблокировано по кол-ву запросов ',
});
*/

// only apply to requests that begin with /api/
// app.use('/api/', apiLimiter);

const url = 'mongodb://localhost:27017/mestodb';
const auth = require('./middlewares/auth');
const { loginValidate, userValidate } = require('./validator/validator');

// Массив доменов, с которых разрешены кросс-доменные запросы
const httpCors = [
  'https://back.nomoredomains.work',
  'https://front.nomoredomains.work',
  'http://back.nomoredomains.work',
  'http://front.nomoredomains.work',
  'http://localhost:3626',
  'http://localhost:3000',
];

const options = {
  origin: httpCors,
  method: ['GET,HEAD,PUT,PATCH,POST,DELETE'],
  preflightContinue: false,
  optionsSuccessStatus: 200,
  credentials: true,
};

app.use(cors(options));

// app.use(logger);

mongoose.connect(url,
  { useNewUrlParser: true },
  { useCreateIndex: true },
  { useFindAndModify: false })
  .then(() => console.log('connect mongo'));

mongoose.set('useCreateIndex', true);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Логгер запросов до  роутов
app.use(requestLogger);
app.use(limiter);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use(errors()); // обработчик ошибок celebrate

app.post('/signin', loginValidate, login);
app.post('/signup', userValidate, createUser);
app.use(auth);// все роуты ниже этой строки будут защищены
app.use(routes);
app.use(cardRoutes);
app.use(() => {
  throw new NotFoundError('Нет такой страницЫ');
});
// errorLogger нужно подключить после обработчиков роутов и до обработчиков ошибок
app.use(errorLogger);

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500
      ? `На сервере произошла ошибк: ${err.toString()}` : message,
  });
  next();
});

app.listen(PORT, () => {
  console.log(`Express is Working in console ${PORT}`);
});

module.exports = { router };
