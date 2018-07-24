
const mongoose = require('mongoose');

const KYCAnswersFormScheme = mongoose.Schema({
  id: Number,
  request: Number,
  answers: Object,
  date: {type: Date, default: Date.now}
});

module.exports = mongoose.model('KYCAnswersForm', KYCAnswersFormScheme);