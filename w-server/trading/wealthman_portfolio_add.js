const Web3 = require('web3');
const Tx = require('ethereumjs-tx');
const exchangerAbi = require('./exchanger_abi.js');
const web3 = new  Web3(new Web3.providers.HttpProvider('https://rinkeby.infura.io/v3/5c95df77f8994b7bb81f9d7dcf1dc252'))
const admin = "0x6e3F0CC77BF9A846e5FD4B07706bf8ca95493d4D";
const exchanger_adress = "0x2318fdfaa7182875e9278cd3ffe01435afe27726";
// сюда пихаешь VVV адресс задеплоенного портфеля
module.exports = (portfolio_adress) => new Promise((resolve, reject) => {
  var exchanger_contract = new web3.eth.Contract(exchangerAbi, exchanger_adress);
  exchanger_contract.methods.isPortfolio(portfolio_adress).call().then(function(receipt){
  	if (receipt === false) {
      var contractFunction =	exchanger_contract.methods.addPortfolio(portfolio_adress)
      var portfolio_functionAbi = contractFunction.encodeABI();
      const getNonce = () => {
        return new Promise((resolve, reject) => {
          web3.eth.getTransactionCount(admin, (error, result) => {
            if(error) reject(error);
            resolve(result);
          })
        })
      }
      const getGasPrice = () => {
        return new Promise((resolve, reject) => {
          web3.eth.getGasPrice((error, result) => {
            if(error) reject(error);
            resolve(result);
          })
        })
      }

      const sendRawTransaction = (rawTx) => {
        const privateKey = "4a131e9f1843d982cd3a4b83749b46bcd2435b5e19429109a16d2f144bd5d948";
        const tx = new Tx(rawTx);
        const privateKeyBuffer = Buffer.from(privateKey, 'hex');
        tx.sign(privateKeyBuffer);
        const serializedTx = tx.serialize();
        web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'), function(err, hash) {
          console.log('Error:', err);
          console.log('Hash:', hash);
        });
      }

      let i = 0;
      Promise.all([getNonce(), getGasPrice()])
        .then(values => {
          const rawTx = {
            to: exchanger_adress,
            gasLimit: web3.utils.toHex(1000000),
            nonce: web3.utils.toHex(values[0]),
            gasPrice: web3.utils.toHex(Number(values[1])),
            data: portfolio_functionAbi
          };
          i++
          if (i >= 2)
            resolve();
          console.log(rawTx);
          return(rawTx);
        })
        .then(sendRawTransaction)
        .catch(e => console.log(e))
    }
   })
});