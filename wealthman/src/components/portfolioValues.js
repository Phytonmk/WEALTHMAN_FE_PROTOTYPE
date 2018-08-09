import axios from 'axios'
import { api } from './helpers'

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

export default (portfolio, callback) => {
  let query = api.domain + ':3000/'
  let simcolomn = false
  for (let token of portfolio) {
    if (simcolomn)
      query += ';'
    simcolomn = true
    query += token.currency + ':' + token.percent
  }
  for (let length of ['week', 'month', 'year']) {
    console.log(query + '?' + length)
    axios.get(query + '?' + length)
      .then((res) => {
        const startDate = Date.now() - 1000 * 60 * 60 * 24 * res.data.length
        callback({
          title: length.substr(0, 1).toUpperCase() + length.substr(1),
          data: res.data.map((chunk, i) => {
            const thisDate = new Date(startDate + 1000 * 60 * 60 * 24 * i) 
            const dateString = `${thisDate.getDate()}-${monthNames[thisDate.getMonth()]}-${thisDate.getFullYear().toString().substr(2)}`
            return {
              value: chunk / 100,
              title: dateString,
            }
          })
        })
      })
      .catch(console.log)
  }
}