const Portfolio = require('../../models/Portfolio')
const Request = require('../../models/Request')
const Order = require('../../models/Order')
const Stock = require('../../models/Stock')
const configs = require('../../configs')

const sendEthereum = require('../../trading/send-eth-to-exchange')
const sendTokens = require('../../trading/send-tokens-to-exchange')
const checkContractBalance = require('../../trading/check-tokens-presence.js')
const TGlogger = require('../../helpers/tg-testing-loger')

module.exports = () => new Promise(async (resolve, reject) => {
  const buying = await Request.find({status: 'buying tokens'})
  for (let request of buying) {
    const porfolio = await Portfolio.findOne({request: request._id, state: 'active'})
    const orders = await Order.find({request: request._id, related_portfolio: porfolio._id})
    let everyCompeleted = true
    let tokens = []
    let sumCost = 0
    for (let order of orders) {
      if (order.status !== 'completed') {
        everyCompeleted = false
        break
      } else {
        const stock = await Stock.findOne({title: order.token_name})
        sumCost += order.cost
        tokens.push(stock.address)
      }
    }
    console.log(`Cheching if all tokens bought: `, orders, everyCompeleted)
    if (orders.length > 0) {
      if (everyCompeleted) {
        const tokensOnContract = await checkContractBalance(orders[0].contract_address, tokens)
        console.log(tokensOnContract, !configs.productionMode)
        if (tokensOnContract || !configs.productionMode) {
          await sendEthereum(porfolio.smart_contract)
          await TGlogger(`Sent ethereum from request #${request._id} to exchange`)
          request.set({status: 'active', initial_value: sumCost})
          await request.save()
        }
      }
    }
  }
  const ethReturning = await Request.find({status: 'recalculation'})
  for (let request of ethReturning) {
    const porfolio = await Portfolio.findOne({request: request._id, state: 'active'})
    console.log('=============', request._id, porfolio.smart_contract)
    const oldPortfolios = await Portfolio.find({request: request._id, state: 'old'}).sort({lastActiveEnabling: -1}).limit(1)
    if (oldPortfolios.length === 0) {
      console.log(`Unable to find previos active portfolio for request ${request._id} to sell old tokens`)
      continue
    }
    const prevPortfolio = oldPortfolios[0]
    // const orders = await Order.find({request: request._id, related_portfolio: porfolio._id})
    // let everyCompeleted = true
    const tokens = []
    // for (let order of orders) {
    //   contractAddress = order.contract_address
    //   if (order.status !== 'completed') {
    //     everyCompeleted = false
    //     break
    //   } else {
    //     const stock = await Stock.findOne({title: order.token_name})
    //   }
    // }
    for (let token of prevPortfolio.currencies) {
      const stock = await Stock.findOne({title: token.currency})
      tokens.push(stock.address)
      console.log(`Token: ${stock.title}`)
    }
    // console.log(orders.length > 0, everyCompeleted, tokens)
    // if (orders.length > 0) {
    //   if (everyCompeleted) {
        const tokensOnContract = await checkContractBalance(porfolio.smart_contract, tokens).catch(console.log)
        console.log(`Tokens on contract of request ${request._id}? ${tokensOnContract}`)
        if (tokensOnContract || !configs.productionMode) {
          await sendTokens(porfolio.smart_contract, tokens)
          await TGlogger(`Sent tokens ${tokens.join(', ')} from request #${request._id} to exchange`)
          request.set({status: 'tokens exchanging'})
          await request.save()
        }
    //   }
    // }
  }
  resolve()
})