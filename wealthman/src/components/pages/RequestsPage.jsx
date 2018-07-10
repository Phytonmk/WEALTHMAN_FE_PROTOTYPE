import React, { Component } from 'react';
import { setReduxState } from '../../redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Sortable from '../Sortable.jsx';
import myDate from '../myDate.jsx';
import { api, setPage, setCurrency, prevousPage } from '../helpers';

class RequestsPage extends Component {
  constructor(props) {
    super(props);
  
    this.state = {};
  }
  componentWillMount() {
    api.post('requests')
      .then((res) => {
        console.log('+++');
        console.log(res.data);
        setReduxState({requests: res.data});
      })
      .catch(e => console.log(e));
  }
  render() {
    var requests = this.props.requests.slice().map((request, index) => {
      var investor = (this.props.user == 1 ? this.props.investors.find(i => i.id == request.investor) : this.props.managers.find(i => i.id == request.manager)) || {};
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
        number: "",
        img: (this.props.user == 1 ? "investor/" : "manager/") + investor.img,
        // id_shown: "1000" + investor.id,
        name: investor.name + " " + investor.surname,
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