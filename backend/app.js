// const errors = require('celebrate');
// require('celebrate');
const express = require('express');
// eslint-disable-next-line max-len
// const helmet = require('helmet');// Helmet helps you secure your Express apps by setting various HTTP headers
const mongoose = require('mongoose');
const bodyParser = require('body-parser');// не нужен
const { errors } = require('celebrate');
const router = require('express').Router(); // корневой роутер
const { logger } = require('express-winston');
// const rateLimit = require('express-rate-limit');

const routes = require('./routes/users');
const cardRoutes = require('./routes/cards');
// require('./middlewares/auth');
const NotFoundError = require('./errors/NotFoundError');

const { createUser, login } = require('./controllers/users');

// require('dotenv').config();

const { PORT = 3624 } = process.env;

const app = express();
// app.use(helmet());
// eslint-disable-next-line max-len
app.disable('x-powered-by'); // защитим от  использования этот заголовок (включенный по умолчанию)
// для выявления приложений на базе Express и активации целенаправленных атак
/*

const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 60 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'limit each IP to 100 requests  Превышен лимит запросов с Вашего IP',
});

const apiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 60 minutes
  max: 100, // start blocking after 100 requests
  message: 'start blocking after 100 requests Заблокировано по кол-ву запросов ',
});
*/

//  apply to all requests
// app.use(limiter);

// only apply to requests that begin with /api/
// app.use('/api/', apiLimiter);

const url = 'mongodb://localhost:27017/mestodb';
const auth = require('./middlewares/auth');
const { loginValidate, userValidate } = require('./validator/validator');
const { requestLogger, errorLogger } = require('./middlewares/logger');

// Массив доменов, с которых разрешены кросс-доменные запросы
const allowedCors = [
  'https://back.nomoredomains.work',
  'http://back.nomoredomains.work',
  'https://front.nomoredomains.work',
  'http://front.nomoredomains.work',
  'http://localhost:3000',
  'http://localhost:3624',
];

mongoose.connect(url, { useNewUrlParser: true }, { useNewUrlParser: true });
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Логгер запросов до  роутов
// app.use(requestLogger);

app.use((req, res, next) => {
  const { origin } = req.headers; // Сохраняем источник запроса в переменную origin
  // проверяем, что источник запроса есть среди разрешённых
//  if (allowedCors.includes(origin)) {
    // устанавливаем заголовок, который разрешает браузеру запросы с этого источника
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//  }
  const { method } = req; // Сохраняем тип запроса (HTTP-метод) в соответствующую переменную

  // Значение для заголовка Access-Control-Allow-Methods по умолчанию (разрешены все типы запросов)
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';

  // Если это предварительный запрос, добавляем нужные заголовки
  if (method === 'OPTIONS') {
    // разрешаем кросс-доменные запросы любых типов (по умолчанию)
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    return res.status(200).send();
  }
  next();
});

/*app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});*/

app.post('/signin', loginValidate, login);
app.post('/signup', userValidate, createUser);
app.use(auth);// все роуты ниже этой строки будут защищены
app.use(routes);
app.use(cardRoutes);
app.use(logger);
app.use(() => {
  throw new NotFoundError('Нет такой страницЫ');
});

// errorLogger нужно подключить после обработчиков роутов и до обработчиков ошибок
// app.use(errorLogger);
app.use(errors()); // обработчик ошибок celebrate

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({ message: statusCode === 500 ? 'На сервере произошла ошибка' : message });
  next();
});
app.listen(PORT, () => {
  console.log(`Express is Working in console ${PORT}`);
});
module.exports = { router };

//  Введите ограничение скорости передачи данных например, express-limiter
// обработчик csurf для защиты от подделки межсайтовых запросов (CSRF).
// Используйте safe-regex, чтобы убедиться в невосприимчивости регулярных выражений к атакам
