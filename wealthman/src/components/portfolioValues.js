import axios from 'axios'
import { api } from './helpers'

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

let stocks = {}
api.get('stocks')
  .then((res) => {
    res.data.forEach((stock) => {
      stocks[stock.title] = stock.name
    })
    // res.data.map
  })
  .catch(console.log)

export default (portfolio, ethereumAmount=1, onlyOnePeriod, callback) => {
  let query = ''
  let ampersend = false
  for (let token of portfolio) {
    if (ampersend)
      query += '&'
    ampersend = true
    query += (stocks[token.currency] ? stocks[token.currency] : token.currency) + ':' + token.percent
  }
  const getDataFor = (period) => {
    console.log(`portfolio-history/${period}/${query}`)
    api.get(`portfolio-history/${period}/${query}`)
      .then((res) => {
        let startDate = Date.now()
        switch(period) {
          case 'day':
            startDate = Date.now() - 1000 * 60 * 60 * 24 * 1
            break
          case 'week':
            startDate = Date.now() - 1000 * 60 * 60 * 24 * 7
            break
          case 'month':
            startDate = Date.now() - 1000 * 60 * 60 * 24 * 30
            break
          case 'year':
            startDate = Date.now() - 1000 * 60 * 60 * 24 * 365
            break
        }
        callback({
          title: period.substr(0, 1).toUpperCase() + period.substr(1),
          data: res.data.map((chunk, i) => {
            const thisDate = new Date(startDate + 1000 * 60 * 60 * 24 * i) 
            const dateString = `${thisDate.getDate()}-${monthNames[thisDate.getMonth()]}-${thisDate.getFullYear().toString().substr(2)}`
            return {
              value: chunk * ethereumAmount,
              title: dateString,
            }
          })
        })
      })
      .catch(console.log)
    
  }
  console.log(onlyOnePeriod)
  if (!onlyOnePeriod) {
    for (let length of ['week', 'month', 'year']) {
      getDataFor(length)
    }
  } else {
    getDataFor(onlyOnePeriod)
  }
}