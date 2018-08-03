const axios = require('axios')
const configs = require('../configs')
const io = require('socket.io-client')

const Notification = require('../models/Notification')
const Request = require('../models/Request')
const User = require('../models/User')
const Investor = require('../models/Investor')
const Manager = require('../models/Manager')
const Company = require('../models/Company')

const mailer = require('../helpers/mailer')

let socket = null
axios.get('http://' + configs.chatsAccess.host + ':2905/chats-api/ws')
  .then((res) => {
    socket = io('ws://' + configs.chatsAccess.host + ':' + res.data.ws_port)
  })
  .catch((e) => console.log('Unabe to connect to chats'))
module.exports = (notificationData) => new Promise (async (resolve, reject) => {
  if (!notificationData.title)
    notificationData.title = 'No title'

  const notification = new Notification(notificationData)

  if (notificationData.usersToNotify === undefined) {
    notification.usersToNotify = []
    const request = await Request.findById(notificationData.request)
    if (request.investor) {
      const investor = await Investor.findById(request.investor)
      notification.usersToNotify.push(investor.user)
    }
    if (request.manager) {
      const manager = await Manager.findById(request.manager)
      notification.usersToNotify.push(manager.user)
    }
    if (request.company) {
      const company = await Company.findById(request.company)
      notification.usersToNotify.push(company.user)
    }
    notification.markModified('usersToNotify')
  }
  
  await notification.save()

  const link = notification.request ? '/request/' + notification.request : ''

  if (notification.important) {
    for (let recipeint of notification.usersToNotify) {
      const user = User.findById(recipeint)
      if (/^[^@]+@{1}[^\.]+\.{1}.+$/.test(user.login)) {
        await mailer({
          Recipients: [{ Email: user.login }],
          Subject: 'Confirm your email',
          'Text-part': `You have an important notfication on platform.wealthman.io\n\n${notification.title}\n${notification.subtitle}\n${link ? `\nLearn more ${link}` : ''}`,
          'Html-part': `You have an important notfication on platform.wealthman.io\n\n<b>${notification.title}</b>\n${notification.subtitle}\n${link ? `\n<a href="${link}">Learn more</a>` : ''}`,
          FromEmail: `no-reply@${currentDomain}`,
          FromName: 'Wealthman notification'
        })
      }
    }
  }
  console.log(socket)
  if (socket !== null) {
    socket.emit('message', {
      type: 'system_message',
      password: configs.chatsAccess.password,
      text: notification.title + (notification.subtitle ? ('\n' + notification.subtitle) : ''),
      link,
      firstId: notification.usersToNotify[0] || '0',
      secondId: notification.usersToNotify[1] || '0',
    })
  }
  resolve()
})