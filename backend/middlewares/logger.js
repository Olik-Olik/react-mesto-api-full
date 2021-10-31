// импортируем нужные модули
const winston = require('winston');// библиотека для логирования
const expressWinston = require('express-winston');
const path = require('path');

const pathWithLogs = path.join(__dirname, '../logs');

// winston.add(winston.transports.File, { filename: path.join(__dirname, 'error.log') });

// запросы к серверу будем логировать.  Логгер запросов.
const requestLogger = expressWinston.logger({
  transports: [new winston.transports.File({ filename: path.join(pathWithLogs, 'request.log') }),
  ], // куда нужно писать лог.(логи можно писать в консоль или в сторонний сервис аналитики,
  // но мы ограничимся файлом)
  level: 'info',
  format: winston.format.json(), // формат записи логов json
});

// ошибки сервера будем логировать. В лог
// записывалась информация о ней — имя ошибки, сообщение и её стектрейс
const errorLogger = expressWinston.errorLogger({
  transports: [new winston.transports.File({ filename: path.join(pathWithLogs, 'error.log') })],
  level: 'info',
  format: winston.format.json(),
});

module.exports = {
  requestLogger,
  errorLogger,
};
