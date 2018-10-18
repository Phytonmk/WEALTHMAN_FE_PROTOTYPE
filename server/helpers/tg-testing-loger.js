const axios = require('axios')
const configs = require('../configs')


module.exports = (text) => new Promise(async (resolve, reject) => {
  if (!text.substr) {
    resolve()
    return
  }
  await axios.post(`https://api.telegram.org/bot${configs.telegram.token}/sendMessage`, {
    chat_id: configs.telegram.logsTo,
    text: text.length <= 4000 ? text : text.substr(0, 4000),
  }).catch(console.log)
  resolve()
})