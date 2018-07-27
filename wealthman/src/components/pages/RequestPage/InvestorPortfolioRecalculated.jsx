import React, { Component } from 'react';

import { Link } from 'react-router-dom';
import Cards from '../../../dashboards/Cards';
import Person from '../../../dashboards/Person';

export default class InvestorPortfolioRecalculated extends Component {
  acceptPortfolio() {
    setPage('signagreement/' + this.state.request.id);
  }
  render() {
    return <div>
      <Person requestData={this.props.requestData}/>
      <Cards
        whiteBg={true}
        cards={[{
          subtitle: 'Portfolio is under recalculation now, whait wile this process is not done',
        }]}
      />
    </div>
  }
}
