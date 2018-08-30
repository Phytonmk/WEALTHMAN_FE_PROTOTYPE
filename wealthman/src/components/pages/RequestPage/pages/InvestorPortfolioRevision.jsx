import React, { Component } from 'react';

import { Link } from 'react-router-dom';
import Cards from '../../../dashboards/Cards';
import Person from '../../../dashboards/Person';
import PortfolioPreview from '../PortfolioPreview';

export default class InvestorPortfolioRevision extends Component {
  acceptPortfolio() {
    setPage('signagreement/' + this.state.request._id);
  }
  render() {
    return <div class="padding-bottom-container">
      <Person requestData={this.props.requestData}/>
      <Cards
        cards={[{
          subtitle: 'Manager reviewd portfolio and waiting for you reaction',
        }]}
      />
      {this.props.requestData.portfolio ? 
        <PortfolioPreview requestData={this.props.requestData} /> : ''}
      <Cards
        whiteBg={true}
        cards={[{
          title: <Link to={'/decline/' + this.props.requestData.request._id} style={{color: 'inherit', textDecoration: 'none'}}>Decline</Link>,
          state: 'bad'
        }, {
          title: 'Request another portfolio',
          subtitle: '(don\'t work yet)'
        }, {
          title: <Link to={'/signagreement/' + this.props.requestData.request._id} style={{color: 'inherit', textDecoration: 'none'}}>Accept</Link>,
          state: 'good'
        }]}
      />
    </div>
  }
}
