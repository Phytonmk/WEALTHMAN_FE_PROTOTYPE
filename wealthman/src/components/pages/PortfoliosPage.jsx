import React, { Component } from 'react';
import { store, setReduxState } from '../../redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Sortable2 from '../Sortable2.jsx';
import { api, setPage, setCurrency } from '../helpers';
import QRCode from 'qrcode.react';

import Subheader from './../Subheader';
import Select from './../Select';


class PortfoliosPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gotData: false
    }
  }
  loadManagers(portfolios) {
    for (let porfolio of portfolios) {
      api.get('manager/' + porfolio.manager)
        .then((res) => {
          const managers = [...store.getState().managers];
          managers.push(res.data);
          setReduxState({managers});
        }).catch(console.log);
    }
  }
  componentWillMount() {
    api.post('portfolios/load')
      .then((res) => {
        if (res.data.exists) {
          setReduxState({portfolios: res.data.portfolios});
          this.loadManagers(res.data.portfolios);
        } else {
          setReduxState({portfolios: []});
        }
        this.setState({gotData: true});
      })
      .catch(console.log);
    api.get('stocks')
      .then((res) => {
        setReduxState({currentCurrencyPrices: res.data.map(stock => {return {name: stock.title, price: stock.last_price}})});
      })
      .catch(console.log);
  }
  render() {
    if (!this.state.gotData)
      return <div className="box loading"><p>Loading</p></div>
    let currencies = this.props.currentCurrencyPrices.map((c, i) =>
      <option key={i} value={c.name}>{c.name}</option>
    );
    let currentCurrency = this.props.currentCurrencyPrices.find(c => c.name == this.props.currentCurrency) || {price: 0};
    let totalValue
    if (this.props.portfolios.length > 0)
      totalValue = this.props.portfolios
        .map(p => {
          let price = 0;
          if (this.props.currentCurrencyPrices.find(c => c.name == p.currency) !== undefined)
            price = this.props.currentCurrencyPrices.find(c => c.name == p.currency).price;
          // return (p.value - p.cost) * price;
          return p.value * price;
        })
        .reduce((a, b) => a + b);
    else
      totalValue = 0;

    let titles = [
      {
        property: "portfolio",
        title: "Portfolio",
        width: "50px",
      },
      {
        property: "manager",
        title: "Manager",
        width: "100px",
      },
      {
        property: "smart",
        title: "Smart-cntract",
        width: "100px",
        type: "unsortable"
      },
      // {
      //   property: "instrument",
      //   title: "instrument",
      //   tooltip: "name of algorythm",
      //   class: "instrument",
      // },
      {
        property: "profit",
        title: "Profit",
        width: "150px",
        type: "unsortable"
      },
      // {
      //   property: "value",
      //   title: "value",
      //   tooltip: "value of portfolio",
      //   class: "value",
      // },
      {
        property: "status",
        title: "Status",
        width: "100px",
      },
      {
        property: "cost",
        title: "Cost",
        width: "150px",
        type: "unsortable"
      },
      {
        property: "details",
        width: "125px",
        type: "unsortable",
      },
      {
        property: "withdraw",
        width: "125px",
        type: "unsortable",
      },
    ];
    let portfolios = this.props.portfolios.map((portfolio, i) => {
      let investor = this.props.investors.find(inv => inv.id == portfolio.investor);
      let manager = this.props.managers.find(m => m.id == portfolio.manager) || {};
      // let request = this.props.requests.find(m => m.id == portfolio.request) || {};
      let alg = this.props.algorythms.find(alg => alg.id == portfolio.alg) || {};
      let price = 0;
      if (this.props.currentCurrencyPrices.find(c => c.name == portfolio.currency) !== undefined)
        price = this.props.currentCurrencyPrices.find(c => c.name == portfolio.currency).price;
      return {
        id: portfolio.id,
        manager: (manager.name || '-') + ' ' + (manager.surname || ''),
        portfolio: portfolio.id,
        smart:  <QRCode style={{width: 65, height: 65}} value={portfolio.smart_contract} />/*portfolio.smart_contract*/,
        // instrument: alg.name,
        profit: <img src="graph.png" className="graph" />,
        // currency: portfolio.currency,
        // percent_portfolio: (portfolio.value * price / totalValue * 100).toFixed(1),
        // amount: portfolio.value,
        // value: (portfolio.value * price / currentCurrency.price).toFixed(3) + " " + currentCurrency.name,
        status: 'Recalculated'/*request.status*/,
        cost: <img src="graph.png" className="graph" />,//(portfolio.cost * price / currentCurrency.price).toFixed(3) + " " + currentCurrency.name,
        // analysis: "link.com",
        // comments: "comment",
        details: <Link to={"/portfolio/" + portfolio.request} className="no-margin">
            <button className="big-blue-button">
              Details
            </button>
          </Link>,
        withdraw: <Link to={portfolio.smart_contract !== '-' ? "/withdraw/" + portfolio.request : '#'} className="no-margin">
            <button className={portfolio.smart_contract !== '-' ? 'big-blue-button' : 'big-grey-button'}>
              Withdraw
            </button>
          </Link>
      };
    });

    let sortable = <Sortable2
      filter={row => true}
      columns={titles}
      data={portfolios}
    />;

    return (
      <div id="portfolios-page">
        <div className="container">
          <div className="my-requests">
            <div className="column fourth">
              <h2>My portfolios</h2>
              <span>Total value</span>
            </div>
            <div className="column three-fourth">
              <div className="row">
                Change the current currency
                <Select
                  value={this.props.currentCurrency}
                  options={this.props.currentCurrencyPrices.map(c => c.name)}
                  setValue={setCurrency.bind(this)}
                  width="100px"
                />
              </div>
            </div>
          </div>
        </div>
        <Subheader data={[
          {
            header: "Proposed (initial)",
            content: sortable
          },
          {
            header: "Active",
            content: sortable
          },
          {
            header: "Revision",
            content: sortable
          },
          {
            header: "Recalculated",
            content: sortable
          },
          {
            header: "Archived",
            content: sortable
          },
          {
            header: "Statistics",
            content: sortable
          },
        ]} />
      </div>
    );
  }
}

export default connect(a => a)(PortfoliosPage);
