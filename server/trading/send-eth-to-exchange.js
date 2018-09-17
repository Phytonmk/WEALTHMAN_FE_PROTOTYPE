const Portfolio = require('../models/Portfolio');
const configs = require('../configs')
const portfolioAbi = require('./contract-abi.js');
const Web3 = require('web3')
const web3 = new Web3(new Web3.providers.HttpProvider(configs.web3httpProvider))
const Tx = require('ethereumjs-tx')
const privateKey = configs.privateKey
const admin = configs.adminAddress;
module.exports = (portfolio_adress) => new Promise((resolve, reject) => {
  var contract = new web3.eth.Contract(portfolioAbi, portfolio_adress);
  var functionAbi =  contract.methods.transferEth().encodeABI();
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
        if(error)
          reject(error)
        else
          resolve(result);
      })
    })
  }
  const getGasLimit = (functionAbi) => {
    return new Promise((resolve, reject) => {
      web3.eth.estimateGas({data:functionAbi},(error, result) => {
        console.log(error, result)
        if(error)
          reject(error);
        else
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

  Promise.all([getNonce(), getGasPrice()/*, getGasLimit(functionAbi)*/])
    .then(values => {
      console.log(`VALUES:\n`, values, '\n')
      const rawTx = {
        to: portfolio_adress,
        gasLimit: 36 * 1000/*web3.utils.toHex(values[2])*/,
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
