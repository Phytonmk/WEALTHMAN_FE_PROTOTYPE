const mongoose = require('mongoose');

var ChatScheme = mongoose.Schema({
  users: [Number],
  ws_port: Number,
  new_messages: {type: Number, default: 1}
  last_message: {
    sender_name: String,
    date: Date,
    text_preview: String
  }
});

module.exports = mongoose.model('Chat', ChatScheme);