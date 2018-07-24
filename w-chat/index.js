global.chatsWSports = [{port: 2906, connected: []}];
global.maxChatsOnPort = 32;

console.log('\n\n   ╔══Waking chats server up═╗');
const express = require('express');
const mongoose = require('mongoose');
const port = 2905;
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
fs.readdirSync(__dirname + '/api/').forEach((file) => {
    require(`${__dirname}/api/${file.substr(0, file.indexOf('.'))}`)(app);
  });
app.listen(port, () => console.log(`   ║Started on localhost:${port}║`))