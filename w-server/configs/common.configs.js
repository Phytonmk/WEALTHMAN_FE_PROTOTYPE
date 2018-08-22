module.exports = {
  mongoUrl: 'mongodb://wealthman:FxScHc58DTJqNc9W@185.185.70.5:27017/wealthman',
  workerPort: 8080,
  privateKey: Buffer.from('4a131e9f1843d982cd3a4b83749b46bcd2435b5e19429109a16d2f144bd5d948','hex'),
  adminAddress: '0x6e3F0CC77BF9A846e5FD4B07706bf8ca95493d4D',
  exchangerAddress: '0x9cb29b6be58387e13e256a52d16aad7376d1ed65',
  binanceApi: {
    key: 'NfVTh5BOre1sa8NNnxBVRiPU94k5NXVIfxo7SWbwgbxYUzvZnHieMIMHbqSuOoBQ',
    secret: 'jKCtsdruy650mDhj1kpAIcOgOu22bewpUAx3QPaPp7Q2c03xDd5CZXxlwcokbaw8'
  },
  chatsAccess: {
    host: 'platform.wealthman.io',
    password: '123456'
  },
  mailjet: {
    key: '37de0643dff0741e09fc0196fad554cc',
    secret: '497c098ed0da0b153cf49da600fe7b24'
  },
  exchanges: [{
    name: 'binance',
    key: 'NfVTh5BOre1sa8NNnxBVRiPU94k5NXVIfxo7SWbwgbxYUzvZnHieMIMHbqSuOoBQ',
    secret: 'jKCtsdruy650mDhj1kpAIcOgOu22bewpUAx3QPaPp7Q2c03xDd5CZXxlwcokbaw8'
  }]
}