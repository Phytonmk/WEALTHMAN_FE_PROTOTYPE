var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider('https://rinkeby.infura.io/v3/5c95df77f8994b7bb81f9d7dcf1dc252'))
module.exports = (hash) => new Promise((resolve, reject) => {
  web3.eth.getTransactionReceipt(hash)
    .then((receipt) => {
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