const Web3 = require('web3')
const Tx = require('ethereumjs-tx')
const configs = require('../configs')
const bytecode = require('./bytecode.js')
const portfolioAbi = require('./contract-abi.js')
const web3 = new Web3(new Web3.providers.HttpProvider(configs.web3httpProvider))
const privateKey = configs.privateKey
const _exchanger = configs.exchangerAddress
const admin = configs.adminAddress
const _admin = admin;
module.exports = (contractData) => new Promise((mainResolve, reject) => {
  console.log('!!!!!!!!!!!!!\nWeb3 Provider: ' + configs.web3httpProvider + '\n!!!!!!!!!!!!!')
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
  console.log(contract)
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
  const getGasLimit = (functionAbi) => {
    return new Promise((resolve, reject) => {
      web3.eth.estimateGas({data:functionAbi},(error, result) => {
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
    let Hash;
    web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'), function(err, hash) {
      if (err) {
        reject(err);
      } else {
        mainResolve({success: true, hash});
      }
    });
  }


    Promise.all([getNonce(), getGasPrice()/*, getGasLimit(deploy)*/])
    .then(values => {
     const rawTx = {
       from: admin,
       gasLimit: 36 * 1000/*web3.utils.toHex(values[2])*/,
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
