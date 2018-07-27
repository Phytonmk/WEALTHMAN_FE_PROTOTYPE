
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class InvstorPortfolioHeader extends Component {
  render() {
    return <div className="investor-portfolio-header">
      <div>
        <h1>{this.props.dashboardMode ? 'Portfolios' : 'Active portfolio'}</h1>
        <p>{this.props.requestData ? ('#' + this.props.requestData.request.id) : ''}</p>
      </div>
      <div>
        <div>
          <h2>{this.props.value || '???'}</h2>
          <p>Total balance</p>
        </div>
        <Link to={this.props.buttonLink}>
          <button className="big-blue-button money-button">
            {this.props.dashboardMode ? 'add funds' : 'Whithdraw'}
          </button>
        </Link>
      </div>
    </div>
  }
}
