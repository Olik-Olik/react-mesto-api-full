# Проект на Реакте с авторизацией и регистрацией на сторне пользователя

# УРРРА
sudo netstat -lntp | grep 3000 

###Все запросы на авторизацию, регистрацию и проверку токена 
работают через сервис `https://auth.nomoreparties.co`.


###Чтобы обрабатывать запрос HTTP POST в Экспресс .js версии 4 и выше,
Установлен  body-parser
npm install body-parser --save

###Инфраструктура проекта
Создайте проект
Создайте папку с проектом и инициализируйте в ней package.json.
Настройте editorconfig

Затем создайте в корне проекта файл .editorconfig и скопируйте туда настройки:
### http://editorconfig.org

###Настройте линтер .eslintrc
Установлен линтер
npm install eslint --save-dev
./node_modules/.bin/eslint --init
Установим 
eslint-config-airbnb-base
eslint-plugin-import

###Инициализируйте git-репозиторий
Инициализируйте git-репозиторий в корне проекта и создайте файл .gitignore и установить,
т.к. по умолчанию он не добавляется в репозиторий:
gitignore
git add .gitignore
git commit -m "message" .gitignore

###express
npm i -S express

###Точку входа — файл app.js
Заведите в нём express-сервер и настройте его запуск на 3000 порту.
npm run start 

###Настройте хот релоуд-установите пакет nodemon
"dev": "nodemon app.js"
Приложение с хот релоудом должно запускаться командой:
npm run dev 

###База данных, контроллеры и роуты для карточек и пользователей
Подключитесь к Mongo
В app.js подключитесь к серверу MongoDB по адресу:
mongodb://localhost:27017/mestodb
Запуск
brew services start mongodb-community@4.4
npm i mongoose
###Запускаем сервер MongoDB
Сервер mongo запускают командой mongod:
mongod

xcode-select --install
sudo xcodebuild -license
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
brew tap mongodb/brew
brew install mongodb-community@4.4
Для запуска: brew services start mongodb-community@4.2
###Ссылка на установщик Compass: https://www.mongodb.com/download-center/compass.

