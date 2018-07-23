var Web3 = require('web3')
var web3 = new  Web3(new Web3.providers.HttpProvider('https://rinkeby.infura.io/v3/5c95df77f8994b7bb81f9d7dcf1dc252'))
const Tx = require('ethereumjs-tx')
// -----------------------------------V сюда передаешь адрес портфеля
module.exports = (portfolio_adress) => new Promise((resolve, reject) => {
  var portfolioAbi = require('./portfolio_abi.js');
  const privateKey = Buffer.from('4a131e9f1843d982cd3a4b83749b46bcd2435b5e19429109a16d2f144bd5d948','hex')
  const admin = '0x6e3F0CC77BF9A846e5FD4B07706bf8ca95493d4D';
  var contract = new web3.eth.Contract(portfolioAbi, portfolio_adress);
  var functionAbi =  contract.methods.wasDeposit().call().then(function(receipt){
    resolve(receipt);
  })
});
