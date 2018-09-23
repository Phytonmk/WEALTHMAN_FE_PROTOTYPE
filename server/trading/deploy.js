const gateway = require('../helpers/blockchain-gateway')
const configs = require('../configs')
const bytecode = require('./bytecode.js')
const portfolioAbi = require('./contract-abi.js')
const _exchanger = configs.exchangerAddress
const _admin = configs.adminAddress
module.exports = (contractData) => new Promise(async (resolve, reject) => {
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
  if (!_tradesMaxCount)
    _tradesMaxCount = 0;
  if (!_endTime)
    _endTime = 1590710400000;
  if (!_mngPayoutPeriod)
    _mngPayoutPeriod = 1590710400000;
  if (!_prfPayoutPeriod)
    _prfPayoutPeriod = 1590710400000;

  const hash = await gateway(portfolioAbi, null, 'deploy', {
    data: bytecode,
    arguments:[_owner,_manager,_exchanger,_admin, _endTime,_tradesMaxCount,_managmentFee,_performanceFee,_frontFee,_exitFee,_mngPayoutPeriod,_prfPayoutPeriod]
  }).catch(reject)
  resolve({success: true, hash})
});
