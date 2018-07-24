var Web3 = require('web3')
const Tx = require('ethereumjs-tx')
var web3 = new  Web3(new Web3.providers.HttpProvider('https://rinkeby.infura.io/v3/5c95df77f8994b7bb81f9d7dcf1dc252'))
var portfolioAbi = require('./portfolio_abi.js');
var bytecode = require('./bytecode.js')
const privateKey = Buffer.from('4a131e9f1843d982cd3a4b83749b46bcd2435b5e19429109a16d2f144bd5d948','hex')
const _exchanger = '0x2318fdfaa7182875e9278cd3ffe01435afe27726' ;
const admin = '0x6e3F0CC77BF9A846e5FD4B07706bf8ca95493d4D';
const _admin = admin;
module.exports = (contractData) => new Promise((mainResolve, reject) => {
    let {
      _owner,
      _manager,
      _tradesMaxCount,
      _managmentFee,
      _performanceFee,
      _frontFee,
      _exitFee,
      _endTime,
      _mngPayoutPeriod,
      _prfPayoutPeriod
    } = contractData;
    console.log(contractData)
    if (!_tradesMaxCount)
      _tradesMaxCount = 0;
    if (!_endTime)
      _endTime = 1590710400000;
    if (!_mngPayoutPeriod)
      _mngPayoutPeriod = 1590710400000;
    if (!_prfPayoutPeriod)
      _prfPayoutPeriod = 1590710400000;


    var contract = new web3.eth.Contract(portfolioAbi);
    var deploy = contract.deploy({
      data: bytecode,
      arguments:[_owner,_manager,_exchanger,_admin, _endTime,_tradesMaxCount,_managmentFee,_performanceFee,_frontFee,_exitFee,_mngPayoutPeriod,_prfPayoutPeriod]
    }).encodeABI()
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
      const privateKey = "4a131e9f1843d982cd3a4b83749b46bcd2435b5e19429109a16d2f144bd5d948";
      const tx = new Tx(rawTx);
      const privateKeyBuffer = Buffer.from(privateKey, 'hex');
      tx.sign(privateKeyBuffer);
      const serializedTx = tx.serialize();
      let Hash;
      web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'), function(err, hash) {
        if (err) {
          reject(err);
        } else {
          mainResolve({success: true, hash});
        }
      });
    }


      Promise.all([getNonce(), getGasPrice()])
      .then(values => {
       const rawTx = {
         from: admin,
         gasLimit: web3.utils.toHex(4000000),
         nonce: web3.utils.toHex(values[0]),
         gasPrice: web3.utils.toHex(Number(values[1])),
         data: deploy
       };
       console.log(rawTx);
       return(rawTx);
     })
      .then(sendRawTransaction)
      .catch(e => console.log(e))

  });