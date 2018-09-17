const Request = require('../../models/Request')
const TGlogger = require('../../helpers/tg-testing-loger')

module.exports = () => new Promise(async (resolve, reject) => {
  const requests = await Request.find({status: 'active'})
  // , $where: function() {
  //   return new Date(this.contract_deployment).getTime() + 1000 * 60 * 60 * 24 * this.period > Date.now()
  //   return false
  // }})

  for (let request of requests) {
    if(request.contract_deployment.getTime() + 1000 * 60 * 60 * 24 * this.period > Date.now()) {
      request.set({status: 'getting ethereum'})
      await TGlogger(`Auto completing request #${request._id} due to timeout`)
      await request.save()
    }
  }
  resolve()
})