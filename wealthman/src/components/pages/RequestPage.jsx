import React, { Component } from 'react';
import { setReduxState } from '../../redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Sortable from '../Sortable.jsx';
import myDate from '../myDate.jsx';
import { api, setPage, setCurrency, previousPage } from '../helpers';

class RequestPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      portfolios: [],
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
    var request = this.props.requests.find(r => r.id == this.props.match.params.id);
    if (request === undefined)
      return <p> Loading... </p>
    var investor = this.props.user == 1 ? this.props.investors.find(i => i.id == request.investor) : this.props.managers.find(i => i.id == request.manager);
    if (investor === undefined)
      return <p> Loading... </p>
    const name = <h4>{investor.name} {investor.surname}</h4>;
    const age = <p>{investor.age} years old</p>;
    console.log(investor);
    var buttons = request.status == "accepted" ?
    (
      <div className="row-padding">
      <Link to={"/accept"} onClick={() => this.setPage("accept")}>
      <button className="continue right">Portfolio preview</button>
      </Link>
      </div>
      ) : "";
    if (this.props.user == 0) {
      let actionButtons;
      if (request.status === 'pending') 
        actionButtons =
          <div>
            <Link to={"/decline/" + this.props.match.params.id} onClick={() => this.setPage("decline/" + this.props.match.params.id)}>
                <button className="back right">Decline</button>
              </Link>
            <button className="continue" onClick={() => this.accept()}>Accept</button>
          </div>;
      else if (request.status === 'waiting for transaction')
        actionButtons =
          <div>
            <Link to={"/decline/" + this.props.match.params.id} onClick={() => this.setPage("decline/" + this.props.match.params.id)}>
                <button className="back right">Decline</button>
              </Link>
            <button className="continue" onClick={() => setPage('money/' + request.id)}>Send money</button>
          </div>
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
                <p>user id #<b>{investor.id}</b></p>
              </div>
              <div className="third text-right">
                <p>request number #<b>{request.id}</b></p>
                <p>created: <b>{new myDate(request.date).niceTime()}</b></p>
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
                {actionButtons}
              </div> : ''}
            </div>
          </div>
        </div>
        );
      }
    if (this.props.user == 1 && (request.status === 'waiting' || request.status === 'pending'))
      return (
        <div>
      {/* {this.renderBackButton()} */}
      <div className="container">
        <div className="first-tab">
          <div className="box">
            <div className="circle left">
              <img src={''} className="avatar" />
              </div>
              <div className="third">
                <h4>{investor.name} {investor.surname}</h4>
                <p>user id #<b>{investor.id}</b></p>
              </div>
              <div className="third text-right">
                <p>request number #<b>{request.id}</b></p>
                <p>created: <b>{new myDate(request.date).niceTime()}</b></p>
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
              <Link to={"/decline/" + this.props.match.params.id} onClick={() => this.setPage("decline/" + this.props.match.params.id)}>
                <button className="back right">Decline</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>);
    if (request.status === 'declined')
      return (
        <div className="container">
          <div className="first-tab">
            <div className="box">
              <h2>Request declined</h2>
              <Link to="/requests">
                <button className="back" onClick={() => previousPage()}>Back</button>
              </Link>
            </div> 
          </div> 
        </div>
      ); 
    return (
      <div className="container">
        <div className="first-tab">
          <div className="box">
          Page cannot be rendered properly, data for developers:
          <pre>
            Usertype: {this.props.user}
            <br />
            Request status: {request.status}
            <br />
            Request id: {request.id}
          </pre>
          </div>
        </div>
      </div>
      )
  }
}
export default connect(a => a)(RequestPage);


