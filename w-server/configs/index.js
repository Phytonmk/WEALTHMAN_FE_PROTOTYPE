let product = false

if (process.argv.includes('--production') ||
    process.argv.includes('--prod') ||
    process.argv.includes('--product'))
  product = true

if (product)
  module.exports = Object.assign(
    require('./common.configs'),
    require('./prod.config'),
    {productionMode: true}
    )
else
  module.exports = Object.assign(
    require('./common.configs'),
    require('./dev.config')
  )