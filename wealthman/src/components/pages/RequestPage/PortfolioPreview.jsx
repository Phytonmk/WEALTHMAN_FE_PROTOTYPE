import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Sortable from '../../Sortable.jsx';
import myDate from '../../myDate.jsx';


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

class PortfolioPreview extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="box">
        <Sortable
          titles={titles}
          listings={this.props.portfolios}
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
      </div>)
  }
}

export default PortfolioPreview;