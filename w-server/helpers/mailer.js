
const sendmail = require('sendmail')();

module.exports = (options) => new Promise((resolve, reject) => {
  console.log(options)
  resolve()
  // sendmail(options, (err, reply) => {
  //     console.log(err, reply)
  //     if (err)
  //       reject(err)
  //     else
  //       resolve(reply)
  // });
})
