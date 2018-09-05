import React, { Component } from 'react';
import { setReduxState } from '../../../redux';
import { connect } from 'react-redux';
import LevDate from '../../LevDate.jsx';
import { api, setPage, setCurrency, previousPage } from '../../helpers';

import DefaultPage from './pages/default'

import InvestorPortfolioProposed from './pages/InvestorPortfolioProposed'
import InvestorPortfolioRevision from './pages/InvestorPortfolioRevision'
import InvestorPortfolioDeposit from './pages/InvestorPortfolioDeposit'
import InvestorPortfolioActive from './pages/InvestorPortfolioActive'
import InvestorPortfolioRecalculated from './pages/InvestorPortfolioRecalculated'

import ManagerPortfolioActive from './pages/ManagerPortfolioActive'
import ManagerPortfolioPending from './pages/ManagerPortfolioPending'
import ManagerInvitingPending from './pages/ManagerInvitingPending'

import CompanyInvitingPending from './pages/CompanyInvitingPending'
import CompanyPortfolioPending from './pages/CompanyPortfolioPending'

class RequestPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gotData: false,
      portfolios: [],
      stocks: [],
      draftExists: false
    }
  }
  componentWillMount() {
    api.post('get-request/' + this.props.match.params.id)
      .then((res) => {
        this.setState(Object.assign({gotData: true}, res.data));
      })
      .catch(console.log);
  }
  render() {
    if (!this.state.gotData)
      return <p> Loading... </p>;

    let Page = DefaultPage;

    switch (this.props.user) {
      case 0:
        switch(this.state.request.status) {
          case 'proposed':
            Page = InvestorPortfolioProposed;
          break;
          case 'revision':
            Page = InvestorPortfolioRevision;
          break;
          case 'waiting for deposit':
            Page = InvestorPortfolioDeposit;
          break;
          case 'active':
            Page = InvestorPortfolioActive;
          break;
          // case 'review':
          //   Page = InvestorPortfolioRevision;
          // break;
          case 'recalculated':
            Page = InvestorPortfolioRecalculated;
          break;
        }
      break;
      case 1:
        if (this.state.request.type === 'portfolio') {
          if (this.state.request.status === 'pending') {
            Page = ManagerPortfolioPending;
          } else if (this.state.request.status === 'active') {
            Page = ManagerPortfolioActive;
          }
        } else if (this.state.request.type === 'inviting') {
          if (!this.state.request.initiatedByManager)
            Page = ManagerInvitingPending;
        }  
      break;
      case 3:
        if (this.state.request.type === 'portfolio') {
          if (this.state.request.status === 'pending') {
            Page = CompanyPortfolioPending;
            ;
          }
        } else if (this.state.request.type === 'inviting') {
          if (this.state.request.initiatedByManager)
            Page = CompanyInvitingPending;
        }  
      break;
    }

    return  <div className="container">
              <Page
                requestData={this.state}
              />
            </div>
  }
}
export default connect(a => a)(RequestPage);
