import React, { Component } from 'react';
import { setReduxState } from '../../redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Sortable from '../Sortable.jsx';
import { api, setPage, setCurrency, prevousPage } from '../helpers';

class PortfolioPage extends Component {
  constructor(props) {
    super(props);
    this.props = {};
  }
  componentWillMount() {
    api.post('get-request/' + this.props.match.params.id, {request: this.props.match.params.id})
      .then(res => {
        console.log(res.data);
        setReduxState({
          managers: [res.data.manager],
          investors: [res.data.investor],
          requests: [res.data.request],
        })
      })
      .catch(console.log)
    api.post('portfolio/load', {request: this.props.match.params.id})
      .then(res => {
        console.log(res.data);
        if (res.data.exists)
          setReduxState({
            portfolios: [res.data.portfolio]
          });
      })
      .catch(console.log)
  }
  render() {
    console.log(this.props.portfolios);
    var portfolio = this.props.portfolios.find(p => p.request == this.props.match.params.id);
    if (portfolio === undefined)
      return <div className="box loading"><p>Loading</p></div>
    var investor = this.props.investors.find(i => i.id == portfolio.investor);
    var manager = this.props.managers.find(m => m.id == portfolio.manager);
    var image = <img />;//this.props.user == 0 ? <img src={"../manager/" + manager.img} className="avatar" /> : <img src={"../investor/" + investor.img} className="avatar" />;
    var info;
    if (this.props.user == 0){
      if (manager === undefined)
        return <p> Loading... </p>
      info = (
        <div>
          <h3>Manager</h3>
          <h4>{manager.name} {manager.surname}</h4>
          {/* <p>New client. 1   days on platform</p> */}
          <p>{manager.age} years old</p>
          <p>manager id 50{manager.id}00{manager.id}</p>
        </div>
      );
    } else{
      if (investor === undefined)
        return <p> Loading... </p>
      info = (
        <div>
          <h3>Investor</h3>
          <h4>{investor.name} {investor.surname}</h4>
          <p>New client. 1   days on platform</p>
          <p>{investor.age} years old</p>
          <p>client id 50{investor.id}00{investor.id}</p>
        </div>
      );
    }
    var totalValue = (this.props.currentCurrencyPrices.find(c => c.name == portfolio.currency) || {price: 0}).price * portfolio.value;
    var currentCurrency = this.props.currentCurrencyPrices.find(c => c.name == this.props.currentCurrency) || {price: 0};
    var currencies = this.props.currentCurrencyPrices.map((c, i) =>
      <option key={i} value={c.name}>{c.name}</option>
    );
    var currenciesList = portfolio.currencies.map(currency => {
      var price = (this.props.currentCurrencyPrices.find(c => c.name == currency.currency) || {price: 0}).price;

      return {
        id: currency.id,
        type: currency.type,
        number: "",
        currency: currency.currency,
        percent_portfolio: currency.percent,
        amount: (currency.percent / 100 * totalValue / price).toFixed(3),
        value: (currency.percent / 100 * totalValue / currentCurrency.price).toFixed(3) + " " + currentCurrency.name,
        analysis: currency.analysis,
        comments: currency.comments,
      };
    });

    return (
      <div>
        <div className="second-header" style={{height: 115}}>
          <div className="container">
            <div className="title">
              <h2>Porfolio</h2>
              <p className="grey">Total value</p>
            </div>
            <div className="description">
              <h2>{(totalValue / currentCurrency.price).toFixed(3) + " " + currentCurrency.name}</h2>
              <select value={this.props.currentCurrency} onChange={setCurrency.bind(this)}>
                {currencies}
              </select>
            </div>
          </div>
        </div>
        {/* {this.renderBackButton()} */}
        <div className="container">
          <div className="box">
            <div className="circle left">
              {image}
            </div>
            <div className="third">
              {info}
            </div>
            <div className="row-padding">
              <button className="continue">Start chat</button>
            </div>
            <p>Target value: {portfolio.value}{portfolio.currency}</p>
            <p>Term 4 month</p>
            <p>Risk profile: 25%</p>
            <p>Target earning rate</p>
            {/* <img className="portfolio" src="../portfolio.jpg" />
            <div className="row-padding">
              <button className="back right" onClick={() => this.prevousPage()}>Delete</button>
            </div> */}
          </div>
          <div className="box">
            <Sortable
              listings={currenciesList}
              setPage={setPage.bind(this)}
              currencySelector={
                <select value={this.props.currentCurrency} onChange={setCurrency.bind(this)}>
                  {
                    this.props.currentCurrencyPrices.map((c, i) =>
                      <option key={i} value={c.name}>{c.name}</option>
                    )
                  }
                </select>
              }
            />
          </div>
        </div>
      </div>
    );
  }
}


export default connect(a => a)(PortfolioPage);