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
import ManagerPortfolioPending from './pages/ManagerPortfolioPending'
import ManagerInvitingPending from './pages/ManagerInvitingPending'
import InvestorPortfolioRecalculated from './pages/InvestorPortfolioRecalculated'
import CompanyInvitingPending from './pages/CompanyInvitingPending'
import CompanyPortfolioPending from './pages/CompanyPortfolioPending'


// import Title from './Title';
// import Header from './Header';
// import Details from './Details';
// import Graphics from './Graphics';
// import PorfolioPreview from './PortfolioPreview';
// import ManagersList from './ManagersList';


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
    // const getPortfolio = (requestStatus) => {
    //   api.post('portfolio/load', {
    //     request: this.state.request.id,
    //     state: requestStatus === 'revision' ? 'draft' : 'active'
    //   })
    //     .then((res) => {
    //       if (res.data.exists) {
    //         const portfolios = res.data.portfolio.currencies.map(((portfolio, i) => { return {
    //           id: i,
    //           number: i,
    //           icon: '',
    //           currency: portfolio.currency,
    //           percent: portfolio.percent,
    //           amount: portfolio.amount,
    //           analysis: portfolio.analysis,
    //           comments: portfolio.comments
    //         }}));
    //         this.setState({portfolios});
    //         getStocks();
    //       }
    //     })
    //     .catch(console.log);
    // }
    // const getStocks = () => {
    //   api.get('stocks')
    //     .then((res) => {
    //       const state = Object.assign({}, this.state);
    //       for (let portfolio in state.portfolios) {
    //         state.portfolios[portfolio].icon = <img src={(res.data.find(stock => stock.name === state.portfolios[portfolio].currency) || {token_img: 'x'}).token_img} className="token-icon" />
    //       }
    //       console.log(state);
    //       this.setState(state);
    //     })
    //     .catch(console.log);
    // }
  }
  // acceptInviting() {
  //   api.post('company/accept-inviting', {
  //     company: this.state.company.id,
  //     request: this.state.request.id
  //   })
  //     .then(() => {
  //       setPage('account');
  //     })
  //     .catch(console.log);
  // }
  // acceptApply() {
  //   api.post('company/accept-apply', {
  //     manager: this.state.manager.id,
  //     request: this.state.request.id
  //   })
  //     .then(() => {
  //       setPage('account');
  //     })
  //     .catch(console.log);
  // }
  // acceptPortfolio() {
  //   setPage('signagreement/' + this.state.request.id);
  // }
  // acceptReview() {
  //   api.post('portfolio/accept-review/' + this.state.request.id)
  //     .then(() => {
  //       setPage('requests');
  //     })
  //     .catch(console.log);
  // }
  // declineReview () {
  //   api.post('portfolio/decline-review/' + this.state.request.id)
  //     .then(() => {
  //       setPage('requests');
  //     })
  //     .catch(console.log);
  // }
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
          case 'review':
            Page = InvestorPortfolioRevision;
          break;
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
            Page = InvestorPortfolioActive; // update!
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

    // let buttons = '';
    // switch (this.props.user) {
    //   case 0:
    //     switch(this.state.request.status) {
    //       case 'proposed':
    //         buttons = 
    //         <div className="row">
    //          <Link to="/requests">
    //            <button className="back">Back</button>
    //          </Link>
    //          <Link to={"/decline/" + this.props.match.params.id} onClick={() => this.setPage("decline/" + this.props.match.params.id)}>
    //            <button className="back right">Decline</button>
    //          </Link>
    //          <button className="continue" onClick={() => this.acceptPortfolio()}>Accept</button>
    //        </div>;
    //       break;
    //       case 'revision':
    //         buttons = 
    //           <div className="row-padding">
    //            <Link to="/requests">
    //              <button className="back">Back</button>
    //            </Link>
    //            <button className="continue right" onClick={() => this.acceptReview()}>Accept</button>
    //            <button className="back right" onClick={() => this.declineReview()}>Decline</button>
    //          </div>
    //       break;
    //       case 'waiting for deposit':
    //         buttons = 
    //           <div className="row-padding">
    //            <Link to="/requests">
    //              <button className="back">Back</button>
    //            </Link>
    //            <Link to={'/money/' + this.props.match.params.id}>
    //              <button className="continue right">Deposit page</button>
    //            </Link>
    //          </div>
    //       break;
    //       case 'active':
    //         buttons = 
    //           <div className="row-padding">
    //            <Link to="/requests">
    //              <button className="back">Back</button>
    //            </Link>
    //            <Link to={"/portfoliocreation/" + this.props.match.params.id}> 
    //              <button className="back right side-margin">Portfolio Allocation</button>
    //              <button className="back right side-margin">Recommendation history</button>
    //              <button className="continue right side-margin" onClick={() => alert('Unable to add funds in this version')}>Add funds</button>
    //              <button className="continue right side-margin" onClick={() => alert('Unable to withdraw in this version')}>Withdraw</button>
    //            </Link>
    //          </div>
    //       break;
    //     }
    //   break;
    //   case 1:
    //     switch(this.state.request.status) {
    //       case 'pending':
    //         if (this.state.request.type === 'portfolio')
    //           buttons = 
    //             <div className="row-padding">
    //              <Link to="/requests">
    //                <button className="back">Back</button>
    //              </Link>
    //              <Link to={"/portfoliocreation/" + this.props.match.params.id} onClick={() => this.setPage("portfoliocreation")}>
    //                <button className="continue right">{this.state.portfolios.length === 0 ? 'Create portfolio' : 'Edit portfolio'}</button>
    //              </Link>
    //              <Link to={"/decline/" + this.props.match.params.id} onClick={() => this.setPage("decline/" + this.props.match.params.id)}>
    //                <button className="back right">Decline</button>
    //              </Link>
    //            </div>
    //         else if (this.state.request.type === 'inviting' && !this.state.request.initiatedByManager) 
    //           buttons = 
    //             <div className="row-padding">
    //              <Link to="/requests">
    //                <button className="back">Back</button>
    //              </Link>
    //              <button className="continue right" onClick={() => this.acceptInviting()}>Accept</button>
    //              <Link to={"/decline/" + this.props.match.params.id} onClick={() => this.setPage("decline/" + this.props.match.params.id)}>
    //                <button className="back right">Decline</button>
    //              </Link>
    //            </div>
    //       break;
    //       case 'active':
    //         buttons = 
    //           <div className="row-padding">
    //            <Link to="/requests">
    //              <button className="back">Back</button>
    //            </Link>
    //            <Link to={"/portfoliocreation/" + this.props.match.params.id}> 
    //              <button className="continue right">{ /*draftExists*/false ? 'Edit review draft' : 'Review portfolio'}</button>
    //            </Link>
    //          </div>
    //       break;
    //     }
    //   break;
    //   case 3:
    //     if (this.state.request.type === 'inviting' && this.state.request.initiatedByManager) 
    //       buttons = 
    //         <div className="row-padding">
    //          <Link to="/requests">
    //            <button className="back">Back</button>
    //          </Link>
    //          <button className="continue right" onClick={() => this.acceptApply()}>Accept</button>
    //          <Link to={"/decline/" + this.props.match.params.id}>
    //            <button className="back right">Decline</button>
    //          </Link>
    //        </div>
    //   break;
    //   default:
    //           buttons = 
    //             <div className="row-padding">
    //              <Link to="/requests">
    //                <button className="back">Back</button>
    //              </Link>
    //            </div>

    // }
    // return (
    //   <div className="container">
    //     {/* <Title
    //       request={this.state.request}
    //       user={this.props.user}
    //       /> */}
    //     <div className="box">
    //       <Header 
    //         name={anotherPerson.name}
    //         img={anotherPerson.img}
    //         userId={anotherPerson.id}
    //         requestId={this.state.request.id}
    //         requestDate={this.state.request.date}
    //         buttons={buttons}
    //       />
    //     </div>
    //     <Details request={this.state.request} />
    //     {
    //       this.state.portfolios.length > 0 ?
    //       <PorfolioPreview
    //         portfolios={this.state.portfolios}
    //         currentCurrency={this.props.currentCurrency}
    //         currentCurrencyPrices={this.props.currentCurrencyPrices}
    //       /> : ''
    //     }
    //     {
    //       this.props.user === 3 && this.state.request.type === 'portfolio' ?
    //       <ManagersList
    //         company={this.state.company.id}
    //         request={this.state.request.id}
    //       /> : ''
    //     }
    //   </div>)
  }
}
export default connect(a => a)(RequestPage);
