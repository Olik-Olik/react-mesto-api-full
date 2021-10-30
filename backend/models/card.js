const mongoose = require('mongoose');
const isUrl = require('validator/lib/isURL');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link:
    {
      type: String,
      required: true,
      validate: {
        validator: (link) => isUrl(link),
      },
      message: 'Измените линк-он неправильный',
    },
  owner:
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
  likes:
    {
      type: Array,
      // type: mongoose.Schema.Types.ObjectId,
      default: [],
    },
  createdAt:
    {
      type: Date,
      required: true,
      default: Date.now,
    },
});
module.exports = mongoose.model('card', cardSchema);
