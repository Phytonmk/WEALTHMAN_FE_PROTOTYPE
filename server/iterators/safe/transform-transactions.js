const configs = require('../../configs')

const Request = require('../../models/Request')
const Transaction = require('../../models/Transaction')
const RawTransaction = require('../../models/RawTransaction')
const Portfolio = require('../../models/Portfolio')
const Manager = require('../../models/Manager')
const Investor = require('../../models/Investor')

module.exports = () => new Promise(async (resolve, reject) => {
  const rawTranasctions = await RawTransaction.find()
  for (let rawTranasction of rawTranasctions) {
    let type = 'unknown'
    const receiver = {
      name: 'unknown',
      type: 'unknown'
    }
    const request = await Request.findById(rawTranasction.request)
    if (request === null)
      continue
    const manager = await Manager.findById(request.manager)
    const investor = await Manager.findById(request.manager)
    if (rawTranasction.data.to.toLowerCase() === manager.wallet_address.toLowerCase()) {
      let type = 'manager fee'
      type = ''
      receiver = {
        name: manager.name + (manager.surname ? (' ' + manager.surname) + manager.surname : ''),
        type: 'manager',
        id: manager._id
      }
    }
    else if (rawTranasction.data.to.toLowerCase() === investor.wallet_address.toLowerCase()) {
      let type = 'withdraw'
      receiver = {
        name: investor.name + (investor.surname ? (' ' + investor.surname) + investor.surname : ''),
        type: 'investor',
        id: investor._id
      }
    }
    else if (rawTranasction.data.to === configs.adminAddress.toLowerCase()) {
      let type = 'platform fee'
      receiver = {
        name: 'Wealthman',
        type: 'wealthman'
      }
    } else if (rawTranasction.data.to === rawTranasction.smart_contract) {
      let type = 'deposit'
      const receiver = {
        name: 'contract',
        type: 'contract',
        id: rawTranasction.smart_contract
      }
    }
    await Transaction.findOneAndUpdate({
      date: rawTranasction.date,
      request: rawTranasction.request
    }, {
      contract: rawTranasction.smart_contract,
      request: rawTranasction.request,
      date: rawTranasction.date,
      type,
      receiver
    }, {
      upsert: true
    })
  }
  resolve()
})