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
  const ethReturning = await Request.find({status: 'sending old tokens'})
  for (let request of ethReturning) {
    const porfolio = await Portfolio.findOne({request: request._id, state: 'active'})
    const orders = await Order.find({request: request._id, related_portfolio: porfolio._id})
    let everyCompeleted = true
    let contractAddress = ''
    let tokens = []
    for (let order of orders) {
      contractAddress = order.contract_address
      if (order.status !== 'completed') {
        everyCompeleted = false
        break
      } else {
        const stock = await Stock.findOne({title: order.token_name})
        tokens.push(stock.address)
      }
    }
    // console.log(orders.length > 0, everyCompeleted, tokens)
    if (orders.length > 0) {
      if (everyCompeleted) {
        const tokensOnContract = await checkContractBalance(orders[0].contract_address, ['0x05f4a42e251f2d52b8ed15e9fedaacfcef1fad27'])
        if (tokensOnContract || !configs.productionMode) {
          await TGlogger(`Sent tokens from request #${request._id} to exchange`)
          await sendTokens(contractAddress, tokens)
          request.set({status: 'active'})
          await request.save()
        }
      }
    }
  }
  resolve()
})