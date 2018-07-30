
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
    res.append("Access-Control-Allow-Origin", "http://platform.wealthman.io");
    res.append("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, accessToken");
    next();
  })
  app.use((req, res, next) => {
    console.log(`request to ${req.originalUrl}: ${JSON.stringify(req.body)}`);
    next();
  });
}