const Portfolio = require('../models/Portfolio')
const configs = require('../configs')
const Web3 = require('web3')
const web3 = new Web3(new Web3.providers.HttpProvider(configs.web3httpProvider))
const Tx = require('ethereumjs-tx')
const portfolioAbi = require('./contract-abi.js')
const privateKey = configs.privateKey
const admin = configs.adminAddress
module.exports = (portfolio_adress, tokens) => new Promise((resolve, reject) => {
  var contract = new web3.eth.Contract(portfolioAbi, portfolio_adress)
  var functionAbi =  contract.methods.transferAllToEth(tokens).encodeABI()
  const getNonce = () => {
    return new Promise((resolve, reject) => {
      web3.eth.getTransactionCount(admin, (error, result) => {
       console.log(result)
        if(error) reject(error)
        resolve(result)
      })
    })
  }
  const getGasPrice = () => {
    return new Promise((resolve, reject) => {
      web3.eth.getGasPrice((error, result) => {
        if(error) reject(error)
          resolve(result)
      })
    })
  }
  const getGasLimit = (functionAbi) => {
    return new Promise((resolve, reject) => {
      web3.eth.estimateGas({data:functionAbi},(error, result) => {
        if(error) reject(error);
        resolve(result);
      })
    })
  } 
  const sendRawTransaction = (rawTx) => {
    const tx = new Tx(rawTx)
    const privateKeyBuffer = Buffer.from(privateKey, 'hex')
    tx.sign(privateKeyBuffer)
    const serializedTx = tx.serialize()
    web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'), function(err, hash) {
      if (err)
        reject(err)
      else
        resolve(hash)
    })
  }

  Promise.all([getNonce(), getGasPrice()/*, getGasLimit(functionAbi)*/])
    .then(values => {
      const rawTx = {
        to: portfolio_adress,
        gasLimit: 60 * 1000/*web3.utils.toHex(values[2])*/,
        nonce: web3.utils.toHex(values[0]),
        gasPrice: web3.utils.toHex(Number(values[1])),
        data: functionAbi
      }
      console.log(rawTx)
      return(rawTx)
    })
    .then(sendRawTransaction)
    .catch(e => console.log(e))
})
