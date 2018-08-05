let product = false

if (process.argv.includes('--production') ||
    process.argv.includes('--prod') ||
    process.argv.includes('--product'))
  product = true

const 
  productConfigs = require('./prod.config'),
  devConfigs = require('./dev.config'),
  commonConfigs = require('./common.configs')

if (product)
  module.exports = Object.assign(
    commonConfigs,
    productConfigs,
    {productionMode: true})
else
  module.exports = Object.assign(
    commonConfigs,
    devConfigs)