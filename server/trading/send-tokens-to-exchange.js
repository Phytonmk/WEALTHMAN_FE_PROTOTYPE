const gateway = require('../helpers/blockchain-gateway')
const portfolioAbi = require('./contract-abi.js')
module.exports = (address, tokens) => new Promise (async (resolve, reject) => {
  await gateway(portfolioAbi, address, 'transferAllToEth', tokens)
})
