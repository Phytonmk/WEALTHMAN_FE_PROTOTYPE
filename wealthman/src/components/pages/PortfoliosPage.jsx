import React, { Component } from 'react';
import { store, setReduxState } from '../../redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Sortable2 from '../Sortable2.jsx';
import { api, setPage, setCurrency } from '../helpers';

import QRCode from 'qrcode.react';
import {AreaChart} from 'react-easy-chart';

import Subheader from './../Subheader';
import Select from './../Select';

class PortfoliosPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gotData: false,
      portfolios: [{}],
      requests: [{}],
      currentCurrencyPrices: [],
      currentCurrency: 'USD',
      currentTab: 0
    }
  }
  componentWillMount() {
    api.post('portfolios/load')
      .then((res) => {
        console.log(res.data)
        if (res.data.exists)
          this.setState({gotData: true, portfolios: res.data.portfolios, requests: res.data.requests});
        else
          this.setState({gotData: true, portfolios: [], requests: []});
        setTimeout(() => this.forceUpdate(), 0)
      })
      .catch(console.log);
    api.get('stocks')
      .then((res) => {
        this.setState({currentCurrencyPrices: res.data.map(stock => {return {name: stock.title, price: stock.last_price}})});
      })
      .catch(console.log);
  }
  genGraphData() {
    const data = []
    const points = 10 + Math.round(Math.random() * 40)
    const range = 20 + Math.round(Math.random() * 60)
    for (let i = 0; i < points; i++)
      data.push({
        x: i,
        y: 10 + i + Math.round(Math.random() * (range / 2)  - range)
      })
    return data
  }
  render() {
    if (!this.state.gotData)
      return <div className="box loading"><p>Loading</p></div>
    let currencies = this.state.currentCurrencyPrices.map((c, i) =>
      <option key={i} value={c.name}>{c.name}</option>
    );
    let currentCurrency = this.state.currentCurrencyPrices.find(c => c.name == this.state.currentCurrency) || {price: 0, name: 'USD'};
    let totalValue
    if (this.state.portfolios.length > 0)
      totalValue = this.state.portfolios
        .map(p => {
          let price = 1;
          if (this.state.currentCurrencyPrices.find(c => c.name == p.currency) !== undefined)
            price = this.state.currentCurrencyPrices.find(c => c.name == p.currency).price;
          return p.value * price;
        })
        .reduce((a, b) => a + b);
    else
      totalValue = 0;

    let titles = [
      {
        property: "portfolio",
        title: "Portfolio",
        width: "60px",
      },
      {
        property: "smart",
        title: "Smart-cntract",
        width: "200px",
        type: "unsortable"
      },
      {
        property: "instrument",
        title: "instrument",
        width: "100px",
        tooltip: "name of algorythm",
      },
      {
        property: "profit",
        title: "Fee, % of profit",
        width: "80px",
        type: "unsortable"
      },
      {
        property: "value",
        title: "value",
        width: "100px",
        tooltip: "value of portfolio",
      },
      {
        property: "status",
        title: "Status",
        width: "160px",
      },
      {
        property: "cost",
        title: "Cost",
        width: "80px",
        type: "unsortable"
      }
    ];

    let portfolios = this.state.portfolios.map((portfolio, i) => {
      let request = this.state.requests.find(request => request._id == portfolio.request) || {};
      let price = 1;
      if (this.state.currentCurrencyPrices.find(c => c.name == portfolio.currency) !== undefined)
        price = this.state.currentCurrencyPrices.find(c => c.name == portfolio.currency).price;
      const value = (portfolio.value * price / (currentCurrency.price !== 0 ? currentCurrency.price : 1)).toFixed(3);
      
      const profitGraph =  <AreaChart
        margin={{top: 0, right: 0, bottom: 0, left: 0}}
        width={80}
        height={20}
        data={[this.genGraphData()]}
      />
      const costGraph =  <AreaChart
        margin={{top: 0, right: 0, bottom: 0, left: 0}}
        width={80}
        height={20}
        data={[this.genGraphData()]}
      />
      return {
        id: portfolio._id,
        portfolio: <b>{portfolio._id}</b>,
        smart:  <div className="smart-contract-comact">{portfolio.smart_contract}</div>,
        instrument: request.service || '',
        profit: profitGraph,
        value: (value != 'NaN' ? value : '-') + " " + currentCurrency.name,
        status: request.status,
        cost: costGraph,
        link: 'request/' + request._id
      };
    });
    console.log(portfolios)
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
        // {
        //   header: "Statistics",
        // },
      ];

    const filter = (row) => {
      if (subheaders[this.state.currentTab].header === 'Active' && row.status === 'active')
        return true;
      else if (subheaders[this.state.currentTab].header === 'Archived' && row.status === 'archived')
        return true;
      else if (subheaders[this.state.currentTab].header === 'In proggress' && !['active', 'archived'].includes(row.status))
        return true;
      else
        return false;
    }

    const sortable = <Sortable2
      filter={filter}
      columns={titles}
      data={portfolios}
      linkProperty={"link"}
    />;

    for (let subheader of subheaders) {
      subheader.content = sortable;
    }

    return (
      <div id="portfolios-page">
        <div className="container">
          <div className="my-requests">
            <div className="column fourth">
              <h2>My portfolios</h2>
              <span>Total value</span>
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
    );
  }
}

export default connect(a => a)(PortfoliosPage);
