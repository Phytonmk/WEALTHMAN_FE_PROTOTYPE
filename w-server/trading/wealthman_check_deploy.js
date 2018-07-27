var config = require('./connection_settings')
var web3 = config.web3
module.exports = (hash) => new Promise((resolve, reject) => {
  web3.eth.getTransactionReceipt(hash)
    .then((receipt) => {
      console.log(receipt);
      // console.log(`checked`, receipt);
      if (receipt !== null) {
        if (receipt.status)
          resolve({status: 'deployed', address: receipt.contractAddress});
        else
          resolve({status: 'faild'});
      } else {
        resolve({status: 'pending'});
      }
    })
    .catch(reject);
});
