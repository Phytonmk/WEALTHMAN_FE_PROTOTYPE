const Request = require('../../models/Request')
const Order = require('../../models/Order')
const Stock = require('../../models/Stock')
const configs = require('../../configs')

const sendEthereum = require('../../trading/send-eth-to-exchange')
const sendTokens = require('../../trading/send-tokens-to-exchange')

module.exports = () => new Promise(async (resolve, reject) => {
  const buying = await Request.find({status: 'buying tokens'})
  for (let request of buying) {
    const orders = await Order.find({request: request._id})
    let everyCompeleted = true
    for (let order of orders) {
      if (order.status !== 'completed') {
        everyCompeleted = false
        break
      }
    }
    await sendAllEth(contractAddress)
    if (everyCompeleted) {
      request.set({status: 'active'})
      await request.save()
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
    await sendAllToEth(contractAddress, tokens)
    if (everyCompeleted) {
      request.set({status: 'active'})
      await request.save()
    }
  }
  resolve()
})