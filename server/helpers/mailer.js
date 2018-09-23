
const configs = require('../configs')

const mailjet = require('node-mailjet')
  .connect(configs.mailjet.key, configs.mailjet.secret)

module.exports = (options) => new Promise((resolve, reject) => {
  console.log(options)
  const request = mailjet
    .post('send')
    .request(options)
    .then(resolve)
    .catch(reject)
})
