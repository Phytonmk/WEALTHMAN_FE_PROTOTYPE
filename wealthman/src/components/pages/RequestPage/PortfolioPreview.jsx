import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Sortable2 from '../../Sortable2.jsx';
import myDate from '../../myDate.jsx';

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
    return (
      <div className="box">
        <Sortable2
          columns={sortableHeader}
          data={this.props.portfolios}
          navigation={true}
          maxShown={5}
        />
      </div>)
  }
}

export default PortfolioPreview;