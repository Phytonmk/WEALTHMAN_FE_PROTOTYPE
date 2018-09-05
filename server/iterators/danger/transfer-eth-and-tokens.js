const Request = require('../../models/Request')
const Order = require('../../models/Order')
const Stock = require('../../models/Stock')
const configs = require('../../configs')

const sendEthereum = require('../../trading/send-eth-to-exchange')
const sendTokens = require('../../trading/send-tokens-to-exchange')
const checkContractBalance = require('../../trading/token_balance_check.js')
const TGlogger = require('../../helpers/tg-testing-loger')

module.exports = () => new Promise(async (resolve, reject) => {
  const buying = await Request.find({status: 'buying tokens'})
  for (let request of buying) {
    const orders = await Order.find({request: request._id})
    let everyCompeleted = true
    let tokens = []
    for (let order of orders) {
      if (order.status !== 'completed') {
        everyCompeleted = false
        break
      } else {
        const stock = await Stock.findOne({title: order.token_name})
        tokens.push(stock.address)
      }
    }
    console.log(`Cheching if all tokens bought: `, orders.length > 0, everyCompeleted)
    if (orders.length > 0) {
      if (everyCompeleted) {
        const tokensOnContract = await checkContractBalance(orders[0].contract_address, tokens)
        console.log(tokensOnContract, !configs.productionMode)
        if (tokensOnContract || !configs.productionMode) {
          await TGlogger(`Sent ethereum from request #${request._id} to exchange`)
          await sendEthereum(orders[0].contract_address)
          request.set({status: 'active'})
          await request.save()
        }
      }
    }
  }
  const ethReturning = await Request.find({status: 'recalculation'})
  for (let request of ethReturning) {
    const orders = await Order.find({request: request._id})
    let everyCompeleted = true
    let contractAddress = ''
    let tokens = []
    for (let order of orders) {
      if (order.status !== 'completed') {
        everyCompeleted = false
        contractAddress = order.contract_address
        break
      } else {
        const stock = await Stock.findOne({title: order.token_name})
        tokens.push(stock.address)
      }
    }
    if (orders.length > 0) {
      if (everyCompeleted) {
        const tokensOnContract = await checkContractBalance(orders[0].contract_address, tokens)
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