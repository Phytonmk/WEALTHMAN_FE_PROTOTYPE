import React, { Component } from 'react';

import { Link } from 'react-router-dom';
import Cards from '../../../dashboards/Cards';
import Person from '../../../dashboards/Person';
import PortfolioPreview from '../PortfolioPreview'

import { api, setPage } from '../../../helpers'

export default class InvestorPortfolioProposed extends Component {
  requestAnother() {
    api.post('portfolio/request-another/' + this.props.requestData.request._id)
      .then(() => {
        setPage('requests')
      })
      .catch(console.log)
  }
  render() {
    return <div className="padding-bottom-container">
      <Person requestData={this.props.requestData}/>
      <Cards
        cards={[{
          subtitle: 'Manager created portfolio and waiting for you reaction',
        }]}
      />
      {this.props.requestData.portfolio ? 
        <PortfolioPreview requestData={this.props.requestData} /> : ''}
      <Cards
        whiteBg={true}
        cards={[{
          title: <Link to={'/decline/' + this.props.requestData.request._id} style={{color: 'inherit', textDecoration: 'none'}}>Decline</Link>,
          state: 'bad',
          buttonBorders: true
        }, {
          title: <a style={{cursor: 'pointer'}} onClick={() => this.requestAnother()}>Request another portfolio</a>,
        }, {
          title: <Link to={'/signagreement/' + this.props.requestData.request._id} style={{color: 'inherit', textDecoration: 'none'}}>Accept</Link>,
          state: 'good',
          buttonBorders: true
        }]}
      />
    </div>
  }
}
