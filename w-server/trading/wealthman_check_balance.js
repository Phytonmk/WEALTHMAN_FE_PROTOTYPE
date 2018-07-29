const configs = require('../configs')
const Web3 = require('web3')
const web3 = new Web3.providers.HttpProvider(configs.web3httpProvider)
module.exports = (portfolio_adress) => new Promise((resolve, reject) => {
  try {
    var portfolioAbi = require('./portfolio_abi.js');
    var contract = new web3.eth.Contract(portfolioAbi, portfolio_adress);
    var functionAbi =  contract.methods.wasDeposit().call().then(function(receipt){
      resolve(receipt);
    }).catch(reject);
  } catch (e) {
    reject(e)
  }
});
