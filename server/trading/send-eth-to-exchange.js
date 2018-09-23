const portfolioAbi = require('./contract-abi.js');
const gateway = require('../helpers/blockchain-gateway')
module.exports = (address) => new Promise(async (resolve, reject) => {
  await gateway(portfolioAbi, address, 'transferEth')
  resolve()
})
