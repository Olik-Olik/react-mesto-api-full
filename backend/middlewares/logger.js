/*
// импортируем нужные модули
const winston = require('winston');
const expressWinston = require('express-winston');
const { request } = require('express');

// запросы к серверу будем логировать.  Логгер запросов.
const requestLogger = expressWinston.logger({
  transports: [new winston.transports.File({ filename: 'request.log' }),
  ], // куда нужно писать лог.(логи можно писать в консоль или в сторонний сервис аналитики,
  // но мы ограничимся файлом)
  format: winston.format.json(), // формат записи логов json
});

// ошибки сервера будем логировать. В лог
// записывалась информация о ней — имя ошибки, сообщение и её стектрейс
const errorLogger = expressWinston.errorLogger({
  transports: [new winston.transports.File({
    filename: 'error.log',
  })],
  format: winston.format.json(),
});

module.exports = {
  requestLogger,
  errorLogger,
};
*/
