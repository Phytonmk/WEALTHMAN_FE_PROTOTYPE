import React, { Component } from 'react';
import { setReduxState } from '../../redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { api, setPage, getCookie, setCurrency, previousPage, niceNumber } from '../helpers';
import LevDate from '../LevDate'
import QSign from '../QSign'


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
      dates: [],
      commisions: []
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
    if (usertype === 'manager' || usertype === 'investor') {
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
        <Cards
          whiteBg={true}
          cards={[{
            title: this.state.portfoliosAmount,
            subtitle: 'Portfolios'
          },{
            title: this.state.eventsAndRequests,
            subtitle: 'Events and requests'
          },{
            title: this.state.reviewed,
            subtitle: <span>Reviewed 7d <QSign className="dashboards-qSign" tooltip="Number of clients reviewed your profile for last 7 days"/></span>
          }]}
        />
        <Graphics
          graphics={[{
            type: 'line',
            title: 'AUM Dynamics',
            subheaders: [{
              value: niceNumber(this.state.aum.value) + ' $',
              title: 'AUM',
              state: 'normal'
            },{
              value: niceNumber(this.state.aum.earning) + ' $',
              title: 'Earning',
            },{
              value: this.state.aum.change == null ? 'no change' : this.state.aum.change + '%',
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
                    header: <span>Active <b>{this.state.portfolios[this.state.portfolios.length - 1].active}</b></span>,
                    value: this.state.portfolios[this.state.portfolios.length - 1].active
                  },{
                    header: <span>Archived <b>{this.state.portfolios[this.state.portfolios.length - 1].archived}</b></span>,
                    value: this.state.portfolios[this.state.portfolios.length - 1].archived
                  },{
                    header: <span>In progress <b>{this.state.portfolios[this.state.portfolios.length - 1].inProgress}</b></span>,
                    value: this.state.portfolios[this.state.portfolios.length - 1].inProgress
                  }]
              }]
            },
            line: {
              title: 'Remuneration accrued',
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
          }]}
        />
        <PageDevider />
        <ReportsAndDocuments />
      </div>
    if (getCookie('usertype') == 1)
      return <div className="container">
        <h1 className="row-padding">Dashboard Manager</h1>
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
        <Graphics
          graphics={[{
            type: 'line',
            title: 'AUM Dynamics',
            subheaders: [{
              value: niceNumber(this.state.aum.value) + ' $',
              title: 'AUM',
              state: 'normal'
            },{
              value: niceNumber(this.state.aum.earning) + ' $',
              title: 'Earning',
            },{
              value: this.state.aum.change == null ? 'no change' : this.state.aum.change + '%',
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
                    header: <span>Active <b>{this.state.portfolios[this.state.portfolios.length - 1].active}</b></span>,
                    value: this.state.portfolios[this.state.portfolios.length - 1].active
                  },{
                    header: <span>Archived <b>{this.state.portfolios[this.state.portfolios.length - 1].archived}</b></span>,
                    value: this.state.portfolios[this.state.portfolios.length - 1].archived
                  },{
                    header: <span>In progress <b>{this.state.portfolios[this.state.portfolios.length - 1].inProgress}</b></span>,
                    value: this.state.portfolios[this.state.portfolios.length - 1].inProgress
                  }]
              }]
            },
            line: {
              title: 'Remuneration accrued',
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
            title: 'Remuneration',
            lines: [{
              title: 'Total remuneration accrued',
              data: this.state.commisions.map((chunk, i) => {
                return {
                  value: chunk.accrued,
                  title: this.state.dates[i]
                }
              })
            }, {
              title: 'Total remuneration paid',
              data: this.state.commisions.map((chunk, i) => {
                // console.log(chunk)
                return {
                  value: chunk.paid,
                  title: this.state.dates[i]
                }
              })
            }]
          }]}
        />
        <PageDevider />
        <ReportsAndDocuments />
      </div>
    return <p>Dashboard page is unsupported for current user type</p>
  }
}


export default connect(a => a)(DashboardPage);