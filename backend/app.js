require('dotenv').config();

console.log(process.env.NODE_ENV);

const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');// не нужен
const { errors } = require('celebrate');
const router = require('express').Router(); // корневой роутер
const { logger } = require('express-winston');
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
const apiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 60 minutes
  max: 10000, // start blocking after 100 requests
  message: 'start blocking after 100 requests Заблокировано по кол-ву запросов ',
});

app.use(limiter);

// only apply to requests that begin with /api/
app.use('/api/', apiLimiter);

const url = 'mongodb://localhost:27017/mestodb';
const auth = require('./middlewares/auth');
const { loginValidate, userValidate } = require('./validator/validator');

// Массив доменов, с которых разрешены кросс-доменные запросы
const httpCors = [
  /* 'http://back.nomoredomains.work',
  'http://front.nomoredomains.work', */
  'http://localhost:3624',
  'http://localhost:3000',
  /* 'https://front.nomoredomains.work',
  'https://localhost:3624',
  'https://localhost:3624',
  'https://front.nomoredomains.work',
  'https://back.nomoredomains.work', */
];
// const options = { origin: httpCors};
const options = {
  origin: httpCors,
  method: ['GET, HEAD,PUT,PATCH,POST,DELETE'],
  preflightContinue: false,
  optionsSuccessStatus: 200,
  credentials: true,
};

/*
const options = {
  origin: [
    'http://localhost:3624'],
  method: ['GET, HEAD,PUT,PATCH,POST,DELETE'],
  preflightContinue: false,
  optionsSuccessStatus: 200,
  credentials: true,
};

app.use(cors(options));
*/
/*
app.use((req, res, next) => {
  // const { origin } = req.headers;
  //  if (allowedCors.includes(origin)) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  //  }
  const { method } = req;
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
  // сохраняем список заголовков исходного запроса
  //  const requestHeaders = req.headers['access-control-request-headers'];
  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    //   res.header('Access-Control-Allow-Headers', requestHeaders);
    //    return res.end();
    return res.status(200).send();
  }
  next();
});
*/
// mongoose.connect(url, { useNewUrlParser: true }, { useNewUrlParser: true });

mongoose.connect(url,
  { useNewUrlParser: true },
  { useCreateIndex: true },
  { useFindAndModify: false })
  .then(() => console.log('connect mongo'));

mongoose.set('useCreateIndex', true);

app.use(cors(options));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Логгер запросов до  роутов
app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

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
app.use(errorLogger);
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
