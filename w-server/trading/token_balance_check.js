const configs = require('../configs')
const Web3 = require('web3')
const web3 = new Web3(new Web3.providers.HttpProvider(configs.web3httpProvider))
module.exports = (address, tokens) => new Promise((resolve, reject) => {
  try {
    tokens.forEach(function(item, i, arr) {
      const erc20Abi = require('./erc20_abi.js');
      const contract = new web3.eth.Contract(erc20Abi, item);
      const functionAbi = contract.methods.balanceOf(address).call().then((receipt) => {
        resolve(receipt != 0);
      }).catch(reject);
    })
  } catch (e) {
    reject(e)
  }
});
