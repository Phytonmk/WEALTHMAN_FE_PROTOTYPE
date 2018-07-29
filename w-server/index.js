const cluster = require('cluster')

const numCPUs = require('os').cpus().length;

const configs = require('./configs')

const addSpaces = (str) => {
  while (str.length < 36)
    str += ' '
  return str
}

if (cluster.isMaster) {
  console.log('\n\n')
  console.log('  ╔════════════════════════════════════╗')
  if (configs.productionMode)
    console.log('  ║           !!! WARNING !!!          ║')
  console.log(`  ║Server confgirurated as: ${configs.productionMode ? 'production' : 'developer '} ║`)
  console.log('  ╠════════════════════════════════════╣')
  console.log('  ║' + addSpaces(`Configurated port: ${configs.workerPort}`) + '║')
  console.log('  ║' + addSpaces(`Master ${process.pid} is running`) + '║')
  console.log('  ║' + addSpaces(`numCPUs: ${numCPUs}`) + '║')

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork()
  }
  console.log('  ╠════════════════════════════════════╣')
  console.log('  ║Deploying workers...                ║')

  let onlineWorkers = 0
  cluster.on('online', (worker) => {
    onlineWorkers++
    console.log('  ║' + addSpaces(`${onlineWorkers}. Worker ${worker.process.pid} started`) + '║')
    if (onlineWorkers >= numCPUs)
      console.log('  ╠════════════════════════════════════╣')
  })
  let deployedWorkers = 0
  cluster.on('message', (worker, msg) => {
    if (msg.workerDeployed) {
      deployedWorkers++
      console.log('  ║' + addSpaces(`${deployedWorkers}. Worker ${msg.pid} deployed on port ${msg.port}`) + '║')
      if (deployedWorkers >= numCPUs)
        console.log('  ╚════════════════════════════════════╝')
    }
  })
  cluster.on('exit', (worker, code, signal) => {
    console.log(`╍ worker ${worker.process.pid} died`)
  })
} else {
  require('./worker')
}