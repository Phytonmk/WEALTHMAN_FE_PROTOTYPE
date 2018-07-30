const mongoose = require('mongoose');

const NotificationSchema = mongoose.Schema({
  date: {type: Date, default: Date.now},
  request: String,
  title: String,
  subtitle: String,
  img: String // maybe not neccessary, not sure
});

module.exports = mongoose.model('Notification', NotificationSchema);