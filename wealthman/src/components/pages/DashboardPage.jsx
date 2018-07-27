import React, { Component } from 'react';
import { setReduxState } from '../../redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { api, setPage, setCurrency, previousPage } from '../helpers';
// import Sortable from '../Sortable'

import InvstorPortfolioHeader from '../dashboards/InvstorPortfolioHeader'
import Cards from '../dashboards/Cards'
import SmartContract from '../dashboards/SmartContract'
import Graphics from '../dashboards/Graphics'
import PageDevider from '../dashboards/PageDevider'
import Person from '../dashboards/Person'
import ReportsAndDocuments from '../dashboards/ReportsAndDocuments'


class DashboardPage extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }
  render() {
    return <div className="container">
      <InvstorPortfolioHeader dashboardMode={true} buttonLink={"/managers"} />
      <Cards
        whiteBg={true}
        cards={[{
          title: '10',
          subtitle: 'Portfolios (hardcode)'
        },{
          title: '10',
          subtitle: 'New requests'
        },{
          title: '10',
          subtitle: 'Some stuff'
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
      {/*<SmartContract address={this.state.requestData.portfolio.smart_contract} />*/}
      <Graphics
        pie={{
          title: 'Portfolios',
          datasets: [{
            title: 'All time',
            inCircleValue: '10', // if not specified calculates as a sum of all values of the dataset
            inCircleTitle: 'All',
            data: [{
              header: 'Active',
              value: 25
            },{
              header: 'Archived',
              value: 75
            },{
              header: 'In progress',
              value: 85
            }]
          }, {
            title: 'Yesterday',
            inCircleTitle: 'All',
            data: [{
              header: 'Active',
              value: 25
            },{
              header: 'Archived',
              value: 75
            },{
              header: 'In progress',
              value: 85
            },{
              header: 'Bumped',
              value: 50
            }]
          }]
        }}
        main={{
          title: 'Portfolio value (all graphics hardcoded)',
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
          },{
            title: 'May 29 - Jun 22, 2018',
            data: [{
              value: 11,
              title: '1-Jun-15'
            },{
              value: 2,
              title: '2-Jun-15'
            },{
              value: 13,
              title: '3-Jun-15'
            },{
              value: 18,
              title: '4-Jun-15'
            },{
              value: 5,
              title: '5-Jun-15'
            },{
              value: 13,
              title: '6-Jun-15'
            },{
              value: 17,
              title: '7-Jun-15'
            },]
          }]
        }}
        additional={{
          title: 'Aum Dinamics',
          subheaders: [{
            value: '100B $',
            title: 'AUM',
            state: 'normal'
          },{
            value: '13B $',
            title: 'Earning',
            state: 'bad'
          },{
            value: '13.1%',
            title: 'Change (1y)',
            state: 'good'
          }],
          datasets: [{
            title: 'Jun 22 - Jul 16, 2018',
            data: [{
              value: 1,
              title: '1-Jun-15'
            },{
              value: 2,
              title: '2-Jun-15'
            },{
              value: 3,
              title: '3-Jun-15'
            },{
              value: 8,
              title: '4-Jun-15'
            },{
              value: 5,
              title: '5-Jun-15'
            },{
              value: 3,
              title: '6-Jun-15'
            },{
              value: 7,
              title: '7-Jun-15'
            },]
          }]
        }}
      />
      <PageDevider />
      <ReportsAndDocuments />
    </div>
  }
}


export default connect(a => a)(DashboardPage);
