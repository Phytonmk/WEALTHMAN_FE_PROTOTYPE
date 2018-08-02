
const mongoose = require('mongoose');

const KYCAnswersFormScheme = mongoose.Schema({
  request: String,
  answers: Object,
  date: {type: Date, default: Date.now}
});

module.exports = mongoose.model('KYCAnswersForm', KYCAnswersFormScheme);