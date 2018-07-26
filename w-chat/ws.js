const WebSocket = require('ws');
const Message = require('./models/Message');
const Chat = require('./models/Chat');
const User = require('./models/User');
const AccessToken = require('./models/accessToken');


module.exports = (port) => {
  const wss = new WebSocket.Server({
    port,
    perMessageDeflate: {
      zlibDeflateOptions: { // See zlib defaults.
        chunkSize: 1024,
        memLevel: 7,
        level: 3,
      },
      zlibInflateOptions: {
        chunkSize: 10 * 1024
      },
      // Other options settable:
      clientNoContextTakeover: true, // Defaults to negotiated value.
      serverNoContextTakeover: true, // Defaults to negotiated value.
      clientMaxWindowBits: 10,       // Defaults to negotiated value.
      serverMaxWindowBits: 10,       // Defaults to negotiated value.
      // Below options specified as default values.
      concurrencyLimit: 10,          // Limits zlib concurrency for perf.
      threshold: 1024,               // Size (in bytes) below which messages
                                     // should not be compressed.
    }
  });

  const usersOfThisWorker = [];

  wss.on('connection', (ws) => {
    ws.on('message', async (message) => {
      const token = await Token.findOne({token: message.accessToken});
      if (token === null) {
        ws.send({success: false, err: '403, not auth'});
        return;
      }
      const sender = await User.findOne({user: token.user});
      if (sender === null) {
        ws.send({success: false, err: '403, not auth'});
        return;
      }
      const reciever = await User.findOne({user: message.to});
      if (reciever === null) {
        ws.send({success: false, err: '404, another user not found'});
        return;
      }
      const ids = [sender.id, reciever.id];
      ids.sort();
      const chat = await Chats.findOne({_id: message.chat, users: ids});
      if (chat === null) {
        ws.send({success: false, err: '500, created chat not found'});
        return;
      }
      // if (ws.chatId === undefined) {
      //   if (chats[chat._id] === undefined) {
      //     chats[chat._id] = [{id: sender.id, ws}];
      //   } else if (chats[chat._id].length === 1 && chats[chat._id][0].id !== sender.id) {
      //     chats[chat._id].push({id: sender.id, ws});
      //     chats[chat._id].sort();
      //   }
      //   ws.chatId = chat._id;
        ws.send({success: true});
      // } else if (message.text) {
        for (let userInChat of chats[ws.chatId]) {
          userInChat.ws.send({message: {
            text: message.text,
            date: new Date().getTime();
            from: sender.id
          }});
        }
        chat.set({
          last_message: {
            sender_name: '--', // update it!
            date: new Date(),
            text_preview: message.text.substr(0, 100)
          }
        });
        const newMessage = new Message({
          date: new Date(),
          chat: chat._id,
          from: sender.id,
          to: reciever.id,
          text: message.text
        });
        await chat.save();
        await newMessage.save();
      // } else {
      //   ws.send({success: false, err: '500, not handeled msg, maybe message text is missing'});
      // }
    });
    ws.on('close', () => {
      // do stuff
    });
    ws.send('server is ready');
  });
}