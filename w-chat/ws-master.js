const configs = require('./configs')
const cluster = require('cluster')
const mongoose = require('mongoose')
const numCPUs = require('os').cpus().length


if (cluster.isMaster) {
  const workers = []
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork()
  }
  let port = configs.minWsPort
  cluster.on('online', (worker) => {
    console.log(`  Worker ${worker.process.pid} started`)
    workers.push({
      port,
      connections: 0
    })
    worker.send({port})
    port++
  })
  cluster.on('exit', (worker, code, signal) => {
    console.log(`╍ worker ${worker.process.pid} died`)
  })
  process.on('message', (msg) => {
    if (msg.type === 'worker-connections')
      workers.find(worker => worker.port === msg.port).connections = msg.connections
  })
  let masterReport = () => {
    process.send({
      type: 'workers',
      workers
    })
  }
  masterReport()
  setInterval(masterReport, 1000 * 15)
} else {
  const init = require('./ws-worker')
  process.on('message', (msg) => {
    if (msg.port)
      init(msg.port)
  })
}
