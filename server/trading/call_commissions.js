const Portfolio = require('../models/Portfolio')
const Web3 = require('web3')
const Tx = require('ethereumjs-tx')
const configs = require('../configs')
const portfolioAbi = require('./portfolio_abi.js')
const privateKey = configs.privateKey
const admin = configs.adminAddress
module.exports = (address, tokens, values) => new Promise ((resolve, reject) => {
  var contract = new web3.eth.Contract(portfolioAbi, address)
  var functionAbi =  contract.methods.calculateRewards(tokens, values).encodeABI()
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

  Promise.all([getNonce(), getGasPrice(), getGasLimit(functionAbi)])
    .then(values => {
      const rawTx = {
        to: portfolio_adress,
        gasLimit: web3.utils.toHex(values[2]),
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
