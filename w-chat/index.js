const apiPort = 2905;
// global.chatsWSports = [{port: 2906, connected: []}];
// global.maxChatsOnPort = 32;

/*
  in App.jsx
  
          <Route path="/chats" component={ChatPage}/>
          <Route path="/chat/:userId" component={ChatPage}/>

*/

console.log('\n\n   ╔══Waking chats server up═╗');
const fs = require('fs');
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
console.log('   ║  All modules required   ║');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use((req, res, next) => {
  res.append("Access-Control-Allow-Origin", "*");
  // res.setHeader("Access-Control-Allow-Credentials", "true");
  // res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.append("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, accessToken");
  next();
})
app.use((req, res, next) => {
  console.log(`request to ${req.originalUrl}: ${JSON.stringify(req.body)}`);
  next();
});
mongoose.connect('mongodb://lev:levlev@95.213.199.125:27017/test', {useNewUrlParser: true}, (err) => {
  if (err)
    console.log(err);
  else
    console.log('   ╚═════mongo connected═════╝\n\n')
});
console.log('   ║    Almost  started...   ║');
require(__dirname + '/ws.js')(2906)
fs.readdirSync(__dirname + '/api/').forEach((file) => {
    require(`${__dirname}/api/${file.substr(0, file.indexOf('.'))}`)(app);
  });
app.listen(apiPort, () => console.log(`   ║Started on localhost:${apiPort}║`))