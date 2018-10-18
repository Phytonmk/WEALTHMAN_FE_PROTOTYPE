const configs = require('../configs')
const admin = configs.adminAddress
const Web3 = require('web3')
const web3 = new Web3(new Web3.providers.HttpProvider(configs.web3httpProvider))

const getNonce = () => new Promise((resolve, reject) => {
    web3.eth.getTransactionCount(admin, (e, res) => e?reject(e):resolve(res))
  })
const getGasPrice = () => new Promise((resolve, reject) => {
    web3.eth.getGasPrice((e, res) => e?reject(e):resolve(res))
  })
const getGasLimit = (data, to, from) => new Promise((resolve, reject) => {
    web3.eth.estimateGas(to ? {data, to, from} : {data, from}, (e, res) => e?reject(e):resolve(res))
  })

module.exports = { getNonce, getGasPrice, getGasLimit }