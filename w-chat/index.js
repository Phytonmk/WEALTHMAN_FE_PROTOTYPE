const configs = require('./configs')

console.log('  Waking chats server up');
const child_process = require('child_process')
const fs = require('fs');
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use((req, res, next) => {
  res.append("Access-Control-Allow-Origin", "*");
  res.append("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, accessToken");
  next();
})
app.use((req, res, next) => {
  console.log(`request to ${req.originalUrl}: ${JSON.stringify(req.body)}`);
  next();
});
mongoose.connect(configs.mongoUrl, {useNewUrlParser: true}, (err) => {
  if (err)
    console.log(err);
});
child_process.fork(__dirname + '/ws-master.js')
fs.readdirSync(__dirname + '/api/').forEach((file) => {
  require(`${__dirname}/api/${file.substr(0, file.indexOf('.'))}`)(app);
});
app.listen(configs.apiPort, () => console.log(`  Api started on localhost: ${configs.apiPort}`))