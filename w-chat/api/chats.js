const Message = require('../models/Message');
const User = require('../models/User');
const AccessToken = require('../models/accessToken');

module.exports = (app) => {
  // app.post('/chats-api/message', (req, res, next) => {
  //   const token = await Token.findOne({token: req.body.accessToken});
  //   if (token === null) {
  //     res.status(403);
  //     res.end('');
  //     return;
  //   }
  //   const sender = await User.findOne({id: token.user});
  //   if (sender === null) {
  //     res.status(403);
  //     res.end('');
  //     return;
  //   }
  //   const reciever = await User.findOne({id: req.body.to});
  //   if (reciever === null) {
  //     res.status(404);
  //     res.end('');
  //     return;
  //   }
  //   const ids = [sender.id, reciever.id];
  //   ids.sort();
  //   let chat = await Chat.findOne({users: ids});
  //   const senderName = '-' // change in the past
  //   if (chat === null) {
  //     chat = new Chat({
  //       users: ids
  //       lastMessage: {
  //         senderName,
  //         date: new Date(),
  //         textPreview: req.body.text.substr(0, 100)
  //       }
  //     });
  //   } else {
  //     chat.set({
  //       lastMessage: {
  //         senderName,
  //         date: new Date(),
  //         textPreview: req.body.text.substr(0, 100),
  //       },
  //       newMessages: chat.newMessages + 1
  //     });
  //   }
  //   const message = new Message({
  //     chat: chat._id,
  //     from: sender.id,
  //     to: reciever.id,
  //     text: req.body.text
  //   });
  //   await chat.save();
  //   await message.save();
  //   res.status(200);
  //   res.end();
  // });
  app.post('/chats-api/chats-list', async (req, res, next) => {
    const token = await Token.findOne({token: req.body.accessToken});
    if (token === null) {
      res.status(403);
      res.end('');
      return;
    }
    const user = await User.findOne({id: token.user});
    if (user === null) {
      res.status(403);
      res.end('');
      return;
    }
    const anotherUser = await User.findOne({id: req.body.to});
    if (anotherUser === null) {
      res.status(404);
      res.end('');
      return;
    }
    const ids = [sender.id, anotherUser.id];
    ids.sort();
    const chats = await Chats.find({users: ids});
    res.send(chats);
    res.end();
  });
  app.post('/chats-api/get-messages', async (req, res, next) => {
    const token = await Token.findOne({token: req.body.accessToken});
    if (token === null) {
      res.status(403);
      res.end('');
      return;
    }
    const user = await User.findOne({id: token.user});
    if (user === null) {
      res.status(403);
      res.end('');
      return;
    }
    const chat = await Chats.findOne({_id: req.body.chat, users: { $in: [user.id] }});
    let messages = [];
    if (req.body.offsetDate !== undefined && req.body.offsetDate * 1 == req.body.offsetDate)
      messages = Message.find({chat: chat._id, date: {$gt: new Date(req.body.offsetDate)}}).limit(100);
    else
      messages = Message.find({chat: chat._id}).limit(100);
    res.send(messages);
    res.end();
  });
  app.get('/chats-api/ws', async (req, res, next) => {
    console.log(req);
    const token = await Token.findOne({token: req.headers.accessToken});
    if (token === null) {
      res.status(403);
      res.end('');
      return;
    }
    const sender = await User.findOne({id: token.user});
    if (sender === null) {
      res.status(403);
      res.end('');
      return;
    }
    const reciever = await User.findOne({id: req.query.to});
    if (reciever === null) {
      res.status(404);
      res.end('');
      return;
    }
    const ids = [sender.id, reciever.id];
    ids.sort();
    let chat = await Chat.findOne({users: ids});
    if (chat === null) {
      chat = new Chat({users: ids});
      await chat.save();
    }
    let lastContainer;
    let portSelected = false;
    let port;
    for (let portContainer of global.chatsWSports) {
      lastContainer = portContainer;
      if (portContainer.connected.length < global.maxChatsOnPort) {
        portContainer.connected.push(chat._id);
        port = portContainer.port;
        portSelected = true;
        break;
      }
    }
    if (!portSelected) {
      lastContainer.connected.push(chat._id);
      port = lastContainer.port;
    }
    chat.set({ws_port: port});
    await chat.save();
    res.send(port);
    res.end();
  });
}