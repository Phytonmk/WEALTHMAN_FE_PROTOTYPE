
const mongoose = require('mongoose');

const AnswersFormScheme = mongoose.Schema({
  id: String,
  user: String,
  answers: Object,
  date: {type: Date, default: Date.now}
});

module.exports = mongoose.model('AnswersForm', AnswersFormScheme);