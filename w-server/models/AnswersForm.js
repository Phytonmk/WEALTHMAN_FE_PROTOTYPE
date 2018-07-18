
const mongoose = require('mongoose');

const AnswersFormScheme = mongoose.Schema({
  id: Number,
  user: Number,
  answers: Object
});

module.exports = mongoose.model('AnswersForm', AnswersFormScheme);