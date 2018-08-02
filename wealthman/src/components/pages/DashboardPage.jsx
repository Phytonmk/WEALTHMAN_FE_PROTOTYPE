import React, { Component } from 'react';
import { setReduxState } from '../../redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { api, setPage, getCookie, setCurrency, previousPage, niceNumber } from '../helpers';
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
      clients: '?',
      clientsApplications: '?',
      profileViews: '?',
      aum: {
        value: 0,
        earning: 0,
        change: 0,
        grpahic: []
      },
      portfolios: [],
    }
  }
  componentWillMount() {
    let usertype = ''
    switch (getCookie('usertype') * 1) {
      case 0:
        usertype = 'investor'
        break
      case 1:
        usertype = 'manager'
        break
      case 3:
        usertype = 'company'
        break
    }
    api.get('my-dashboard')
      .then((res) => {
        console.log(res.data)
        this.setState(res.data)
      }).catch(console.log)
  }
  render() {
    return <div className="container">
      {getCookie('usertype') == 0 ? <InvstorPortfolioHeader dashboardMode={true} buttonLink={"/managers"} /> : ''}
      {getCookie('usertype') == 1 ? <h1>Dashboard Manager</h1> : ''}
      <Cards
        whiteBg={true}
        cards={[{
          title: this.state.clients,
          subtitle: 'Clients'
        },{
          title: this.state.clientsApplications,
          subtitle: 'Client applications'
        },{
          title: this.state.profileViews,
          subtitle: 'Profile views'
        }]}
      />
      {/*<SmartContract address={this.state.requestData.portfolio.smart_contract} />*/}
      <Graphics
        pie={{
          title: 'Current portfolios allocation',
          datasets: [{
            inCircleTitle: 'All',
            data: this.state.portfolios.length === 0 ? [] :
              [{
                header: 'Active',
                value: this.state.portfolios[this.state.portfolios.length - 1].active
              },{
                header: 'Archived',
                value: this.state.portfolios[this.state.portfolios.length - 1].archived
              },{
                header: 'In progress',
                value: this.state.portfolios[this.state.portfolios.length - 1].inProgress
              }]
          }]
        }}
        main={{
          title: 'Portfolios allocation history',
          onOneGraphic: true,
          datasets: [{
            data: this.state.portfolios.map((portfolio, i) => {
              return {
                value: portfolio.active,
                title: i + '-Jun-15'
              }
            })
          }, {
            data: this.state.portfolios.map((portfolio, i) => {
              return {
                value: portfolio.archived,
                title: i + '-Jun-15'
              }
            })
          }, {
            data: this.state.portfolios.map((portfolio, i) => {
              return {
                value: portfolio.inProgress,
                title: i + '-Jun-15'
              }
            })
          }]
        }}
        additional={{
          title: 'Aum Dinamics',
          subheaders: [{
            value: niceNumber(this.state.aum.value) + ' $',
            title: 'AUM',
            state: 'normal'
          },{
            value: niceNumber(this.state.aum.earning) + ' $',
            title: 'Earning',
          },{
            value: this.state.aum.change + '%',
            title: 'Change (1y)',
            state: this.state.aum.change < 0 ? 'bad' : 'good'
          }],
          datasets: [{
            title: 'Jun 22 - Jul 16, 2018',
            data: this.state.aum.grpahic.map((chunk) => {
              return {
                value: chunk.y,
                title: chunk.x + '-Jun-15'
              }
            })
          }]
        }}
      />
      <PageDevider />
      <ReportsAndDocuments />
    </div>
  }
}


export default connect(a => a)(DashboardPage);
