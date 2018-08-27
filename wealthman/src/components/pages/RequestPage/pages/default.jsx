import React, { Component } from 'react';

import Details from '../Details';
import Person from '../../../dashboards/Person';
import PageDevider from '../../../dashboards/PageDevider';
import Graphics from '../../../dashboards/Graphics';
import SmartContract from '../../../dashboards/SmartContract';
import Cards from '../../../dashboards/Cards';
import ReportsAndDocuments from '../../../dashboards/ReportsAndDocuments';
import PortfolioPreview from '../PortfolioPreview'

export default class DefaultPage extends Component {
  render() {
    return <div>
      <Person requestData={this.props.requestData}/>
      <Details request={this.props.requestData.request} />
      {this.props.requestData.portfolio ? 
        <PortfolioPreview requestData={this.props.requestData} /> : ''}
    </div>
    //  <ReportsAndDocuments />
    //  <SmartContract address="0xf9da7b07df04acfec77141567386f89f14b84d74" />
    //  <Cards 
    //    whiteBg={true}
    //    cards={[{
    //      title: 'Advisory',
    //      subtitle: 'Style'
    //    },{
    //      title: '8 day to expire',
    //      subtitle: 'Days'
    //    },{
    //      title: '10.02.2018',
    //      subtitle: 'Start date'
    //    },{
    //      title: '30.08.2018',
    //      subtitle: 'Finish date'
    //    },]}
    //  />
    //  <Cards 
    //    whiteBg={false}
    //    cards={[{
    //      title: 'Longterm investment grow',
    //      subtitle: 'Primary reason for investing'
    //    },{
    //      title: '100B $',
    //      subtitle: 'Balance portfolio'
    //    },{
    //      title: '10.8%',
    //      subtitle: 'Start date',
    //      state: 'Change (24h)'
    //    },{
    //      title: '2000 $',
    //      subtitle: 'Finish date',
    //      state: 'Total earnings'
    //    },]}
    //  />
    //  <Graphics
    //    pie={{
    //      title: 'Portfolios',
    //      datasets: [{
    //        title: 'All time',
    //        inCircleTitle: 'All',
    //        data: [{
    //          header: 'Active',
    //          value: 25
    //        },{
    //          header: 'Archived',
    //          value: 75
    //        },{
    //          header: 'In progress',
    //          value: 85
    //        }]
    //      }, {
    //        title: 'Yesterday',
    //        inCircleTitle: 'All',
    //        data: [{
    //          header: 'Active',
    //          value: 25
    //        },{
    //          header: 'Archived',
    //          value: 75
    //        },{
    //          header: 'In progress',
    //          value: 85
    //        },{
    //          header: 'Bumped',
    //          value: 50
    //        }]
    //      }]
    //    }}
    //    main={{
    //      title: 'Portfolio value',
    //      datasets: [{
    //        title: 'Jun 22 - Jul 16, 2018',
    //        data: [{
    //          value: 1,
    //          title: '1-Jul-15'
    //        },{
    //          value: 2,
    //          title: '2-Jul-15'
    //        },{
    //          value: 3,
    //          title: '3-Jul-15'
    //        },{
    //          value: 8,
    //          title: '4-Jul-15'
    //        },{
    //          value: 5,
    //          title: '5-Jul-15'
    //        },{
    //          value: 3,
    //          title: '6-Jul-15'
    //        },{
    //          value: 7,
    //          title: '7-Jul-15'
    //        },]
    //      },{
    //        title: 'May 29 - Jun 22, 2018',
    //        data: [{
    //          value: 11,
    //          title: '1-Jun-15'
    //        },{
    //          value: 2,
    //          title: '2-Jun-15'
    //        },{
    //          value: 13,
    //          title: '3-Jun-15'
    //        },{
    //          value: 18,
    //          title: '4-Jun-15'
    //        },{
    //          value: 5,
    //          title: '5-Jun-15'
    //        },{
    //          value: 13,
    //          title: '6-Jun-15'
    //        },{
    //          value: 17,
    //          title: '7-Jun-15'
    //        },]
    //      }]
    //    }}
    //    additional={{
    //      title: 'Aum Dinamics',
    //      subheaders: [{
    //        value: '100B $',
    //        title: 'AUM',
    //        state: 'normal'
    //      },{
    //        value: '13B $',
    //        title: 'Earning',
    //        state: 'bad'
    //      },{
    //        value: '13.1%',
    //        title: 'Change (1y)',
    //        state: 'good'
    //      }],
    //      datasets: [{
    //        title: 'Jun 22 - Jul 16, 2018',
    //        data: [{
    //          value: 1,
    //          title: '1-Jun-15'
    //        },{
    //          value: 2,
    //          title: '2-Jun-15'
    //        },{
    //          value: 3,
    //          title: '3-Jun-15'
    //        },{
    //          value: 8,
    //          title: '4-Jun-15'
    //        },{
    //          value: 5,
    //          title: '5-Jun-15'
    //        },{
    //          value: 3,
    //          title: '6-Jun-15'
    //        },{
    //          value: 7,
    //          title: '7-Jun-15'
    //        },]
    //      }]
    //    }}
    //  />
  }
}
