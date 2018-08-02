const axios = require('axios')
const configs = require('../configs')
const io = require('socket.io-client')

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

  if (notification.important) {
    // send to email
  }
  console.log(socket)
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