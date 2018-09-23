const crypto = require('crypto')
const app = require('express')()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const amqp = require('amqplib/callback_api')
const Message = require('../../models/Message')
const User = require('../../models/User')
const Chat = require('../../models/Chat')
const Token = require('../../models/accessToken')
const getUserData = require('../../helpers/getUserData')
const freePort = require('find-free-port')

const salt = 'super salt'

const configs = require('../../configs')

const genToken = (user) => {
  const token = 
    crypto.createHash('md5')
    .update(
      salt +
      user.id +
      salt +
      (new Date).getTime() +
      salt +
      user.password_hash +
      salt
    ).digest("hex")
  return token
}

module.exports = async (app) => {

  global.ws_port = await new Promise((resolve, reject) => {
    freePort(3000, (err, freePort) => {
      if (err)
        reject(err)
      else
        resolve(freePort)
    })
  })

  console.log(`Port: ${global.ws_port}`)

  await new Promise((resolve, reject) => {
    http.listen(global.ws_port, () => {
      console.log(`Sockets opened on ${global.ws_port}`)
    })
  })

  let connections = 0
  const sessionTokens = {}
  const usersOfThisWorker = {}
  const userDataCache = {} // do a cache cleaning

  // setInterval(() => {
  //   process.send({
  //     type: 'worker-connections',
  //     global.ws_port, connections
  //   })
  // }, 1000 * 10)

  // process.on('message', (msg) => {
  //   if (msg.disconnect) {
  //     let i = 0
  //     if (connections >= msg.amount) {
  //       for (let token in sessionTokens) {
  //         usersOfThisWorker[sessionTokens[token]._id].emmit('message', {reconnect: true})
  //         usersOfThisWorker[sessionTokens[token]._id].disconnect(true)
  //         delete usersOfThisWorker[sessionTokens[token]._id]
  //         delete sessionTokens[token]
  //         // connections--
  //         i++
  //         if (i >= msg.amount)
  //           break
  //       }
  //     }
  //   }
  // })

  amqp.connect(configs.chats.rabbitMq, function(err, conn) {
    if (err) {
      console.log(err)
    } else {
      // console.log('coonected to rabbitMq')
    }

    const exchager = 'messages'
    // const queue = 'queue-' + global.ws_port

    conn.createChannel(function(err, ch) {
      if (err) {
        console.log(err)
      }
      ch.assertExchange('messages', 'fanout', {durable: false});
      // ch.assertQueue(queue, {durable: false})
      ch.prefetch(1)
      ch.assertQueue('', {exclusive: true}, function(err, q) {
        ch.bindQueue(q.queue, 'messages', '')
        ch.consume(q.queue, function(msg) {
          const message = JSON.parse(msg.content.toString())
          console.log(`Got messages from exchanger on global.ws_port ${global.ws_port} for user ${message.companionId}, this user here: ${usersOfThisWorker[message.companionId] !== undefined}`)
          for (let reciver of message.to) {
            if (usersOfThisWorker[reciver] !== undefined) {
              usersOfThisWorker[reciver].emit('message', message)
              ch.ack(msg)
            }
          }
        }, {noAck: false})
      })
      io.on('connection', (socket) => {
        connections++
        socket.on('message', async (message) => {
          console.log(message)
          if (message.type === 'auth') {
            const token = await Token.findOne({token: message.accessToken})
            if (token === null) {
              socket.emit('message', {success: false, err: {code: 403, text: 'not auth, marker 1'}})
              return
            }
            const user = await User.findOne({_id: token.user})
            if (user === null) {
              socket.emit('message', {success: false, err: {code: 403, text: 'not auth, marker 2'}})
              return
            }
            let senderData = await getUserData(user._id)
            const socketToken = genToken(user)
            sessionTokens[socketToken] = {
              id: user._id,
              name: senderData.name,
              img: senderData.img
            }
            userDataCache[user._id] = senderData
            usersOfThisWorker[user._id] = socket
            socket.sessionToken = socketToken
            socket.emit('message', {success: true, token: socketToken})
          } else if (message.type === 'text_message') {
            if (sessionTokens[message.token] === undefined) {
              socket.emit('message', {success: false, err: {code: 403, text: 'not auth'}})
              return
            }
            if (userDataCache[message.to] === undefined) {
              const userData = await getUserData(message.to)
              if (userData.unsuccess) {
                socket.emit('message', {success: false, err: {code: 404, text: 'user not found'}})
                return
              }
              userDataCache[message.to] = userData
            }

            const last_message = {
              sender_id: sessionTokens[message.token].id,
              pics: [sessionTokens[message.token].img, userDataCache[message.to].img],
              names: [sessionTokens[message.token].name, userDataCache[message.to].name],
              date: Date.now(),
              text_preview: message.text.substr(0, 100)
            }
            const ids = [sessionTokens[message.token].id, message.to]
            if (sessionTokens[message.token].id > message.to) {
              ids.reverse()
              last_message.pics.reverse()
              last_message.names.reverse()
            }
            let chat = await Chat.findOne({users: ids})
            if (chat === null) {
              chat = new Chat({users: ids, last_message})
            } else {
              chat.set({last_message})
            }
            let seenBy = {[sessionTokens[message.token].id]: true, [message.to]: false}
            const newMessage = new Message({
              chat: chat._id,
              from: sessionTokens[message.token].id,
              to: message.to,
              text: message.text,
              seenBy
            })
            console.log('msg sent to exchanger')
            ch.publish(exchager, '', new Buffer.from(JSON.stringify({
              success: true,
              newMessage: true,
              chat: chat._id,
              companionId: sessionTokens[message.token].id,
              from: 'companion',
              to: [message.to],
              text: message.text,
              date: Date.now()
            })))
            // if (usersOfThisWorker[message.to] !== undefined)
            //   usersOfThisWorker[message.to].emit('message', {
            //     success: true,
            //     newMessage: true,
            //     chat: chat._id,
            //     companionId: sessionTokens[message.token].id,
            //     from: 'companion',
            //     text: message.text,
            //     date: Date.now()
            //   })
            socket.emit('message', {success: true, msgSent: message.frontendMsgId})
            await newMessage.save()
            await chat.save()
          } else if (message.type === 'system_message') {
            if (message.password !== '123456') {
              message.emit('message', {success: false, err: {code: 403, text: 'wrong password'}})
              return
            }
            const users = message.firstId < message.secondId ? [message.firstId, message.secondId] : [message.secondId, message.firstId]
            let chat = await Chat.findOne({users})
            if (userDataCache[message.firstId] === undefined) {
              const userData = await getUserData(message.firstId)
              if (userData.unsuccess) {
                socket.emit('message', {success: false, err: {code: 404, text: 'user 1 not found'}})
                return
              }
              userDataCache[message.firstId] = userData
            }
            if (userDataCache[message.secondId] === undefined) {
              const userData = await getUserData(message.secondId)
              if (userData.unsuccess) {
                socket.emit('message', {success: false, err: {code: 404, text: 'user 2 not found'}})
                return
              }
              userDataCache[message.secondId] = userData
            }
            const last_message = {
              sender_id: -1,
              pics: [userDataCache[message.firstId].img, userDataCache[message.secondId].img],
              names: [userDataCache[message.firstId].name, userDataCache[message.secondId].name],
              date: Date.now(),
              text_preview: message.text.substr(0, 100)
            }
            if (message.firstId > message.secondId) {
              last_message.pics.reverse()
              last_message.names.reverse()
            }
            if (chat === null) {
              chat = new Chat({users, last_message})
            } else {
              chat.set({last_message})
            }
            const newMessage = new Message({
              chat: chat._id,
              from: -1,
              to: -1,
              text: message.text,
              link: message.link,
              seenBy: {
                [message.firstId]: false,
                [message.secondId]: false
              }
            })
            for (let id of users)
              // if (usersOfThisWorker[id] !== undefined)
              ch.publish(exchager, '', new Buffer.from(JSON.stringify({
                // usersOfThisWorker[id].emit('message', {
                  success: true,
                  newMessage: true,
                  chat: chat._id,
                  companionId: -1,
                  from: 'system',
                  to: [message.firstId, message.secondId],
                  text: message.text,
                  date: Date.now()
                // })
              })))
            await newMessage.save()
            await chat.save()
          } else {
            socket.emit('message', {success: false, err: {code: 406, text: 'wrong request'}})
          }
        })
        socket.on('disconnecting', () => {
          // console.log(usersOfThisWorker, '----------', sessionTokens, '----------', socket.sessionToken)
          if (sessionTokens[socket.sessionToken] !== undefined) {
            delete usersOfThisWorker[sessionTokens[socket.sessionToken]._id]
            delete sessionTokens[socket.sessionToken]
          }
          connections--
        })
      })
    })
  })
}
