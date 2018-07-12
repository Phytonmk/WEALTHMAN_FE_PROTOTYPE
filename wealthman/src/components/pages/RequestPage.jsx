import React, { Component } from 'react';
import { setReduxState } from '../../redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Sortable from '../Sortable.jsx';
import myDate from '../myDate.jsx';
import { api, setPage, setCurrency, prevousPage } from '../helpers';

class RequestPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      portfolios: []
    }
  }
  componentWillMount() {
    setReduxState({currentRequest: this.props.match.params.id});
    api.post('get-request/' + this.props.match.params.id)
      .then((res) => {
        const state = {};
        if (res.data.request)
          state.requests = [res.data.request];
        if (res.data.manager)
          state.managers = [res.data.manager];
        if (res.data.investor)
          state.investors = [res.data.investor];
        setReduxState(state);
      })
      .catch(console.log);
    api.post('portfolio/load', {request: this.props.match.params.id})
      .then((res) => {
        const portfolios = res.data.portfolio.currencies.map(((portfolio, i) => { return {
          number: i,
          currency: portfolio.currency,
          percent: portfolio.percent,
          amount: portfolio.amount,
          analysis: portfolio.analysis,
          comments: portfolio.comments,
          noLink: true
        }}));
        this.setState({portfolios});
      })
      .catch(console.log);
  }
  decline () {
    api.post('decline-request/' + this.props.match.params.id)
      .then((res) => {
        setPage('requests');
      })
      .catch(console.log);
  }
  accept() {
    setPage('signagreement/' + this.props.match.params.id);
  }
  render() {
    const titles = [
      {
        title: "#",
        tooltip: "number",
        class: "number",
      },
      {
        title: "currency",
        tooltip: "currency",
        class: "currency",
      },
      {
        title: "percent",
        tooltip: "percentr",
        class: "percent",
      },
      {
        title: "amount",
        tooltip: "amounter",
        class: "amount",
      },
      {
        title: "analysis",
        tooltip: "analysis",
        class: "analysis",
      },
      {
        title: "comments",
        tooltip: "comments",
        class: "comments",
      },
    ]
    console.log(this.state.portfolios);
    var request = this.props.requests.find(r => r.id == this.props.match.params.id);
    if (request === undefined)
      return <p> Loading... </p>
    var investor = this.props.user == 1 ? this.props.investors.find(i => i.id == request.investor) : this.props.managers.find(i => i.id == request.manager);
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

    var buttons = request.status == "accepted" ?
    (
      <div className="row-padding">
      <Link to={"/accept"} onClick={() => this.setPage("accept")}>
      <button className="continue right">Portfolio preview</button>
      </Link>
      </div>
      ) : "";
    if (this.props.user == 0)
      return (
        <div>
        <div className="container">
          <div className="first-tab">
            <div className="box">
              <div className="circle left">
                <img src={''} className="avatar" />
              </div>
              <div className="third">
                <h4>{investor.name} {investor.surname}</h4>
              </div>
              <div className="third text-right">
                <p>request number {this.props.currentRequest}</p>
                <p>{request.date}</p>
                <p className={request.status}>{request.status}</p>
              </div>
              <div className="row-padding">
                <Link to={"/chat"}>
                  <button className="continue" onClick={() => this.setPage("chat")}>Start chat</button>
                </Link>
              </div>
              {buttons}
              </div>
            {this.state.portfolios.length > 0 ? 
              <div className="box">
                <h2>Portfolio preview</h2>
                <Sortable
                  titles={titles}
                  listings={this.state.portfolios}
                  setPage={() => {}}
                  currencySelector={
                    <select value={this.props.currentCurrency} onChange={() => {}}>
                      {
                        this.props.currentCurrencyPrices.map(c =>
                          <option value={c.name}>{c.name}</option>
                        )
                      }
                    </select>
                  }
                />
                <br />
                <button className="back" onClick={() => this.decline()}>Decline</button>
                <button className="continue" onClick={() => this.accept()}>Accept</button>
              </div> : ''}
            </div>
          </div>
        </div>
        );
    return (
      <div>
    {/* {this.renderBackButton()} */}
    <div className="container">
      <div className="first-tab">
        <div className="box">
          <div className="circle left">
            <img src={("../investor/") + investor.img} className="avatar" />
            </div>
            <div className="third">
              {name}
              <p>New client. 1   days on platform</p>
              {age}
              <p>client id 50{investor.id}00{investor.id}</p>
            </div>
            <div className="third text-right">
              <p>request number {this.props.currentRequest}</p>
              <p>{request.date}</p>
            </div>
            <div className="row-padding">
              <Link to={"/chat"}>
                <button className="continue" onClick={() => this.setPage("chat")}>Start chat</button>
              </Link>
            </div>
            {/*<p>Target value: {request.value}{request.currency}</p>
              <p>Term 4 month</p>
              <p>Risk profile: 25%</p>
              <p>Target earning rate</p>*/}
            <div className="row-padding">
              <Link to={"/portfoliocreation/" + this.props.match.params.id} onClick={() => this.setPage("portfoliocreation")}>
                <button className="continue right">Create portfolio</button>
              </Link>
            <Link to={"/decline"} onClick={() => this.setPage("decline")}>
              <button className="back right">Decline</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  </div>);
  }
}
export default connect(a => a)(RequestPage);


