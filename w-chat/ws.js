const crypto = require('crypto');
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const Message = require('./models/Message');
const Chat = require('./models/Chat');
const User = require('./models/User');
const Token = require('./models/accessToken');

const getUserData = require('./getUserData');

const salt = 'super salt'

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
    ).digest("hex");
  return token;
}

module.exports = (port) => {
  http.listen(port, function(){
    console.log(`   ║  Scokets opened on ${port} ║`);
  });

  const sessionTokens = {};
  const usersOfThisWorker = {};
  const userDataCache = {};

  io.on('connection', (ws) => {
    ws.on('message', async (message) => {
      console.log(message);
      if (message.type === 'auth') {
        const token = await Token.findOne({token: message.accessToken});
        if (token === null) {
          ws.emit('message', {success: false, err: {code: 403, text: 'not auth, marker 1'}});
          return;
        }
        const user = await User.findOne({id: token.user});
        if (user === null) {
          ws.emit('message', {success: false, err: {code: 403, text: 'not auth, marker 2'}});
          return;
        }
        let senderData = await getUserData(user.id);
        const wsToken = genToken(user);
        sessionTokens[wsToken] = {
          id: user.id,
          name: senderData.name,
          img: senderData.img
        };
        userDataCache[user.id] = senderData;
        usersOfThisWorker[user.id] = ws;
        ws.emit('message', {success: true, token: wsToken});
      } else if (message.type === 'text_message') {
        if (sessionTokens[message.token] === undefined) {
          ws.emit('message', {success: false, err: {code: 403, text: 'not auth'}});
          return;
        }
        if (userDataCache[message.to] === undefined) {
          const userData = await getUserData(message.to);
          if (userData.unsuccess) {
            ws.emit('message', {success: false, err: {code: 404, text: 'user not found'}});
            return;
          }
          userDataCache[message.to] = userData;
        }

        const last_message = {
          sender_id: sessionTokens[message.token].id,
          pics: [sessionTokens[message.token].img, userDataCache[message.to].img],
          names: [sessionTokens[message.token].name, userDataCache[message.to].name],
          date: Date.now(),
          text_preview: message.text.substr(0, 100)
        }
        const ids = [sessionTokens[message.token].id, message.to];
        if (sessionTokens[message.token].id > message.to) {
          ids.reverse();
          last_message.pics.reverse();
          last_message.names.reverse();
        }
        let chat = await Chat.findOne({users: ids});
        if (chat === null) {
          chat = new Chat({users: ids, last_message});
        } else {
          chat.set({last_message});
        }
        let seenBy = {[sessionTokens[message.token].id]: true, [message.to * 1]: false};
        const newMessage = new Message({
          chat: chat.id,
          from: sessionTokens[message.token].id,
          to: message.to,
          text: message.text,
          seenBy
        });
        if (usersOfThisWorker[message.to] !== undefined)
          usersOfThisWorker[message.to].emit('message', {
            success: true,
            newMessage: true,
            chat: chat.id,
            companionId: sessionTokens[message.token].id,
            from: 'companion',
            text: message.text,
            date: Date.now()
          });
        ws.emit('message', {success: true, msgSent: message.frontendMsgId})
        await newMessage.save();
        await chat.save();
      } else if (message.type === 'system_message') {
        if (message.password !== '123456') {
          message.emit('message', {success: false, err: {code: 403, text: 'wrong password'}});
          return;
        }
        const users = message.firstId < message.secondId ? [message.firstId, message.secondId] : [message.secondId, message.firstId]
        let chat = await Chat.findOne({users});
        if (userDataCache[message.firstId] === undefined) {
          const userData = await getUserData(message.firstId);
          if (userData.unsuccess) {
            ws.emit('message', {success: false, err: {code: 404, text: 'user 1 not found'}});
            return;
          }
          userDataCache[message.firstId] = userData;
        }
        if (userDataCache[message.secondId] === undefined) {
          const userData = await getUserData(message.secondId);
          if (userData.unsuccess) {
            ws.emit('message', {success: false, err: {code: 404, text: 'user 2 not found'}});
            return;
          }
          userDataCache[message.secondId] = userData;
        }
        const last_message = {
          sender_id: -1,
          pics: [sessionTokens[message.firstId].img, userDataCache[message.secondId].img],
          names: [sessionTokens[message.firstId].name, userDataCache[message.secondId].name],
          date: Date.now(),
          text_preview: message.text.substr(0, 100)
        }
        if (message.firstId > message.secondId) {
          last_message.pics.reverse();
          last_message.names.reverse();
        }
        if (chat === null) {
          chat = new Chat({users, last_message});
        } else {
          chat.set({last_message});
        }
        const newMessage = new Message({
          chat: chat.id,
          from: -1,
          to: -1,
          text: message.text,
          link: message.link,
          seenBy: {
            [firstId]: false,
            [secondId]: false
          }
        });
        for (let id of users)
          if (usersOfThisWorker[id] !== undefined)
            usersOfThisWorker[id].emit('message', {
              success: true,
              newMessage: true,
              chat: chat.id,
              companionId: -1,
              from: 'system',
              text: message.text,
              date: Date.now()
            });
        await newMessage.save();
        await chat.save();
      } else {
        ws.emit('message', {success: false, err: {code: 406, text: 'wrong request'}});
      }
    });
    ws.on('close', () => {
      // do stuff
    });
  });
}
