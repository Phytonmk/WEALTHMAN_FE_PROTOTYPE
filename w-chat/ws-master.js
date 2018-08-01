const configs = require('./configs')
const cluster = require('cluster')
const mongoose = require('mongoose')
const numCPUs = require('os').cpus().length
if (cluster.isMaster) {
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork()
  }
  let port = configs.minWsPort
  cluster.on('online', (worker) => {
    console.log(`Worker ${worker.process.pid} started`)
    worker.send(port)
    port++
  })
  cluster.on('exit', (worker, code, signal) => {
    console.log(`╍ worker ${worker.process.pid} died`)
  })
} else {
  const init = require('./ws-worker')
  process.on('message', (msg) => {
    console.log(msg)
  })
}