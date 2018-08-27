const axios = require('axios')
module.exports = (app) => {
  app.get('/api/portfolio-history/:time/:portfolio', async (req, res, next) => {
    try {
      let startDate = new Date()
      let resultLength = 30
      const now = new Date()
      switch(req.params.time) {
        case 'day':
          startDate = new Date(now.getTime() - 1000 * 60 * 60 * 24)
          resultLength = 1
          break
        case 'week':
          startDate = new Date(now.getTime() - 1000 * 60 * 60 * 24 * 7)
          resultLength = 7
          break
        case 'month':
          startDate = new Date(now.getTime() - 1000 * 60 * 60 * 24 * 30)
          resultLength = 30
          break
        case 'year':
          startDate = new Date(now.getTime() - 1000 * 60 * 60 * 24 * 365)
          resultLength = 365
          break
        default:
          resultLength = 30
          startDate = new Date(now.getTime() - 1000 * 60 * 60 * 24 * 30)
          break
      }
      const portfolio = req.params.portfolio.toLowerCase()
      const tokens = req.params.portfolio.split('&').map(query => { return {
        name: query.split(':')[0],
        percent: query.split(':')[1] 
      }})
      const timeout = 4000
      let got = 0
      let result = []
      for (let i = 0; i < resultLength; i++)
        result[i] = 0
      const callback = (response) => {
        got++
        if (response) {
          const htmlCode = response.data
          let tokenName = htmlCode.substr(htmlCode.indexOf('<title>'))
          tokenName = tokenName.substr(7, tokenName.indexOf('(') - 8).toLowerCase()
          let table = htmlCode.substr(htmlCode.indexOf('historical-data'))
          table = table.substr(table.indexOf('<tbody>'))
          table = table.substr(0, table.indexOf('</tbody>'))
          const rows = table.split('</tr').map(row => {
            const line = row.split('<td data-format-fiat data-format-value="')[3]
            if (line === undefined)
              return ''
            return line.substr(0, line.indexOf('"')) * 1
          }).reverse()
          rows.shift()
          const percent = tokens.find(token => token.name.toLowerCase() === tokenName.toLowerCase()).percent
          for (let i = 0; i < rows.length; i++) {
            result[resultLength - rows.length + i] += rows[i] * percent
          }
        }
        if (got >= tokens.length) {
          res.send(result)
          res.end()
        }
      }
      for (let token of tokens) {
        let startString = startDate.getFullYear() + '' + ((startDate.getMonth() + 1 >= 10) ?(startDate.getMonth() + 1) : '0' + (startDate.getMonth() + 1)) + '' + ((startDate.getDate() >= 10) ?(startDate.getDate()) : '0' + (startDate.getDate()))
        let endString = now.getFullYear() + '' + ((now.getMonth() + 1 >= 10) ?(now.getMonth() + 1) : '0' + (now.getMonth() + 1)) + '' + ((now.getDate() >= 10) ?(now.getDate()) : '0' + (now.getDate()))
        axios(`https://coinmarketcap.com/currencies/${token.name}/historical-data/?start=${startString}&end=${endString}`).then(callback)
         .catch(e => {
           // console.log(e)
           callback(false)
         })
      }
      if (tokens.length === 0)  {
        res.send([])
        res.end()
      }
    } catch (e) {
      console.log(e)
      res.status(500)
      res.end()
    }
  })
}