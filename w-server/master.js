const cluster = require('cluster')

const numCPUs = require('os').cpus().length;

const configs = require('./configs')
const express = require('express')
const mongoose = require('mongoose')

const app = express()
const middlewears = require('./helpers/middlewears')
middlewears(app)

mongoose.connect(configs.mongoUrl, {useNewUrlParser: true}, (err) => {
  if (err)
    console.log(err)
});
require('./routes/index.js')(app)

const addSpaces = (str) => {
  while (str.length < 36)
    str += ' '
  return str
}

console.log('\n\n')
console.log('  ╔════════════════════════════════════╗')
if (configs.productionMode)
  console.log('  ║           !!! WARNING !!!          ║')
console.log(`  ║Server confgirurated as: ${configs.productionMode ? 'production' : 'developer '} ║`)
console.log('  ╠════════════════════════════════════╣')
console.log('  ║' + addSpaces(`Configurated port: ${configs.workerPort}`) + '║')
console.log('  ║' + addSpaces(`Master ${process.pid} is running`) + '║')
console.log('  ║' + addSpaces(`numCPUs: ${numCPUs}`) + '║')
console.log('  ╠════════════════════════════════════╣')
console.log('  ║Deploying iterators...              ║')
require('./iterators/index.js')(app)
console.log('  ║Deployed                            ║')
console.log('  ╠════════════════════════════════════╣')
require('./trading/wealthman_exchanger_backend')
console.log('  ║Excahnger backend deployed          ║')
for (let i = 0; i < numCPUs; i++) {
  cluster.fork()
}
console.log('  ╠════════════════════════════════════╣')
console.log('  ║Deploying workers...                ║')

let onlineWorkers = 0
cluster.on('online', (worker) => {
  onlineWorkers++
  console.log('  ║' + addSpaces(`${onlineWorkers}. Worker ${worker.process.pid} started`) + '║')
})
let deployedWorkers = 0
cluster.on('message', (worker, msg) => {
  if (msg.workerDeployed) {
    if (deployedWorkers === 0)
      console.log('  ╠════════════════════════════════════╣')
    deployedWorkers++
    console.log('  ║' + addSpaces(`${deployedWorkers}. Worker ${msg.pid} deployed on port ${msg.port}`) + '║')
    if (deployedWorkers >= numCPUs)
      console.log('  ╚════════════════════════════════════╝')
  }
})
cluster.on('exit', (worker, code, signal) => {
  console.log(`╍ worker ${worker.process.pid} died`)
})