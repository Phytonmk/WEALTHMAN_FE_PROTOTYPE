const Request = require('../../models/Request')
const Portfolio = require('../../models/Portfolio')
const Order = require('../../models/Order')
const Stock = require('../../models/Stock')
const Transaction = require('../../models/Transaction')

const configs = require('../../configs')

const checkBalance = require('../../trading/wealthman_check_balance')

module.exports = () => new Promise(async (resolve, reject) => {
  const requests = await Request.find({status: 'waiting for deposit'})
  const smartContracts = []
  let i = 0
  for (request of requests) {
    const portfolio = await Portfolio.findOne({request: request._id})
    if (portfolio !== null && portfolio.smart_contract)
      smartContracts.push({
        address: portfolio.smart_contract,
        portfolio: portfolio._id,
        request: request._id,
        currencies: portfolio.currencies
      })
  }
  for (let smartContract of smartContracts) {
    // console.log(`Checking ${smartContract.address} for deposit...`)
    const deposit = await checkBalance(smartContract.address).catch(console.log)
    // if (deposit || !configs.productionMode)
    //   console.log('deposited')
    // else
    //   console.log('no deposit')
    if (deposit/* || !configs.productionMode*/) {
      const request = await Request.findById(smartContract.request)
      request.set({status: 'buying tokens'})
      // const transaction = new Transaction({
      //   contract: deployment.address,
      //   type: 'Deposit',
      //   receiver: {
      //     name: 'Contract',
      //     type: 'contract',
      //   },
      // })
      await request.save()
      // await transaction.save()
      for (let token of smartContract.currencies) {
        const order = new Order({
          token_name: token.currency,
          whole_eth_amount: request.value,
          percent: token.percent,
          contract_address: smartContract.address,
          rebuild: false,
          request: request._id
        })
        await order.save()
      }
    }
  }
  resolve()
})