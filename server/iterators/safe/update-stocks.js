const ccxt = require('ccxt')
const axios = require('axios')
const jsdom = require('jsdom')
const { JSDOM } = jsdom
const download = require('image-downloader')
const fs = require('fs-extra')

const configs = require('../../configs')

const Stock = require('../../models/Stock');

const LOG = false

module.exports = () => new Promise(async (resolve, reject) => {

  let maxPage = 999
  const currentDate = Date.now()
  const tokens = []
  const availibleTokens = []


  for (let exchangeData of configs.exchanges) {
    if (LOG)
      console.log('Getting data from ' + exchangeData.name)
    const exchange = new ccxt[exchangeData.name] ()
    const markets = await exchange.fetchMarkets()
    markets.forEach(market => availibleTokens.push(market.base))
  }
  console.log('Got data from exchanges')
  for (let i = 0; i <= maxPage; i++) {
    if (LOG)
      console.log(`Getting data from etherscan page ${i}/${maxPage}`)
    const resonse = await axios.get(`https://etherscan.io/tokens?p=${i}`)
    const body = (new JSDOM(resonse.data)).window.document.body
    maxPage = body.querySelector('#ContentPlaceHolder1_divpagingpanel span > span > b:nth-of-type(2)').textContent * 1
    const rows = body.querySelectorAll('table.table-striped tbody tr')
    for (let row of rows) {
      const title = row.querySelector('td:nth-of-type(3) > h5 > a').textContent.replace(/^.+\s{1}\(/, '').replace(/\)$/, '')
      if (availibleTokens.includes(title))
        tokens.push({
          name: row.querySelector('td:nth-of-type(3) > h5 > a').textContent.replace(/\s{1}\({1}.+$/, ''),
          title,
          address: row.querySelector('td:nth-of-type(3) > h5 > a').getAttribute('href').replace(/^\/token\//, ''),
          last_price: row.querySelector('td:nth-of-type(5) > span').textContent.replace('$', '') * 1,
          change_percnt: row.querySelector('td:nth-of-type(6)').textContent.replace('%', '') * 1,
          volume: row.querySelector('td:nth-of-type(7)').textContent.replace(/,/g, '').replace('$', '') * 1,
          token_img: 'https://etherscan.io' + row.querySelector('td:nth-of-type(2) img').getAttribute('src'),
          last_update: currentDate
        })
    }
  }
  if (LOG) {
    console.log('Got data from etherscan')
    console.log('Downloading images')
  }
  await fs.ensureDir(__dirname + '/../../img/tokens/')
  let i = 0
  for (let token of tokens) {
    if (i % 15 === 0 && LOG)
      console.log(`Downloaded ${i} pics from ${tokens.length}`)
    i++
    const downloadedImage = await download.image({url: token.token_img, dest: __dirname + '/../../img/tokens'})
      .catch(console.log)
    if (downloadedImage)
      token.token_img = 'tokens/' + downloadedImage.filename.replace(/^.*[\\\/]/, '')
  }
  if (LOG)
    console.log('Saving new stocks')
  for (let token of tokens) {
    for (let property in token)
      if (!token[property])
        token[property] = 0
    await Stock.findOneAndUpdate({title: token.title}, token, {upsert: true})
  }
  if (LOG)
    console.log('All new stocks are saved')

  // add removing of old stocks

  resolve()
})