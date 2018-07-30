import React, { Component } from 'react';

import { Link } from 'react-router-dom';
import Cards from '../../../dashboards/Cards';
import Person from '../../../dashboards/Person';
import Details from '../Details';
import ManagersList from '../ManagersList';

export default class InvestorPortfolioDeposit extends Component {
  acceptPortfolio() {
    setPage('signagreement/' + this.state.request._id);
  }
  render() {
    return <div>
      <Person requestData={this.props.requestData}/>
      <Cards
        whiteBg={true}
        cards={[{
          subtitle: 'Select a manager to relay user request'
        }]}
      />
      <Details request={this.props.requestData.request} />
      <ManagersList request={this.props.requestData.request._id} company={this.props.requestData.company._id}/>
    </div>
  }
}
