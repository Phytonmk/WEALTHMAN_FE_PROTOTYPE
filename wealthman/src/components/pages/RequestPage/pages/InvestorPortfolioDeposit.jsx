import React, { Component } from 'react';

import { Link } from 'react-router-dom';
import Cards from '../../../dashboards/Cards';
import Person from '../../../dashboards/Person';

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
          title: <Link to={'/money/' + this.props.requestData.request._id} style={{color: 'inherit', textDecoration: 'none'}}>Go to deposit page</Link>,
        }]}
      />
    </div>
  }
}
