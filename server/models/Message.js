const mongoose = require('mongoose');

var MessageScheme = mongoose.Schema({
  date: {type: Date, default: Date.now},
  chat: String,
  from: String,
  to: String,
  text: '',
  system: {type: Boolean, default: false},
  silent: {type: Boolean, default: false},
  seenBy: Object
});

module.exports = mongoose.model('Message', MessageScheme);