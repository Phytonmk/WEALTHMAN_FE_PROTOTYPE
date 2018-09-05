const Request = require('../../models/Request')
const Portfolio = require('../../models/Portfolio')
const checkContractBalance = require('../../trading/token_balance_check.js')
const TGlogger = require('../../helpers/tg-testing-loger')

const ethAddress = '0x0000000000000000000000000000000000000000'

module.exports = () => new Promise(async (resolve, reject) => {
  const requests = await Request.find({status: 'waiting for withdraw'})
  for (let request of requests) {
    const portfolio = await Portfolio.findOne({
      request: request._id,
      state: 'active'
    })
    let noErr = true
    const ethOnAddress = await checkContractBalance(portfolio.smart_contract, [ethAddress])
      .catch((e) => {
        console.log(e)
        noErr = false
      })
    if (noErr) {
      if (!ethOnAddress) {
        await TGlogger(`Request #${request._id} withdrawed`)
        request.set({status: 'archived'})
        await request.save()
      }
    }
  }
  resolve()
})