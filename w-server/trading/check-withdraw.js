const configs = require('../configs')
const Web3 = require('web3')
const web3 = new Web3(new Web3.providers.HttpProvider(configs.web3httpProvider))
module.exports = (hash) => new Promise((resolve, reject) => {
  web3.eth.getTransactionReceipt(hash)
    .then((receipt) => {
      console.log(receipt);
      if (receipt !== null) {
        if (receipt.status)
          resolve(receipt.blockNumber);
        else
          resolve({status: 'failed'});
      } else {
        resolve({status: 'pending'});
      }
    })
    .catch(reject);
});
