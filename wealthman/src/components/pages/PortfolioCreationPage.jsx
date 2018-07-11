import React, { Component } from 'react';
import { setReduxState } from '../../redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Sortable from '../Sortable.jsx';
import myDate from '../myDate.jsx';
import { api, setPage, setCurrency, prevousPage } from '../helpers';

let stocks = [];
let stockTableCacheIsOld = true;

class PortfolioCreationPage extends Component {
  constructor(props) {
    super(props);
  
    this.state = {
      selectedTokens: [],
      stocks: []
    };
  }
  componentWillMount() {
    api.get('stocks')
      .then((res) => {
        this.setState({stocks: res.data});
        setReduxState({tokens: res.data.map(token => { return {
          name: token.title,
          symbol: token.title,
          price_usd: 1,
          price_btc: token.volume,
          market_cap_usd: 1
        }})})
      })
      .catch(console.log)
    api.post('get-request/' + this.props.match.params.id)
      .then((res) => {
        setReduxState({requests: [res.data]});
      })
      .catch(console.log);
    api.post('portfolio/load', {
      request: this.props.match.params.id,
    })
      .then((res) => {
        stockTableCacheIsOld = true;
        const selectedTokens = [];
        for (let token of res.data.currencies) {
          selectedTokens.push(token.currency);
          this.setState({
            [token.currency + '-percent']: token.percent,
            [token.currency + '-amount']: token.amount,
            [token.currency + '-analysis']: token.analysis,
            [token.currency + '-comments']: token.comments,
          })
        }
        console.log(this.state);
        this.setState({selectedTokens});
      })
      .catch(e => {e.response.status.code !== 404 && console.log(e)});
  }
  removeFromList(name) {
    stockTableCacheIsOld = true;
    const selectedTokens = [...this.state.selectedTokens];
    if (selectedTokens.includes(name)) {
      selectedTokens.splice(selectedTokens.indexOf(name), 1);
      this.setState({selectedTokens});
    }
  }
  save(callback) {
    const sendData = [];
    for (let token of this.state.selectedTokens) {
      sendData.push({
        currency: token,
        percent: this.state[token + '-percent'] * 1,
        amount: this.state[token + '-amount'] * 1,
        analysis: this.state[token + '-analysis'],
        comments: this.state[token + '-comments'],
      });
    }
    api.post('portfolio/save', {
      request: this.props.match.params.id,
      currencies: sendData
    })
      .then(() => {
        if (typeof callback === 'function')
          callback();
        setPage('requests');
      })
      .catch(console.log);

  }
  send() {
    this.save(() => {
      api.post('pending-request/' + this.props.match.params.id)
        .catch(console.log);
    })
  }
  render() {
    var set = "USD";
    var titles = [
      {
        title: "#",
        tooltip: "number",
        class: "number",
      },
      {
        title: "Token",
        tooltip: "Token",
        class: "token",
      },
      {
        title: "last price, BTC",
        tooltip: "last price",
        class: "lastprice",
      },
      {
        title: "24 change, %",
        tooltip: "rating",
        class: "change24",
      },
      {
        title: "DHP",
        tooltip: "Dayli high price, BTC",
        class: "dhp",
      },
      {
        title: "DLP",
        tooltip: "Dayli low price, BTC",
        class: "dlpp",
      },
      {
        title: "Volume",
        tooltip: "Volume, BTC",
        class: "volume",
      },
      {
        title: "add",
        tooltip: "",
        class: "add",
      },
    ];

    if (stockTableCacheIsOld) {
      if (this.state.stocks.length > 0) {
        stockTableCacheIsOld = false;
        console.log('rebuild');
        stocks = this.state.stocks.map((stock, i) => { return {
          number: i,
          token: stock.title,
          lastprice: stock.last_price,
          change24: stock.change_percnt,
          dhp: stock.high_price,
          dlpp: stock.low_price,
          volume: stock.volume,
          add: this.state.selectedTokens.includes(stock.title) ? 'added' : 'add',
          noLink: true,
          onClick: (event, listings) => {
            if (event.target.textContent === 'add') {
              stockTableCacheIsOld = true;
              const selectedTokens = [...this.state.selectedTokens];
              selectedTokens.push(listings.token)
              this.setState({selectedTokens});
            }
          }
        }});
      }
    }
  var tokens = this.props.tokens.map((token, index) => <li key={index} style={this.state.selectedTokens.includes(token.name) ? {display: 'block'} : {display: 'none'}}>
        <div className="number">
          {index + 1}
        </div>
        <div className="currency">
          {token.name}
        </div>
        <div className="percent">
          <input value={this.state[token.name + '-percent']} onChange={(event) => this.setState({[token.name + '-percent']: event.target.value})} type="number"></input>
        </div>
        <div className="amount">
          <input value={this.state[token.name + '-amount']} onChange={(event) => this.setState({[token.name + '-amount']: event.target.value})} type="number"></input>
        </div>
        <div className="value">
          {set}
        </div>
        <div className="remove last" onClick={() => this.removeFromList(token.name)}>
          Remove
        </div>
        <div className="comments last">
          <input value={this.state[token.name + '-comments']} onChange={(event) => this.setState({[token.name + '-comments']: event.target.value})} type="text"></input>
        </div>
        <div className="analysis last">
          <input value={this.state[token.name + '-analysis']} onChange={(event) => this.setState({[token.name + '-analysis']: event.target.value})} type="text"></input>
        </div>
      </li>
    );
    var request = this.props.requests.find(r => r.id == this.props.match.params.id);
    if (request === undefined)
      return <p> Loading... </p>
    var investor = this.props.investors.find(i => i.id == request.investor);
    if (investor === undefined)
      return <p> Loading... </p>
    var name;
    var age;
    if (investor.kyc == "yes") {
      name = <h4>{investor.name} {investor.surname}</h4>;
      age = <p>{investor.age} years old</p>;
    }
    else {
      name = <h4>{investor.email}</h4>;
      age = <p>KYC unfullfilled</p>;
    }

    return (
      <div>
        <div className="container">
          <div className="box">
            <h3>Portfolio Creation</h3>

            <div className="circle left">
              <img src={"../investor/" + investor.img} className="avatar" />
            </div>
            <div className="third">
              {name}
              <p>New client. 1   days on platform</p>
              {age}
              <p>client id 50{investor.id}00{investor.id}</p>
            </div>
            <div className="third text-right">
              <p>request number {this.props.match.params.id}</p>
              <p>{request.date}</p>
            </div>
            <div className="row-padding">
              <Link to={"/chat"}>
                <button className="continue" onClick={() => this.setPage("chat")}>Start chat</button>
              </Link>
            </div>
            <p>Target value: {request.value}{request.currency}</p>
            <p>Term 4 month</p>
            <p>Risk profile: 25%</p>
            <p>Target earning rate</p>



            <ul className="token-listings">
              <li className="titles">
                <div className="number">
                  #
                </div>
                <div className="currency">
                  Currency
                </div>
                <div className="percent">
                  % in portfolio
                </div>
                <div className="amount">
                  Amount
                </div>
                <div className="value">
                  Value in set currency
                </div>
                <div className="remove last">
                  Remove
                </div>
                <div className="comments last">
                  Comments
                </div>
                <div className="analysis last">
                  Analysis
                </div>
              </li>
              {tokens}
            </ul>
          </div>
          <div className="box">
            <div className="row">
              <div className="half">
                <h4>Fee</h4>
                <ul>
                  <div className="row">
                    <input type="checkbox" />
                      С прибыли
                  </div>
                  <div className="row">
                    <input type="checkbox" />
                      С объема
                  </div>
                  <div className="row">
                    <input type="checkbox" />
                      За вход
                  </div>
                  <div className="row">
                    <input type="checkbox" />
                      За выход
                  </div>
                </ul>
              </div>
              <div className="half">
                <h4>Frequency for recalculation</h4>
                <input placeholder="no more than"></input>
              </div>
            </div>
            <div className="row">
              <input placeholder="Comments"></input>
            </div>
            <div className="row-padding">
              <button className="continue right margin" onClick={() => this.send()}>Send</button>
              <button className="continue right margin" onClick={() => this.save()}>Save</button>
              {/*<button className="continue right margin">Load Saved form</button>*/}
            </div>
          </div>
          <div className="box">
            {this.state.stocks.length > 0 && <div className="stocks-sortable"><Sortable
              titles={titles}
              listings={stocks}
              currencySelector={
                <select value={this.state.stocks[0].title} onChange={() => {}/*setCurrency.bind(this)*/}>
                  {
                    this.state.stocks.map((c, i) =>
                      <option key={i} value={c.title}>{c.title}</option>
                    )
                  }
                </select>
              }
            /></div>}
          </div>
        </div>
      </div>
    );
  }
}
export default connect(a => a)(PortfolioCreationPage);