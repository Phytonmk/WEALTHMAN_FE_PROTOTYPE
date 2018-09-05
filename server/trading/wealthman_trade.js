//Modules
const Portfolio = require('../models/Portfolio');
var Web3 = require('web3')
var web3 = new  Web3(new Web3.providers.HttpProvider('https://rinkeby.infura.io/v3/5c95df77f8994b7bb81f9d7dcf1dc252'))
const Tx = require('ethereumjs-tx')
var portfolioAbi = require('./portfolio_abi.js');
// Modules end
//Variables
const privateKey = Buffer.from('4a131e9f1843d982cd3a4b83749b46bcd2435b5e19429109a16d2f144bd5d948','hex')
const admin = '0x6e3F0CC77BF9A846e5FD4B07706bf8ca95493d4D';
module.exports = (portfolio_adress, request_id) => {
  var fromToken = []
  var toToken = []
  var amount = []
  //Variables end
  var contract = new web3.eth.Contract(portfolioAbi, portfolio_adress);
  const porfolio = Portfolio.findOne({ request: request_id, state: 'active' }, function(err,res){
  res.currencies.forEach(function(item, i, arr) {
     fromToken.push("0x0000000000000000000000000000000000000000")
     toToken.push("0x70be6b51cbfd678551511bb7532bb9f2da478794")
     amount.push(100)
   })
 });
  // ФУНКЦИЯ ПРИНИМАЕТ МАССИВ ИЗ АДРЕСОВ ТОКЕНОВ, КОТОРЫЕ МЫ МЕНЯЕМ fromToken
  // АДРЕСА ТОКЕНОВ, НА КОТОРЫЕ МЕНЯЕМ toToken
  // И ОБЪЕМ, КОТОРЫЙ МЕНЯЕМ amount
  var functionAbi =  contract.methods.trade(["0x0000000000000000000000000000000000000000"],["0x08b78e645b50fa3856bfd06d0c9f22b6e6df6e71"],[100]).encodeABI();
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
  const getGasLimit = (functionAbi) => {
    return new Promise((resolve, reject) => {
      web3.eth.estimateGas({data:functionAbi},(error, result) => {
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

  Promise.all([getNonce(), getGasPrice(), getGasLimit(functionAbi)])
    .then(values => {
      const rawTx = {
        to: portfolio_adress,
        gasLimit: web3.utils.toHex(values[2]),
        nonce: web3.utils.toHex(values[0]),
        gasPrice: web3.utils.toHex(Number(values[1])),
        data: functionAbi
      };
      console.log(rawTx);
      return(rawTx);
    })
    .then(sendRawTransaction)
    .catch(e => console.log(e))
}
