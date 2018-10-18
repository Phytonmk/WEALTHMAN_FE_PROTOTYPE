const configs = require('../configs')
const Web3 = require('web3')
const web3 = new Web3(new Web3.providers.HttpProvider(configs.web3httpProvider))
const erc20Abi = require('./check-tokens-presence-abi.js')
const checkOneToken = (contractAddress, token) => new Promise((resolve, reject) => {
  const contract = new web3.eth.Contract(erc20Abi, token);
  console.log(`Checking if token ${token} on ${contractAddress}`)
  const functionAbi = contract.methods.balanceOf(contractAddress).call().then((receipt) => {
    console.log(`receipt: ${receipt}`)
    resolve(receipt != 0);
  }).catch(reject);
})
module.exports = (address, tokens) => new Promise(async (resolve, reject) => {
  try {
    let presents = false
    console.log(tokens)
    for (let token of tokens) {
      const thisTokenPresents = configs.productionMode ? await checkOneToken(address, token).catch(reject) : true
      if (thisTokenPresents) {
        presents = true
        break
      }
    }
    resolve(presents)
  } catch (e) {
    reject(e)
  }
});
