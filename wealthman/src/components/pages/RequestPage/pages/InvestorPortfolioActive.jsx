import React, { Component } from 'react';

import MyDate from '../../../MyDate';

import { Link } from 'react-router-dom';
import Cards from '../../../dashboards/Cards';
import Person from '../../../dashboards/Person';
import PageDevider from '../../../dashboards/PageDevider';
import Graphics from '../../../dashboards/Graphics';
import ReportsAndDocuments from '../../../dashboards/ReportsAndDocuments';
import SmartContract from '../../../dashboards/SmartContract';
import InvstorPortfolioHeader from '../../../dashboards/InvstorPortfolioHeader';


export default class InvestorPortfolioActive extends Component {
  render() {
    return <div>
      <InvstorPortfolioHeader requestData={this.props.requestData} buttonLink={"/withdraw/" + this.props.requestData.request._id} />
      <Cards
        whiteBg={true}
        cards={[{
          title: this.props.requestData.request.service,
          subtitle: 'Style'
        },{
          title: this.props.requestData.request.period,
          subtitle: 'Days'
        },{
          title: new MyDate(this.props.requestData.request.contract_deployment || 0).niceTime(),
          subtitle: 'Start date'
        },{
          title: new MyDate(new Date(this.props.requestData.request.contract_deployment || 0).getTime() + 1000 * 60 * 60 * 24 * this.props.requestData.request.period).niceTime(),
          subtitle: 'Finish date'
        }]}
      />
      <Cards
        cards={[{
          title: '?',
          subtitle: 'Primary reason for investing'
        },{
          title: '?',
          subtitle: 'Balance portfolio'
        },{
          title: '? %',
          subtitle: 'Change (24h)'
        },{
          title: '? $',
          subtitle: 'Total earnings'
        }]}
      />
      <SmartContract address={this.props.requestData.portfolio.smart_contract} />
      <Graphics
       pie={{
         title: 'Portfolio allocation',
         datasets: [{
           title: 'Current',
           inCircleValue: this.props.requestData.request.value,
           inCircleTitle: 'Eth',
           data: this.props.requestData.portfolio.currencies.sort((a, b) => a.percent > b.percent ? -1 : 1).map(currency => { return {
             header: currency.percent + '% ' + currency.currency,
             value: currency.percent
           }})
         }]
       }}
       main={{
         title: 'Portfolio value (hardcode)',
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
      <PageDevider />
      <Person requestData={this.props.requestData}/>
      <ReportsAndDocuments />
    </div>
  }
}
 