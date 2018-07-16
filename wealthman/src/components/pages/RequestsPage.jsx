import React, { Component } from 'react';
import { setReduxState } from '../../redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Sortable from '../Sortable.jsx';
import myDate from '../myDate.jsx';
import { api, setPage, setCurrency, prevousPage } from '../helpers';

const requests = [
    {
      type: "request",
      id: 0,
      investor: 0,
      manager: 6,
      date: "15:16 12-11-2017",
      value: 1,
      currency: "ETH",
      status: "cancelled",
    }
  ]

class RequestsPage extends Component {
  constructor(props) {
    super(props);
  
    this.state = {requests, managers: [], investors: [], gotData: false};
  }
  componentWillMount() {
    // console.log('componentWillMount');
    const component = this;
    api.post('requests')
      .then((res) => {
        component.setState({requests: res.data, managers: [], investors: [], gotData: true});
        for (let request of component.state.requests) {
          api.get('manager/' + request.manager)
            .then((res) => {
              const managers = [...component.state.managers];
              managers.push(res.data);
              component.setState({managers});
            })
            .catch(console.log);
          api.get('investor/' + request.investor)
            .then((res) => {
              const investors = [...component.state.investors];
              investors.push(res.data);
              console.log('data');
              component.setState({investors});
            })
            .catch(console.log);
        }
      })
      .catch(console.log);
  }
  render() {
    if (!this.state.gotData)
      return <div className="box loading"><p>Loading</p></div>
    console.log('render');
    var requests = this.state.requests.slice().map((request, index) => {
      var investor = (this.props.user == 1 ? this.state.investors.find(i => i.id == request.investor) : this.state.managers.find(i => i.id == request.manager)) || {};
      var date = new myDate(request.date);
      var registered;
      var daysInSystem;
      if (this.props.user == 1) {
        registered = new myDate(investor.registered);
        daysInSystem = registered.pastMonths();
      }
      return {
        type: "request",
        id: request.id,
        number: index,
        img: '',//(this.props.user == 1 ? "investor/" : "manager/") + investor.img,
        // id_shown: "1000" + investor.id,
        name: (investor.name || '-') + ' ' + (investor.surname || ''),
        date: date.getTime(),
        // type_shown: daysInSystem >= 6 ? "old" : "new",
        // days: registered,
        // kyc: investor.kyc ? "yes" : "no",
        // value: (request.value * this.props.currentCurrencyPrices[request.currency]).toFixed(1) + " " + this.props.currentCurrency,
        status: request.status,
      };
    });
    return (
      <div>
        <div className="long-header"></div>
        <div className="container">
          <div className="box">
            <h2 className="text-center">My requests</h2>
            <Sortable
              listings={requests}
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

export default connect(a => a)(RequestsPage);