const Tx = require('ethereumjs-tx')
const configs = require('../configs')
const Web3 = require('web3')
const web3 = new Web3(new Web3.providers.HttpProvider(configs.web3httpProvider))
const privateKey = configs.privateKey
const admin = configs.adminAddress

const { getNonce, getGasPrice, getGasLimit } = require('./blockchain-gas-and-nonce-helper')

module.exports = (contractIO, contractAddress, method, ...attributes) => new Promise(async (resolve, reject) => {
  const contract = contractAddress ? new web3.eth.Contract(contractIO, contractAddress) : new web3.eth.Contract(contractIO)
  if (typeof contract.methods[method] !== 'function') {
    const methodsList = []
    for (let method in methodsList) {
      methodsList.push(method)
    }
    console.log(contractIO, contractAddress, method, ...attributes)
  } else {
    console.log(`Calling method ${method} of smart contract ${contractAddress}`)
  }
  const abi = contractAddress ? contract.methods[method](...attributes).encodeABI() : contract.deploy(...attributes).encodeABI() 
  const rawTransaction = {
    gasLimit: web3.utils.toHex(await getGasLimit(abi, contractAddress, admin).catch(reject)),
    nonce: web3.utils.toHex(await getNonce().catch(reject)),
    gasPrice: web3.utils.toHex(await getGasPrice().catch(reject)),
    data: abi
  }
  if (contractAddress)
    rawTransaction.to = contractAddress
  else
    rawTransaction.from = admin
  const tx = new Tx(rawTransaction)
  const privateKeyBuffer = Buffer.from(privateKey, 'hex')
  tx.sign(privateKeyBuffer)
  const serializedTx = tx.serialize()
  web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'), (err, hash) =>
    err ? reject(err) : resolve(hash))
})