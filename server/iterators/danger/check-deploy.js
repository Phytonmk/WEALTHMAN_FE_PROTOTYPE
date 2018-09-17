const Request = require('../../models/Request')
const Portfolio = require('../../models/Portfolio')
const Transaction = require('../../models/Transaction')
const TGlogger = require('../../helpers/tg-testing-loger')

const checkDeployment = require('../../trading/check-deposit')

module.exports = () => new Promise(async (resolve, reject) => {
  const requests = await Request.find({status: 'deploying'})
  for (request of requests) {
    if (request.deployment_hash) {
      // console.log(`Checking ${request.deployment_hash} for deployment...`)
      const deployment = await checkDeployment(request.deployment_hash).catch(console.log)
      // console.log(deployment)
      switch (deployment.status) {
        case 'failed':
          // console.log(`${request.deployment_hash} faild`)
          request.set({status: 'failed'})
          await request.save()
          break
        case 'deployed':
          // console.log(`${request.deployment_hash} deployed`)
          request.set({
            status: 'waiting for deposit',
            contract_deployment: new Date()
          })
          await TGlogger(`Smart contract ${deployment.address} deployed for request #${request._id}`)
          const portfolio = await Portfolio.findOne({state: 'active', request: request._id + ''})
          if (portfolio !== null) {
            portfolio.set({smart_contract: deployment.address}) 
            await portfolio.save()
          } else {
            request.set({status: 'failed'})
          }
          const transaction = new Transaction({
            contract: deployment.address,
            request: request._id,
            type: 'deployment',
            receiver: {
              name: 'Contract',
              type: 'contract',
              id: deployment.address
            },
            investor: request.investor,
            manager: request.manager
          })
          await request.save()
          await transaction.save()
          break
        case 'pending':
          // console.log(`${request.deployment_hash} no data yet`)
        break
      }
    }
  }
  resolve()
})
