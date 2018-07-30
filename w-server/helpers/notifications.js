const axios = require
const Notification = require('../models/Notification')
module.exports = (request, title, subtitle='', img='') => new Promise (async (resolve, reject) => {
  if (request === undefined || title === undefined)
    reject('Request or title undfined: ', request, title)
  const notification = new Notification({request, title, subtitle, img})
  await notification.save()
  // send notification to rabbit mq
  resolve()
})