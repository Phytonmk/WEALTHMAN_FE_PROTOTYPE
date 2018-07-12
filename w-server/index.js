const express = require('express');
const fs = require('fs');
const mongoose = require('mongoose');
const port = 8080;
const app = express();
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(fileUpload());
app.use('/api/img', express.static('img'));
app.use((req, res, next) => {
  res.append("Access-Control-Allow-Origin", "*");
  // res.setHeader("Access-Control-Allow-Credentials", "true");
  // res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.append("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, accessToken");
  next();
})
app.use((req, res, next) => {
  console.log(`request: ${JSON.stringify(req.body)}`);
  next();
});
mongoose.connect('mongodb://lev:levlev@95.213.199.125:27017/test', {useNewUrlParser: true}, (err) => {
  if (err)
    console.log(err);
  else
    console.log('mongo connected')
});
require('./routes/index.js')(app);
app.listen(port, () => console.log(`Started on localhost:${port}`))