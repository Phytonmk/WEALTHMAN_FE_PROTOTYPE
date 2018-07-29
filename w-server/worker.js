const cluster = require('cluster')
const numCPUs = require('os').cpus().length;

const configs = require('./configs')
const express = require('express')
const mongoose = require('mongoose')

const app = express()
const middlewears = require('./middlewears')
middlewears(app)

mongoose.connect(configs.mongoUrl, {useNewUrlParser: true}, (err) => {
  if (err)
    console.log(err)
});
require('./routes/index.js')(app)
require('./iterators/index.js')(app)

require('./trading/wealthman_exchanger_backend')

app.listen(configs.workerPort, () => {
  process.send({
    workerDeployed: true,
    id: cluster.worker.id,
    pid: process.pid,
    port: configs.workerPort
  })
})