import React, { Component } from 'react';
import { setReduxState } from '../../../redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import myDate from '../../myDate.jsx';
import { api, setPage, setCurrency, previousPage } from '../../helpers';

import Header from './Header';
import PorfolioPreview from './PortfolioPreview';
import ManagersList from './ManagersList';

class RequestPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gotData: false,
      portfolios: [],
      stocks: []
    }
  }
  componentWillMount() {
    const getRequest = () => {
      setReduxState({currentRequest: this.props.match.params.id});
      api.post('get-request/' + this.props.match.params.id)
        .then((res) => {
          this.setState(Object.assign({gotData: true}, res.data));
          if (res.data.request.type === 'portfolio') {
            getPortfolio();
          }
        })
        .catch(console.log);

    }
    const getPortfolio = () => {
      api.post('portfolio/load', {request: this.state.request.id})
        .then((res) => {
          console.log(res.data);
          if (res.data.exists) {
            const portfolios = res.data.portfolio.currencies.map(((portfolio, i) => { return {
              id: i,
              number: i,
              icon: '',
              currency: portfolio.currency,
              percent: portfolio.percent,
              amount: portfolio.amount,
              analysis: portfolio.analysis,
              comments: portfolio.comments
            }}));
            this.setState({portfolios});
            getStocks();
          }
        })
        .catch(console.log);
    }
    const getStocks = () => {
      api.get('stocks')
        .then((res) => {
          const state = Object.assign({}, this.state);
          for (let portfolio in state.portfolios) {
            state.portfolios[portfolio].icon = <img src={(res.data.find(stock => stock.name === state.portfolios[portfolio].currency) || {token_img: 'x'}).token_img} className="token-icon" />
          }
          console.log(state);
          this.setState(state);
        })
        .catch(console.log);
    }
    getRequest();
  }
  acceptInviting() {
    api.post('company/accept-inviting', {
      company: this.state.company.id,
      request: this.state.request.id
    })
      .then(() => {
        setPage('account');
      })
      .catch(console.log);
  }
  acceptPortfolio() {
    setPage('signagreement/' + this.props.match.params.id);
  }
  render() {
    if (!this.state.gotData)
      return <p> Loading... </p>;
    let anotherPersonData = {};
    switch (this.props.user) {
      case 0:
        if (this.state.manager !== null)
          anotherPersonData = this.state.manager;
        else if (this.state.company !== null)
          anotherPersonData = this.state.company;
        break;
      case 1:
        if (this.state.investor !== null)
          anotherPersonData = this.state.investor;
        else if (this.state.company !== null)
          anotherPersonData = this.state.company;
        break;
      case 3:
        if (this.state.investor !== null)
          anotherPersonData = this.state.investor;
        else if (this.state.manager !== null)
          anotherPersonData = this.state.manager;
        break;
    }
    const anotherPerson = {
      id: anotherPersonData.id,
      user: anotherPersonData.user,
      name: anotherPersonData.company_name || (anotherPersonData.name || '' + ' ' + anotherPersonData.surname || ''),
      img: anotherPersonData.img ? api.imgUrl(anotherPersonData.img) : 'manager/user.svg'
    }


    let buttons = '';

    switch (this.props.user) {
      case 0:
        switch(this.state.request.status) {
          case 'pending':
            buttons = 
            <div className="row">
             <Link to={"/decline/" + this.props.match.params.id} onClick={() => this.setPage("decline/" + this.props.match.params.id)}>
               <button className="back right">Decline</button>
             </Link>
             <button className="continue" onClick={() => this.acceptPortfolio()}>Accept</button>
           </div>;
          break;
        }
      break;
      case 1:
        switch(this.state.request.status) {
          case 'waiting':
            if (this.state.request.type === 'portfolio')
              buttons = 
                <div className="row-padding">
                 <Link to={"/portfoliocreation/" + this.props.match.params.id} onClick={() => this.setPage("portfoliocreation")}>
                   <button className="continue right">Create portfolio</button>
                 </Link>
                 <Link to={"/decline/" + this.props.match.params.id} onClick={() => this.setPage("decline/" + this.props.match.params.id)}>
                   <button className="back right">Decline</button>
                 </Link>
               </div>
            else if (this.state.request.type === 'inviting') 
              buttons = 
                <div className="row-padding">
                 <button className="continue right" onClick={() => this.acceptInviting()}>Accept</button>
                 <Link to={"/decline/" + this.props.match.params.id} onClick={() => this.setPage("decline/" + this.props.match.params.id)}>
                   <button className="back right">Decline</button>
                 </Link>
               </div>
          break;
        }
      break;
      case 3:
        // switch(this.state.request.status) {
        // }
      break;
    }
    return (
      <div className="container">
        <div className="box">
          <Header 
            name={anotherPerson.name}
            img={anotherPerson.img}
            userId={anotherPerson.id}
            requestId={this.state.request.id}
            requestDate={this.state.request.date}
            buttons={buttons}
          />
        </div>
        {
          this.state.portfolios.length > 0 ?
          <PorfolioPreview
            portfolios={this.state.portfolios}
            currentCurrency={this.props.currentCurrency}
            currentCurrencyPrices={this.props.currentCurrencyPrices}
          /> : ''
        }
        {
          this.props.user === 3 && this.state.request.type === 'portfolio' ?
          <ManagersList
            company={this.state.company.id}
            request={this.state.request.id}
          /> : ''
        }
      </div>)
    return (
      <div className="container">
        <div className="first-tab">
          <div className="box">
          Page cannot be rendered properly, data for developers:
          <pre>
            Usertype: {this.props.user}
            <br />
            Request status: {this.state.request.status}
            <br />
            Request id: {this.state.request.id}
          </pre>
          </div>
        </div>
      </div>
      )
  }
}
export default connect(a => a)(RequestPage);


