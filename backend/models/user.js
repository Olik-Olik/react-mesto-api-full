const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const isEmail = require('validator/lib/isEmail');

const isUrl = require('validator/lib/isURL');
const UnAuthorizedError = require('../errors/UnAuthorizedError');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about:
    {
      type: String,
      required: false,
      minlength: 2,
      maxlength: 30,
      default: 'Исследователь',
    },
  avatar:
    {
      type: String,
      required: false,
      default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
      validate: {
        validator: (link) => isUrl(link),
      },
      message: 'Измените линк-он неправильный',
    },

  // существование и подлинность
  email: {
    type: String,
    required: true,
    unique: true, // Так в базе не окажется несколько пользователей с одинаковой почтой
    validate: {
      validator: (v) => isEmail(v),
      message: 'Измените формат почты-он неправильный',
    },
  },

  password: {
    type: String,
    required: true,
    select: false, // по умолчанию хеш пароля пользователя не будет возвращаться из базы
  },
});

// eslint-disable-next-line func-names
userSchema.statics.findUserByCredentials = function ({ userEmail, userPassword }) {
  return this.findOne({ email: userEmail }).select('+password')
    .then((user) => {
      if (!user) {
        console.log('User not found');
        throw new UnAuthorizedError('Неправильный email или пароль');
      }
      const matched = bcrypt.compareSync(userPassword, user.password);
      if (matched) {
        console.log(`Usr: ${user.toString()}`);
        return {
          data: {
            id: user._id,
            name: user.name,
            about: user.about,
            avatar: user.avatar,
            email: user.email,
          },
        };
      }
      throw new UnAuthorizedError('Неправильный email или пароль');
    });
};

module.exports = mongoose.model('user', userSchema);
