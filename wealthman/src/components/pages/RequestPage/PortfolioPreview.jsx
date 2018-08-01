import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Sortable2 from '../../Sortable2.jsx';
import LevDate from '../../LevDate.jsx';


let sortableHeader = [
  {
    property: "number",
    title: "#",
    width: "41px",
    type: "number",
  },
  {
    property: "icon",
    title: "icon",
    width: "41px",
    type: "unsortable",
  },
  {
    property: "currency",
    title: "currency",
    width: "100px",
  },
  {
    property: "percent",
    title: "percent",
    width: "100px",
    type: "number",
  },
  {
    property: "amount",
    title: "amount",
    width: "100px",
    type: "number",
  },
  {
    property: "analysis",
    title: "analysis",
    width: "100px",
  },
  {
    property: "comments",
    title: "comments",
    width: "100px",
  },
]

class PortfolioPreview extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const portfolios = [];
    let i = 0;
    for (let portfolio of this.props.portfolios) {
      for (let property in portfolio) {
        if (!portfolio[property]) {
          switch (property) {
            case 'analysis':
              portfolio[property] = 'no analysis';
            break;
            case 'comments':
              portfolio[property] = 'no comment';
            break;
            case 'amount':
              portfolio[property] = '0';
            break;
            case 'percent':
              portfolio[property] = '0';
            break;
            default:
              portfolio[property] = '';
          }
        }
        if (property === 'percent' && portfolio[property].toString().indexOf('%') === -1)
          portfolio[property] += ' %';
      }
      portfolio.id = ++i;
      portfolios.push(portfolio);
    }
    return (
      <div className="box">
        <Sortable2
          columns={sortableHeader}
          data={portfolios}
          navigation={true}
          maxShown={5}
        />
      </div>)
  }
}

export default PortfolioPreview;