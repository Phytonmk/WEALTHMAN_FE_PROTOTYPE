const configs = require('../configs')

const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload')

module.exports = (app) => {
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(bodyParser.json())
  app.use(cookieParser())
  app.use(fileUpload())
  app.use('/api/img', express.static('img'))
  app.use((req, res, next) => {
    if (configs.productionMode) {
      res.append("Access-Control-Allow-Origin", "*");
 //     res.append("Access-Control-Allow-Origin", "http://platform.wealthman.io, http://localhost:1234");
      res.append("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, accessToken");
    } else {
      res.append("Access-Control-Allow-Origin", "*");
      res.append("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, accessToken");
    }
    next();
  })
  app.use((req, res, next) => {
    console.log(`request to ${req.originalUrl}: ${JSON.stringify(req.body)}`);
    next();
  });
}