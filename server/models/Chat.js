const mongoose = require('mongoose');

var ChatScheme = mongoose.Schema({
  users: [String],
  last_message: {
    sender_id: String,
    pics: [String, String],
    names: [String, String],
    date: Date,
    text_preview: String
  }
});

module.exports = mongoose.model('Chat', ChatScheme);