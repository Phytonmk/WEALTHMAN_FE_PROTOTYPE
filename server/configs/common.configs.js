module.exports = {
  mongoUrl: 'mongodb://wealthman:FxScHc58DTJqNc9W@141.8.198.87:27017/wealthman',
  workerPort: 8080,
  privateKey: Buffer.from('4a131e9f1843d982cd3a4b83749b46bcd2435b5e19429109a16d2f144bd5d948','hex'),
  adminAddress: '0x6e3F0CC77BF9A846e5FD4B07706bf8ca95493d4D',
  exchangerAddress: '0x9cb29b6be58387e13e256a52d16aad7376d1ed65',
  host: 'platform.wealthman.io',
  binanceApi: {
    key: 'fPqcpEVgmkdm2mWNcFMrD4iO3GhCV7ILiZx9lRZlG7HekYV0u2583MI7HeLZM90Y',
    secret: 'JvkI2GCGTLjG6SZOiQYFRtDT7otllGzXPqhEcvaDaoWwsuziktYuAgS7y3yMKqWc'
  },
  // chatsAccess: {
  //   host: 'platform.wealthman.io',
  //   password: '123456'
  // },
  mailjet: {
    key: '37de0643dff0741e09fc0196fad554cc',
    secret: '497c098ed0da0b153cf49da600fe7b24'
  },
  exchanges: [{
    name: 'binance',
    key: 'fPqcpEVgmkdm2mWNcFMrD4iO3GhCV7ILiZx9lRZlG7HekYV0u2583MI7HeLZM90Y',
    secret: 'JvkI2GCGTLjG6SZOiQYFRtDT7otllGzXPqhEcvaDaoWwsuziktYuAgS7y3yMKqWc'
  }],
  telegram: {
    token: '636209033:AAGsp6kM_-tqvCY2wzmfSetnPIzofbC1LRM',
    logsTo: -1001378890631,
    admin: '306472594'
  },
  chats: {
    apiPort: 2905,
    minWsPort: 2906,
    rabbitMq: 'amqp://admin:123456@185.185.71.190',
    queue: 'chats-messages-queue'
  }
}