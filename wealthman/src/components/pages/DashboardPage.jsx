import React, { Component } from 'react';
import { setReduxState } from '../../redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { api, setPage, setCurrency, prevousPage } from '../helpers';
import Sortable from '../Sortable'

import moment from 'moment';
import { PieChart, AreaChart } from 'react-easy-chart';

class DashboardPage extends Component {
  constructor(props) {
    super(props);
    this.props = {};
  }
  getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  }
  generateData() {
    const data = [];
    const xs = [];

    let date = moment('2015-1-1 00:00', 'YYYY-MM-DD HH:mm');
    for (let i = 1; i <= 20; i++) {
      xs.push(date.format('D-MMM-YY HH:mm'));
      date = date.add(1, 'hour');
    }
    xs.forEach((x) => {
      data.push({ x, y: this.getRandomArbitrary(0, 100) });
    });
    console.log(data);
    return data;
  }
  mouseOverHandler(d, e) {
    this.setState({
      showToolTip: true,
      top: e.y,
      left: e.x,
      value: d.value,
      key: d.data.key});
  }

  mouseMoveHandler(e) {
    if (this.state.showToolTip) {
      this.setState({top: e.y, left: e.x});
    }
  }

  mouseOutHandler() {
    this.setState({showToolTip: false});
  }

  createTooltip() {
    if (this.state.showToolTip) {
      return (
        <ToolTip
          top={this.state.top}
          left={this.state.left}
        >
          The value of {this.state.key} is {this.state.value}
        </ToolTip>
      );
    }
    return false;
  }
  genPoints() {
    const result = [];
    for (let i = 1; i <= 20; i++)
      result.push({ x: i +'-May-15', y: this.getRandomArbitrary(i * 5 - 20, i * 5 + 20) });
    return result;
  }
  render() {
    var currencies = this.props.currentCurrencyPrices.map((c, i) =>
      <option key={i} value={c.name}>{c.name}</option>
    );
    const currentCurrency = this.props.portfolioCurrencies[0];
    var currenciesList = this.props.portfolioCurrencies.map(currency => {
      var price = (this.props.currentCurrencyPrices.find(c => c.name == currency.currency) || {price: 0}).price;

      return {
        id: currency.id,
        type: currency.type,
        number: "",
        currency: currency.currency,
        percent_portfolio: currency.percent,
        amount: (currency.percent / 100 / price).toFixed(3),
        value: (currency.percent / 100 / currentCurrency.price).toFixed(3) + " " + currentCurrency.name,
        analysis: currency.analysis,
        comments: currency.comments,
      };
    });

    return(
      <div className="container">
        <div className="box">
          <AreaChart
            xType={'time'}
            axes
            xTicks={5}
            yTicks={3}
            areaColors={['#2ED155', '#2EA2D1', '#D5544B', 'yellow']}
            noAreaGradient
            tickTimeDisplayFormat={'%d %m'}
            interpolate={'cardinal'}
            width={1050}
            height={400}
            data={[this.genPoints(), this.genPoints(), this.genPoints()]}
          />
        </div>
        <div className="box">
          <div style={{display: 'inline-block', width: '300px', verticalAlign: 'top'}}>
          <PieChart
            data={[
              { key: 'A', value: this.getRandomArbitrary(0, 100), color: '#aaac84' },
              { key: 'B', value: this.getRandomArbitrary(0, 100), color: '#dce7c5' },
              { key: 'C', value: this.getRandomArbitrary(0, 100), color: '#e3a51a' }
            ]}
            size={300}
            innerHoleSize={100}
            mouseOverHandler={this.mouseOverHandler}
            mouseOutHandler={this.mouseOutHandler.bind(this)}
            mouseMoveHandler={this.mouseMoveHandler.bind(this)}
            padding={10}
            styles={this.styles}
          />
          </div>
          <div style={{display: 'inline-block', width: '700px'}}>
            <Sortable
              listings={currenciesList}
              setPage={() => {}}
              currencySelector={
                <select value={this.props.currentCurrency} onChange={() => {}}>
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


export default connect(a => a)(DashboardPage);