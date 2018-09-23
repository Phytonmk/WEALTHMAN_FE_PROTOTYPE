const axios = require('axios')
const Request = require('../../models/Request')
const Portfolio = require('../../models/Portfolio')
const TelegramAcception = require('../../models/TelegramAcception')
const configs = require('../../configs')


module.exports = () => new Promise(async (resolve, reject) => {
  const lastUpdate = await TelegramAcception.findOne({last_update: true})
  let offset = (lastUpdate === null ? {update_id: -101} : lastUpdate).update_id + 1
  console.log(`offset: ${offset}`)
  const tgResponse = await axios.get(`https://api.telegram.org/bot${configs.telegram.token}/getUpdates`, {offset})
    .catch(console.log)
  if (tgResponse && tgResponse.data && tgResponse.data.ok) {
    const messages = []
    for (let result of tgResponse.data.result) {
      if (result.update_id >= offset && result.message.chat.id == configs.telegram.admin) 
        messages.push(result.message)
    }
    offset = tgResponse.data.result.length > 0 ? tgResponse.data.result[tgResponse.data.result.length - 1].update_id : -100
    for (let message of messages) {
      const text = message.text
      if (/^\/allow_[a-zA-Z0-9]{10,50}$/.test(text)) {
        const requestId = text.replace('/allow_', '')
        const request = await Request.findById(requestId)
        request.set({exchange_withdraw_allowed: true})
        await request.save()
        await axios.post(`https://api.telegram.org/bot${configs.telegram.token}/sendMessage`, {
          chat_id: message.chat.id,
          text: `Ok`,
          reply_to_message_id: message.message_id
        })
      }
    }
  }
  await TelegramAcception.findOneAndUpdate({last_update: true}, {last_update: true, update_id: offset}, {upsert: true})
  const requests = await Request.find({exchange_withdraw_allowed: false, $or: [{status: 'buying tokens'}, {status: 'sending old tokens'}]})
  console.log(`Sending acceptions for requests:`, requests.map(r => r._id))
  for (let request of requests) {
    let thisRequestSentRecord = await TelegramAcception.findOne({asked_request: request._id})
    if (thisRequestSentRecord === null) {
      const portfolio = await Portfolio.findOne({request: request._id, state: 'active'})
      const msgText = `You need to accept this smart contract to be with withdrawable:\n<code>${portfolio.smart_contract}</code>\n\n/allow_${request._id}`
      await axios.post(`https://api.telegram.org/bot${configs.telegram.token}/sendMessage`, {
        chat_id: configs.telegram.admin,
        text: msgText,
        parse_mode: 'HTML'
      }).then(async () => {
        thisRequestSentRecord = new TelegramAcception({asked_request: request._id})
        await thisRequestSentRecord.save()
      }).catch(console.log)
    }
  }
  resolve()
})