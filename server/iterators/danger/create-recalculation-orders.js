const Request = require('../../models/Request')
const Portfolio = require('../../models/Portfolio')
const Order = require('../../models/Order')
const Stock = require('../../models/Stock')
const TelegramAcception = require('../../models/TelegramAcception')
const TGlogger = require('../../helpers/tg-testing-loger')

const checkBalance = require('../../trading/check-tokens-presence')

module.exports = () => new Promise(async (resolve, reject) => {
  const requests = await Request.find({status: 'recalculation'})
  const smartContracts = []
  let i = 0
  for (request of requests) {
    const portfolio = await Portfolio.findOne({request: request._id, state: 'active'})
    await TGlogger(`Created buying orders for request #${request._id}`)
    if (portfolio !== null && portfolio.smart_contract)
      smartContracts.push({
        address: portfolio.smart_contract,
        portfolio: portfolio._id,
        request: request._id,
        currencies: portfolio.currencies
      })
  }
  for (let smartContract of smartContracts) {
    const request = await Request.findById(smartContract.request)
    for (let token of smartContract.currencies) {
      const order = new Order({
        token_name: token.currency,
        whole_eth_amount: request.value,
        request: smartContract.request,
        related_portfolio: smartContract.portfolio,
        percent: token.percent,
        contract_address: smartContract.address,
        rebuild: false
      })
      await order.save()
    }
    await TelegramAcception.findAndRemove({asked_request: request._id})
    request.set({status: 'sending old tokens', exchange_withdraw_allowed: false})
    await request.save()
  }
  resolve()
})