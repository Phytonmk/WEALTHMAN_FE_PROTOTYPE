import React, { Component } from 'react';
import { setReduxState } from '../../redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { api, setPage, getCookie, setCurrency, previousPage, niceNumber } from '../helpers';
import LevDate from '../LevDate'


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
      dates: []
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
    if (usertype === 'manager') {
      api.get('my-dashboard')
        .then((res) => {
          // console.log(res.data)
          this.setState(res.data)

        }).catch(console.log)
    }
  }
  render() {
    if (getCookie('usertype') == 0)
      return <div className="container">
        <InvstorPortfolioHeader dashboardMode={true} buttonLink={"/managers"} />
        <p>Investors Summary are not created yet</p>
      </div>
    return <div className="container">
      {getCookie('usertype') == 0 ? <InvstorPortfolioHeader dashboardMode={true} buttonLink={"/managers"} /> : ''}
      {getCookie('usertype') == 1 ? <h1 className="row-padding">Dashboard Manager</h1> : ''}
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
        graphics={[{
          type: 'line',
          title: 'Aum Dinamics',
          subheaders: [{
            value: niceNumber(this.state.aum.value) + ' $',
            title: 'AUM',
            state: 'normal'
          },{
            value: niceNumber(this.state.aum.earning) + ' $',
            title: 'Earning',
          },{
            value: this.state.aum.change == null ? 'no cahnge' : this.state.aum.change + '%',
            title: `Change (${new LevDate(this.state.aum.changePeriod).pastNice()})`,
            state: this.state.aum.change == null ? 'common' : (this.state.aum.change < 0 ? 'bad' : 'good')
          }],
          lines: [{
            data: !this.state.aum.grpahic ? [] : this.state.aum.grpahic.map((chunk, i) => {
              return {
                value: chunk,
                title: this.state.dates[i]
              }
            })
          }]
        }, {
          type: 'pie-line',
          pie: {
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
          },
          line: {
            title: 'Remuneration dynamic',
            lines: !this.state.portfolios ? [] : [{
              data: this.state.portfolios.map((portfolio, i) => {
                return {
                  value: portfolio.active,
                  title: this.state.dates[i]
                }
              })
            }, {
              data: this.state.portfolios.map((portfolio, i) => {
                return {
                  value: portfolio.archived,
                  title: this.state.dates[i]
                }
              })
            }, {
              data: this.state.portfolios.map((portfolio, i) => {
                return {
                  value: portfolio.inProgress,
                  title: this.state.dates[i]
                }
              })
           }]
          }
        }, {
          type: 'line',
          title: 'Aum Dinamics',
          lines: [{
            title: 'Total remuneration accrued',
            data: !this.state.comissions || !this.state.comissions.accrued ? [] : this.state.comissions.map((chunk, i) => {
              return {
                value: chunk,
                title: this.state.dates[i]
              }
            })
          }, {
            title: 'Total remuneration paid',
            data: !this.state.comissions || !this.state.comissions.paid ? [] : this.state.comissions.map((chunk, i) => {
              return {
                value: chunk,
                title: this.state.dates[i]
              }
            })
          }]
        }]}
      />
      <PageDevider />
      <ReportsAndDocuments />
    </div>
  }
}


export default connect(a => a)(DashboardPage);

//        additional={{
//          title: 'Aum Dinamics',
//          subheaders: [{
//            value: niceNumber(this.state.aum.value) + ' $',
//            title: 'AUM',
//            state: 'normal'
//          },{
//            value: niceNumber(this.state.aum.earning) + ' $',
//            title: 'Earning',
//          },{
//            value: this.state.aum.change == null ? 'no cahnge' : this.state.aum.change + '%',
//            title: `Change (${new LevDate(this.state.aum.changePeriod).pastNice()})`,
//            state: this.state.aum.change == null ? 'common' : (this.state.aum.change < 0 ? 'bad' : 'good')
//          }],
//          datasets: [{
//            title: 'Jun 22 - Jul 16, 2018',
//            data: !this.state.aum.grpahic ? [] : this.state.aum.grpahic.map((chunk, i) => {
//              return {
//                value: chunk,
//                title: i + '-Jun-15'
//              }
//            })
//          }]
//        }}
