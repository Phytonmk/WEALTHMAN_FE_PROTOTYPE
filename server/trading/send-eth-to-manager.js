const gateway = require('../helpers/blockchain-gateway')
const portfolioAbi = require('./contract-abi.js')
module.exports = (address, value) => new Promise (async (resolve, reject) => {
  const contract = new web3.eth.Contract(portfolioAbi, address)
  await gateway(portfolioAbi, address, 'manageReward', utils.toWei(value.toString(), 'ether'))
})
