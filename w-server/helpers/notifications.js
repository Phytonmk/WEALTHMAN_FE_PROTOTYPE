const axios = require('axios')
const configs = require('../configs')
const io = require('socket.io-client')
const mailer = require('./mailer')

const User = require('../models/User')
const Notification = require('../models/Notification')
const Request = require('../models/Request')
const Investor = require('../models/Investor')
const Manager = require('../models/Manager')
const Company = require('../models/Company')
// const socket = require('socket.io-client')(configs.chatsAccess.url)
let socket = null
axios.get('http://' + configs.chatsAccess.host + ':2905/chats-api/ws')
  .then((res) => {
    socket = io('ws://' + configs.chatsAccess.host + ':' + res.data.ws_port)
    // socket.on('connect', () => console.log('connected to sockets'))
    // socket.on('disconnect', () => console.log('disconnected from sockets'));
  })
  .catch((e) => console.log('Unabe to connect to chats'))
module.exports = (notificationData) => new Promise (async (resolve, reject) => {
  // if (request === undefined || title === undefined)
  //   reject('Request or title undfined: ', request, title)
  if (!notificationData.title)
    notificationData.title = 'No title'

  const notification = new Notification(notificationData)
  console.log('===notification===')
  console.log(notificationData)
  console.log(`Chats availible: ${socket !== null}`)
  console.log('==================')
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

  if (notification.important || true) {
    const logins = []
    for (let userId of notification.usersToNotify) {
      const user = await User.findById(userId)
      if (/^[^@]+@{1}[^\.]+\.{1}.+$/.test(user.login)) {
        logins.push(user.login)
      }
    }
    for (let emailAddress of logins) {
      let emailText = `<h3>Something related to your account happend on ${configs.host}</h3>`
      emailText += `<p>Request #${notification.request}</p>`
      emailText += `<p>${notification.title + (notification.subtitle ? ('\n' + notification.subtitle) : '')}</p>`
      emailText += `<p><a href="http://${configs.host}/#/request/${notification.request}">Learn more</a></p>`
      const email = {
        Recipients: [{ Email: emailAddress }],
        Subject: `You have the notification on ${configs.host}`,
        'Html-part': emailText,
        FromEmail: `no-reply@${configs.host}`,
        FromName: 'Wealthman notification service'
      }
      await mailer(email).catch(console.log)
    }
  }
  if (socket !== null) {
    socket.emit('message', {
      type: 'system_message',
      password: configs.chatsAccess.password,
      text: notification.title + (notification.subtitle ? ('\n' + notification.subtitle) : ''),
      link: notification.request ? '/request/' + notification.request : '',
      firstId: notification.usersToNotify[0] || '0',
      secondId: notification.usersToNotify[1] || '0',
    })
  }
  resolve()
})