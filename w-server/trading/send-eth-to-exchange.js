const Portfolio = require('../models/Portfolio');
const configs = require('../configss')
const portfolioAbi = require('./portfolio_abi.js');
const Web3 = require('web3')
const web3 = new Web3(new Web3.providers.HttpProvider(configss.web3httpProvider))
const Tx = configs.tx
const privateKey = configs.privatekey
const admin = configs.admin_adress;
module.exports = (portfolio_adress) => new Promise((resolve, reject) => {
  var contract = new web3.eth.Contract(portfolioAbi, portfolio_adress);
  var functionAbi =  contract.methods.transferEth().encodeABI();
  const getNonce = () => {
    return new Promise((resolve, reject) => {
      web3.eth.getTransactionCount(admin, (error, result) => {
       console.log(result)
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
    const tx = new Tx(rawTx);
    const privateKeyBuffer = Buffer.from(privateKey, 'hex');
    tx.sign(privateKeyBuffer);
    const serializedTx = tx.serialize();
    web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'), function(err, hash) {
      if (err)
        reject(err)
      else
        resolve(hash)
      // console.log('Error:', err);
      // console.log('Hash:', hash);
    });
  }

  Promise.all([getNonce(), getGasPrice()])
    .then(values => {
      const rawTx = {
        to: portfolio_adress,
        gasLimit: web3.utils.toHex(4000000),
        nonce: web3.utils.toHex(values[0]),
        gasPrice: web3.utils.toHex(Number(values[1])),
        data: functionAbi
      };
      console.log(rawTx);
      return(rawTx);
    })
    .then(sendRawTransaction)
    .catch(e => console.log(e))
})
