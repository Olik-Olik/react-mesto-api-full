const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

const validateURL = (value) => {
  if (!validator.isURL(value, { require_protocol: true })) {
    throw new Error('Неправильный формат ссылки');
  }
  return value;
};

const userValidate = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string()
      .regex(/(http|https):\/\/(www)?\.?([A-Za-z0-9.-]+)\.([A-z]{2,})((?:\/[+~%/.\w-_]*)?\??(?:[-=&;%@.\w_]*)#?(?:[\w]*))?/),
  }),
});
const loginValidate = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});
const updateUserValidate = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
});

const updateAvatarValidate = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string()
      .regex(/(http|https):\/\/(www)?\.?([A-Za-z0-9.-]+)\.([A-z]{2,})((?:\/[+~%/.\w-_]*)?\??(?:[-=&;%@.\w_]*)#?(?:[\w]*))?/).required(),
  }),
});

const cardValidate = celebrate({
  body: Joi.object().keys({
    link: validateURL,
    name: Joi.string().required().min(2).max(30),
  }),
});

const idParamsValidator = celebrate({
  params: Joi.object().keys({
    id: Joi.string().length(24).hex().required(),
  }),
});

const idValidator = celebrate({
  body: Joi.object().keys({
    id: Joi.string().length(24).hex().required(),
  }),
});

module.exports = {
  userValidate,
  loginValidate,
  updateUserValidate,
  updateAvatarValidate,
  cardValidate,
  idValidator,
  idParamsValidator,
};
