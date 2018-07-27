import React, { Component } from 'react';

import { Link } from 'react-router-dom';
import Cards from '../../../dashboards/Cards';
import Person from '../../../dashboards/Person';

export default class InvestorPortfolioRevision extends Component {
  acceptPortfolio() {
    setPage('signagreement/' + this.state.request.id);
  }
  render() {
    return <div>
      <Person requestData={this.props.requestData}/>
      <Cards
        cards={[{
          subtitle: 'Manager reviewd portfolio and waiting for you reaction',
        }]}
      />
      <Graphics
       pie={{
         title: 'Portfolio allocation',
         datasets: [{
           inCircleValue: this.props.requestData.request.value,
           inCircleTitle: 'Eth',
           data: this.props.requestData.portfolio.currencies.sort((a, b) => a.percent > b.percent ? -1 : 1).map(currency => { return {
             header: currency.percent + '% ' + currency.currency,
             value: currency.percent
           }})
         }]
       }}
       main={{
         title: 'Portfolio value on historical data (hardcode)',
         datasets: [{
           title: 'Jun 22 - Jul 16, 2018',
           data: [{
             value: 1,
             title: '1-Jul-15'
           },{
             value: 2,
             title: '2-Jul-15'
           },{
             value: 3,
             title: '3-Jul-15'
           },{
             value: 8,
             title: '4-Jul-15'
           },{
             value: 5,
             title: '5-Jul-15'
           },{
             value: 3,
             title: '6-Jul-15'
           },{
             value: 7,
             title: '7-Jul-15'
           },]
         }]
       }}
     />
      <Cards
        whiteBg={true}
        cards={[{
          title: <Link to={'/decline/' + this.props.requestData.request.id} style={{color: 'inherit', textDecoration: 'none'}}>Decline</Link>,
          state: 'bad'
        }, {
          title: 'Request another portfolio',
          subtitle: '(don\'t work yet)'
        }, {
          title: <Link to={'/signagreement/' + this.props.requestData.request.id} style={{color: 'inherit', textDecoration: 'none'}}>Accept</Link>,
          state: 'good'
        }]}
      />
    </div>
  }
}
