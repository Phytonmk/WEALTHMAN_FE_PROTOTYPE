import React, { Component } from 'react'
import { store, setReduxState } from '../../redux'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import Sortable2 from '../Sortable2.jsx'
import { api, setPage, setCurrency } from '../helpers'

import QRCode from 'qrcode.react'
import {AreaChart} from 'react-easy-chart'

import Subheader from './../Subheader'
import Select from './../Select'
import portfolioValues from './../portfolioValues'

class PortfoliosPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      gotData: false,
      portfolios: [{}],
      requests: [{}],
      currentCurrencyPrices: [],
      currentCurrency: 'USD',
      currentTab: 0,
      investors: [],
      managers: [],
      companies: [],
      graphics: []
    }
  }
  componentWillMount() {
    api.post('portfolios/load')
      .then((res) => {
        console.log(res.data)
        if (res.data.exists)
          this.setState({gotData: true, portfolios: res.data.portfolios, requests: res.data.requests})
        else
          this.setState({gotData: true, portfolios: [], requests: []})
        for (let portfolio of res.data.portfolios)
          portfolioValues(portfolio.currencies, 1, 'week', (result) => {
            const graphics = [...this.state.graphics]
            graphics.push({
              id: portfolio._id,
              data: result.data.map((chunk, i) => { return {
                x: i,
                y: chunk.value
              }})
            })
            this.setState({graphics})
            console.log(graphics)
          })
        setTimeout(() => this.forceUpdate(), 0)
      })
      .catch(console.log)
    api.get('stocks')
      .then((res) => {
        this.setState({currentCurrencyPrices: res.data.map(stock => {return {name: stock.title, price: stock.last_price}})})
      })
      .catch(console.log)
    api.post('requests')
      .then((res) => {
        this.setState({requests: res.data, managers: [], investors: [], gotData: true})
        for (let request of this.state.requests) {
          let loadProfileOf = 'investor'
          switch(this.props.user) {
            case 0:
              if (request.company)
                loadProfileOf = 'company'
              else
                loadProfileOf = 'manager'
            break
            case 1:
              if (request.company)
                loadProfileOf = 'company'
              else
                loadProfileOf = 'investor'
            break
            case 3:
              if (request.type === 'portfolio')
                loadProfileOf = 'investor'
              else
                loadProfileOf = 'manager'
            break
          }
          api.get(loadProfileOf + '/' + request[loadProfileOf])
            .then((res) => {
              let many = 'investors'
              if (loadProfileOf === 'manager')
                many = 'managers'
              else if (loadProfileOf === 'company')
                many = 'companies'
              const tmp = [...this.state[many]]
              tmp.push(res.data)
              this.setState({[many]: tmp})
            })
            .catch(console.log)
        }
      })
      .catch(console.log)
  }
  render() {
    if (!this.state.gotData)
      return <div className="box loading"><p>Loading</p></div>
    let currencies = this.state.currentCurrencyPrices.map((c, i) =>
      <option key={i} value={c.name}>{c.name}</option>
    )
    let currentCurrency = this.state.currentCurrencyPrices.find(c => c.name == this.state.currentCurrency) || {price: 0, name: 'USD'}
    let totalValue
    if (this.state.portfolios.length > 0)
      totalValue = this.state.portfolios
        .map(p => {
          let price = 1
          if (this.state.currentCurrencyPrices.find(c => c.name == p.currency) !== undefined)
            price = this.state.currentCurrencyPrices.find(c => c.name == p.currency).price
          return p.value * price
        })
        .reduce((a, b) => a + b)
    else
      totalValue = 0

    let titles = [
      {
        property: "number",
        title: "#",
        type: "number",
        width: "60px",
      },
      {
        property: "person",
        title: this.props.user == 1 ? "investor" : "manager",
        width: "200px",
      },
      {
        property: "instrument",
        title: "Managment style",
        width: "100px",
        tooltip: "name of algorythm",
      },
      {
        property: "value",
        title: "value",
        width: "50px",
        tooltip: "value of portfolio",
      },
      {
        property: "change",
        title: "7 days. change",
        width: "120px",
        type: "unsortable"
      },
      {
        property: "status",
        title: "Status",
        width: "60px",
      },
      {
        property: "recommendation",
        title: "Recommendation needed",
        width: "60px",
      },
      {
        property: "qrcode",
        title: "Smart contract",
        width: "100px",
        type: "unsortable"
      }
    ]

    const addedRequests = []
    let portfolios = this.state.portfolios.map((portfolio, i) => {
      let request = this.state.requests.find(request => request._id == portfolio.request) || {}
      addedRequests.push(request._id)
      let price = 1
      if (this.state.currentCurrencyPrices.find(c => c.name == portfolio.currency) !== undefined)
        price = this.state.currentCurrencyPrices.find(c => c.name == portfolio.currency).price
      const value = (portfolio.value * price / (currentCurrency.price !== 0 ? currentCurrency.price : 1)).toFixed(3)

      const profitGraph =  <AreaChart
        margin={{top: 0, right: 0, bottom: 0, left: 0}}
        width={130}
        height={100}
        data={[(this.state.graphics.find(graphic => graphic.id === portfolio._id) || {data: []}).data]}
      />
      let user = {}
      if (this.props.user === 0)
        user = request.company ?
        this.state.companies.find(i => i._id == request.company) || {} :
        this.state.managers.find(i => i._id == request.manager) || {}
      else if (this.props.user === 1)
        user = request.company ?
        this.state.companies.find(i => i._id == request.company) || {} :
        this.state.investors.find(i => i._id == request.investor) || {}
      else if (this.props.user === 3)
        user = this.state.investors.find(i => i._id == request.investor) || {}
      return {
        number: i,
        id: request._id,
        portfolio: <b>{request._id}</b>,
        qrcode:  <QRCode size={100} value={portfolio.smart_contract} />,
        person: (user.name || user.company_name || '') + " " + (user.surname || ''),
        instrument: request.service || '',
        change: profitGraph,
        value: request.value + ' Eth', /*(value != 'NaN' ? value : '-') + " " + currentCurrency.name*/
        status: request.status,
        recommendation: 'no',
        link: 'request/' + request._id
      }
    })
    let i = this.state.requests.length
    this.state.requests.forEach((request) => {
      if (!addedRequests.includes(request._id)) {
        let user = {}
        if (this.props.user === 0)
          user = request.company ?
          this.state.companies.find(i => i._id == request.company) || {} :
          this.state.managers.find(i => i._id == request.manager) || {}
        else if (this.props.user === 1)
          user = request.company ?
          this.state.companies.find(i => i._id == request.company) || {} :
          this.state.investors.find(i => i._id == request.investor) || {}
        else if (this.props.user === 3)
          user = this.state.investors.find(i => i._id == request.investor) || {}
        portfolios.push({
          number: i,
          id: request._id,
          portfolio: <b>{request._id}</b>,
          qrcode: <small>not deployed</small>,
          person: (user.name || user.company_name || '') + " " + (user.surname || ''),
          instrument: request.service || '',
          change: '',
          value: request.value + ' Eth',
          status: request.status,
          recommendation: 'no',
          link: 'request/' + request._id
        })
        i++
      }
    })
    const subheaders = [
        // {
        //   header: "Proposed (initial)",
        // },
        {
          header: "Active",
        },
        // {
        //   header: "Revision",
        // },
        // {
        //   header: "Recalculated",
        // },
        {
          header: "Archived",
        },
        {
          header: "In proggress",
        },
        {
          header: "All",
        },
      ]

    const filter = (row) => {
      if (subheaders[this.state.currentTab].header === 'All')
        return true
      if (subheaders[this.state.currentTab].header === 'Active' && row.status === 'active')
        return true
      else if (subheaders[this.state.currentTab].header === 'Archived' && row.status === 'archived')
        return true
      else if (subheaders[this.state.currentTab].header === 'In proggress' && !['active', 'archived'].includes(row.status))
        return true
      else
        return false
    }

    const sortable = <Sortable2
      filter={filter}
      columns={titles}
      data={portfolios}
      linkProperty={"link"}
    />

    for (let subheader of subheaders) {
      subheader.content = sortable
    }

    return (
      <div id="portfolios-page">
        <div className="container">
          <div className="my-requests">
            <div className="column fourth">
              <h2>My portfolios</h2>
              {/*<span>Total value</span>*/}
            </div>
            <div className="column right portfolios-currency-select">
              <div className="row">
                <h2>{totalValue} {this.state.currentCurrency}</h2>
              </div>
              <div className="row">
                Change the current currency
                <Select
                  value={this.state.currentCurrency}
                  options={this.state.currentCurrencyPrices.map(c => c.name)}
                  setValue={(value) => this.setState({currentCurrency: value})}
                  width="100px"
                />
              </div>
            </div>
          </div>
        </div>
        <Subheader
          data={subheaders}
          initialTab={this.state.currentTab}
          onChange={(tab) => this.setState({currentTab: tab})}
        />
      </div>
    )
  }
}

export default connect(a => a)(PortfoliosPage)
