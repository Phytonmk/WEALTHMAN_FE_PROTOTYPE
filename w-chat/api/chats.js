const Message = require('../models/Message');
const User = require('../models/User');
const Chat = require('../models/Chat');
const Token = require('../models/accessToken');

const getUserData = require('../getUserData');

module.exports = (app) => {
  app.get('/chats-api/chats-list', async (req, res, next) => {
    const token = await Token.findOne({token: req.headers.accesstoken});
    if (token === null) {
      res.status(403);
      res.end('');
      return;
    }
    const user = await User.findOne({_id: token.user});
    if (user === null) {
      res.status(403);
      res.end('');
      return;
    }
    const chats = await Chat.find({users: {$in: user._id}});
    const results = [];
    for (let chat of chats) {
      chat = chat.toObject();
      console.log({chat: chat._id, seenBy: {[user._id]: false}});
      chat.unread = await Message.countDocuments({chat: chat._id, [`seenBy.${user._id}`]: false});
      results.push(chat);
    }
    res.send(results);
    res.end();
  });
  app.get('/chats-api/messages', async (req, res, next) => {
    const token = await Token.findOne({token: req.headers.accesstoken});
    if (token === null) {
      res.status(403);
      res.end('');
      return;
    }
    const user = await User.findOne({_id: token.user});
    if (user === null) {
      res.status(403);
      res.end('');
      return;
    }
    const anotherUserData = await getUserData(req.query.chat);
    if (anotherUserData.unsuccess) {
      res.status(404);
      res.end();
      return;
    }
    const ids = user._id < req.query.chat ? [user._id, req.query.chat] : [req.query.chat, user._id];
    const chat = await Chat.findOne({users: ids});
    if (chat === null) {
      res.send({messages: [], chat: anotherUserData});
      return;
    }
    await Message.update({chat: chat._id, [`seenBy.${user._id}`]: false}, {[`seenBy.${user._id}`]: true});
    let messages = [];
    if (req.query.offsetDate !== undefined && req.query.offsetDate * 1 == req.query.offsetDate)
      messages = await Message.find({chat: chat._id, date: {$lte: new Date(req.query.offsetDate * 1)}}).limit(100);
    else
      messages = await Message.find({chat: chat._id}).limit(100);
    res.send({messages, chat: anotherUserData});
    res.end();
  });
  app.get('/chats-api/ws', async (req, res, next) => {
    let port;
    let minimalLoad = null;
    for (let worker of global.workersLoad) {
      if (minimalLoad === null || worker.conncetions < minimalLoad) {
        port = worker.port
        minimalLoad = worker.conncetions
      }
    }
    res.send({ws_port: port});
    res.end();
  });
}