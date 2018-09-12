const configs = require('../../configs')
const Request = require('../../models/Request')
const Manager = require('../../models/Manager')
const Order = require('../../models/Order')
const Stock = require('../../models/Stock')
const Portfolio = require('../../models/Portfolio')
// const PaidCommisions = require('../../models/PaidCommisions')
const TGlogger = require('../../helpers/tg-testing-loger')
const calcComissions = require('../../helpers/calcComissions')
const Transaction = require('../../models/Transaction')

const callCommisionsPay = require('../../trading/call_commissions')

const ccxt = require('ccxt')

const exchanges = []
for (let exchange of configs.exchanges) {
  exchange.api = new ccxt[exchange.name]({
    apiKey: exchange.key,
    secret: exchange.secret,
    test: !configs.productionMode
  })
  exchanges.push(exchange)
}
const exchange = exchanges[0]

module.exports = () => new Promise(async (resolve, reject) => {
  if (true || (new Date()).getHours() === 12) {
    const requests = await Request.find({})
    for (let request of requests) {
      const daysFromDeplyment = Math.floor((new Date().getTime() - (new Date(request.contract_deployment)).getTime()) / (1000 * 60 * 60 * 24))
      // const lastPay = await PaidCommisions.findOne({})
      const manager = await Manager.findById(request.manager)
      const daysFromLastPay = request.lastPayedComission ? Math.floor((new Date().getTime() - (new Date(request.lastPayedComission)).getTime()) / (1000 * 60 * 60 * 24)) : daysFromDeplyment
      if (daysFromLastPay > request.commissions_frequency) {
        const portfolio = await Portfolio.findOne({request: request._id, state: 'active'})
        const commisions = await calcComissions(null, request)
        if (comissions.paid < comissions.accrued) {
          const perfomanceFeeTransaction = new Transaction({
            contract: portfolio.smart_contact,
            request: request._id,
            type: 'perfomance fee',
            receiver: {
              name: manager.name + ' ' + manager.surname,
              type: 'manager',
              id: manager._id
            },
            investor: request.investor,
            manager: request.manager
          })
          const managmentFeeTransaction = new Transaction({
            contract: portfolio.smart_contact,
            request: request._id,
            type: 'managment fee',
            receiver: {
              name: manager.name + ' ' + manager.surname,
              type: 'manager',
              id: manager._id
            },
            investor: request.investor,
            manager: request.manager
          })
          await TGlogger(`Called comissions paying for request #${request._id} ${JSON.stringify(tokens)} ${JSON.stringify(values)}`)
          await callCommisionsPay(portfolio.smart_contact, comissions.accrued - comissions.paid)
            .catch(TGlogger)  
          request.set({lastPayedComission: new Date()})
          await perfomanceFeeTransaction.save()
          await managmentFeeTransaction.save()
          await request.save()
        }
      }
    }
  }
  resolve()
})