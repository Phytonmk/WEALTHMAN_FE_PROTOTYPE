const cluster = require('cluster')
const numCPUs = require('os').cpus().length;

const configs = require('./configs')
const express = require('express')
const mongoose = require('mongoose')
const https = require('https')
const http = require('http')
const fs =require('fs')

const app = express()
require('./helpers/middlewears')(app)


mongoose.connect(configs.mongoUrl, {useNewUrlParser: true}, (err) => {
  if (err)
    console.log(err)
});
require('./routes/index.js')(app)

const callback = () => {
  process.send({
    workerDeployed: true,
    id: cluster.worker.id,
    pid: process.pid,
    port: configs.workerPort
  })
}

if (fs.existsSync(__dirname + '/../ssl')) {
  https.createServer({
    key: fs.readFileSync(__dirname + '/../ssl/private.key'),
    cert: fs.readFileSync(__dirname + '/../ssl/public.crt'),
  }, app).listen(configs.workerPort, callback)
} else {
  http.createServer(app).listen(configs.workerPort, callback)
}

// app.listen(configs.workerPort, callback)