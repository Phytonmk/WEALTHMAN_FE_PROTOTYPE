import React, { Component } from 'react';
import { Provider, connect } from 'react-redux';
import { store, setReduxState } from './redux/index';

import { HashRouter as Router, Route, Switch, Link } from 'react-router-dom';
import Loadable from 'react-loadable';

import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';

import { api, setPage } from './components/helpers';

import defaultState from './redux/default-state';

import auth from './components/auth.js';

// pages
import InvestorRegistorPage from './components/pages/registration/InvestorRegistorPage';
import AgreementPage from './components/pages/AgreementPage';
import ManagerRegPage from './components/pages/ManagerRegPage';
import ManagerDetailingPage from './components/pages/registration/ManagerRegistorPage';
import ManagersPage from './components/pages/ManagersPage';
import ManagerPage from './components/pages/ManagerPage';
import CompanyPage from './components/pages/CompanyPage';
import KYCPage from './components/pages/KYCPage';
import RequestsPage from './components/pages/RequestsPage';
import RequestPage from './components/pages/RequestPage/index.jsx';
import PortfolioCreationPage from './components/pages/PortfolioCreationPage';
import SignAgreementPage from './components/pages/SignAgreementPage';
import MoneyPage from './components/pages/MoneyPage';
import AccountPage from './components/pages/AccountPage';
import StaticFormPage from './components/pages/StaticFormPage';
import DashboardPage from './components/pages/DashboardPage';
import PortfoliosPage from './components/pages/PortfoliosPage';
import PortfolioPage from './components/pages/PortfolioPage';
import WithdrawPage from './components/pages/WithdrawPage';
import RegOrLoginForNewInvestorPage from './components/pages/RegOrLoginForNewInvestorPage';
import DeclinePage from './components/pages/DeclinePage';
import CompanyManagmentPage from './components/pages/CompanyManagmentPage';
import InviteManagerPage from './components/pages/InviteManagerPage';
import ChatPage from './components/pages/ChatPage';
import InvestorsPage from './components/pages/InvestorsPage';
import FAQPage from './components/pages/FAQPage';
import SupportedBrowsersPage from './components/pages/SupportedBrowsersPage';
import ContactPage from './components/pages/ContactPage';
import InvestorPage from './components/pages/InvestorPage';
import QuestionsPage from './components/pages/QuestionsPage';
import UserAgreementPage from './components/pages/UserAgreementPage';
import AboutPage from './components/pages/AboutPage';
import PasswordResetPage from './components/pages/PasswordResetPage';
//

const formAnswers = [];
let authCompleted = false
class App extends Component {
  constructor(props) {
    super(props);
    this.state = Object.assign(defaultState, {authCompleted: false});
    store.subscribe(() => {
      this.state = store.getState();
      this.forceUpdate();
    });
    window.addEventListener('auth completed', () => {
      //console.log('auth completed')
      authCompleted = true
      setTimeout(() => this.forceUpdate(), 0)
    })
    auth()
  }

  setPage(page, id) {
    var prevousPages = this.state.prevousPages.slice();
    prevousPages.push(this.state.currentPage);
    if (typeof id !== "undefined")
      switch (page) {
        case "manager":
          setReduxState({currentManager: id})
          break;
        case "algorythm":
          setReduxState({currentAlgorythm: id})
          break;
        case "portfolio":
          setReduxState({currentPortfolio: id})
          break;
        case "request":
          setReduxState({currentRequest: id})
          break;
      }

    setReduxState({
      currentPage: page,
      prevousPages: prevousPages,
      currentAccountPage: "personal",
      currentPortfoliosPage: "active",
    });
  }
  setCurrency(event) {
    setReduxState({
      currentCurrency: event.target.value,
    });
  }
  prevousPage() {
    var prevousPages = this.state.prevousPages.slice();
    if (prevousPages.length == 0)
      return;
    var currentPage = prevousPages.pop();

    setReduxState({
      currentPage: currentPage,
      prevousPages: prevousPages
    })
  }

          // <Route exact path="/" render={() => (this.state.user == -1 ? this.renderManagersPage() : this.renderPortfoliosPage())}/>
  renderPage() {
    return (
        <Switch>

          <Route exact path="/" component={this.state.user === -1 || this.state.user === 0 ? ManagersPage : RequestsPage} />
          <Route path="/account" component={AccountPage} />
          <Route path="/about" component={AboutPage} />
          <Route path="/origin" render={() => this.renderOriginPage()} />
          <Route path="/invest" render={() => this.renderInvestPage()} />
          <Route path="/dashboard" component={DashboardPage} />

          <Route path="/legal" render={() => this.renderLegalPage()} />
          <Route path="/methodology" render={() => this.renderMethodologyPage()} />
          <Route path="/press" render={() => this.renderPressPage()} />
          <Route path="/help center" render={() => this.renderHelpCenterPage()} />
          <Route path="/blog" render={() => this.renderBlogPage()} />

          <Route path="/company/:id" component={ManagerPage} />
          <Route path="/manager/:id" component={ManagerPage} />
          <Route path="/investor/:id" component={InvestorPage} />
          <Route path="/company" component={CompanyManagmentPage} />
          <Route path="/participating/:manager" component={InviteManagerPage} />
          <Route path="/algorythm/:id" render={({match}) => this.renderAlgorythmPage(match)} />
          <Route path="/portfolio/:id" component={PortfolioPage} />
          <Route path="/request/:id" component={RequestPage} />

          <Route path="/portfolios" component={PortfoliosPage} />
          <Route path="/managers" component={ManagersPage} />
          <Route path="/company-managers" component={ManagersPage} />
          <Route path="/algorythms" render={() => this.renderAlgorythmsPage()} />
          <Route path="/requests" component={RequestsPage} />
          <Route path="/reg-or-login" component={RegOrLoginForNewInvestorPage} />
          <Route path="/static form" component={StaticFormPage} />
          <Route path="/dynamic form" render={() => this.renderDynamicFormPage()} />
          <Route path="/agreement" component={AgreementPage} />
          <Route path="/signagreement/:id" component={SignAgreementPage} />
          <Route path="/thanks" render={() => this.renderThanksPage()} />
          <Route path="/thanks2" render={() => this.renderThanks2Page()} />
          <Route path="/money/:id" component={MoneyPage} />
          <Route path="/kyc/:manager/:id" component={KYCPage} />
          <Route path="/investor register" component={InvestorRegistorPage} />
          <Route path="/accept" render={() => this.renderAcceptPage()} />
          <Route path="/password-reset" component={PasswordResetPage} />


          <Route path="/chats" component={ChatPage}/>
          <Route path="/chat/:chat" component={ChatPage}/>
          <Route path="/decline/:id" component={DeclinePage} />
          <Route path="/faq" component={FAQPage} />
          <Route path="/team" render={() => this.renderTeamPage()} />
          <Route path="/contact" component={ContactPage} />

          <Route path="/email" render={() => this.renderEmailPage()} />
          <Route path="/metamask" render={() => this.renderMetamaskPage()} />
          <Route path="/logout" component={ManagersPage} />

          <Route path="/special-offer/:id" component={PortfolioCreationPage} />
          <Route path="/portfoliocreation/:id" component={PortfolioCreationPage} />
          <Route path="/signagreement" component={AgreementPage} />
          <Route path="/supported-browsers" component={SupportedBrowsersPage} />

          <Route path="/manager-reg" component={ManagerRegPage} />
          <Route path="/manager-detailing" component={ManagerDetailingPage} />
          <Route path="/withdraw/:request" component={WithdrawPage} />
          <Route path="/investors" component={InvestorsPage} />

          <Route path="/questions/:id" component={QuestionsPage} />
          <Route path="/questions" render={({history}) => { history.push('/questions/first-question'); return null;}} />
          <Route path="/user-agreement" component={UserAgreementPage} />

        </Switch>
    );
  }


  renderManagerAccountPage() {
    this.setPage("account");
  }

  renderOriginPage() {
    return (
      <div className="container">
        <div className="box">
          <h2>Origin</h2>
          <p>well, we are ICO</p>
        </div>
      </div>
    );
  }

  renderInvestPage() {
    this.setPage("managers");
    return (
      <div>
      </div>
    );
  }

  renderLegalPage() {
    return (
      <div className="container">
        <div className="box">
          <h2 className="text-center">Legal Documents</h2>
          <h3>Client agreements</h3>
          <p>bla-bla-bla</p>
          <h3>General</h3>
          <p>bla-bla-bla</p>
          <h3>Taxes</h3>
          <p>bla-bla-bla</p>
        </div>
      </div>
    );
  }

  renderMethodologyPage() {
    return (
      <div className="container">
        <div className="box">
          <h2 className="text-center">Methodology</h2>
          <p>Nobody knows for sure</p>
        </div>
      </div>
    );
  }

  renderPressPage() {
    return (
      <div className="container">
        <div className="box">
          <h2 className="text-center">Press</h2>
          <p>Press loves us, and bitconnect</p>
        </div>
      </div>
    );
  }

  renderHelpCenterPage() {
    return (
      <div className="container">
        <div className="box">
          <h2 className="text-center">Help</h2>
          <p>Press on Invest button and all will be well</p>
        </div>
      </div>
    );
  }

  renderBlogPage() {
    return (
      <div className="container">
        <div className="box">
          <h2 className="text-center">Blog</h2>
        </div>
      </div>
    );
  }

  renderLandingPage() {
    return (
      <div className="container">
        <div className="box">
          <h1 className="text-center">Landing page</h1>
        </div>
      </div>
    );
  }


  renderAlgorythmPage(match) {
    var alg = this.state.algorythms.find(algorytm => algorytm.id == match.params.id);
    var manager = this.state.managers.find(manager => manager.id == alg.manager);
    var investButton;
    if (this.state.user == -1)
      investButton = (<Link to={"/register"} className="continue" onClick={() => this.setPage("register")}>Invest</Link>);
    else
      investButton = (<button className="continue" onClick={() => this.setPage("manager form")}>Invest</button>);

    return (
      <div>
        <div className="container">
          <div className="box">
            <h3>{alg.name}</h3>
            <div className="question">
              <p className="grey left">by</p>
              <button className="transactions-link left" onClick={() => this.setPage("manager", manager.id)}>{manager.name} {manager.surname}</button>
            </div>
              <p>rating {alg.rating}/10</p>
              <p>1001 users</p>
              <p>minimum investment amount: 1ETH</p>
              <p>minimum investment period: 2 month</p>
              <p>average risk: 10%</p>
              <p>estimated income: +15%</p>
              <div className="row-padding">
              {investButton}
            </div>
          </div>
        </div>
      </div>
    )
  }

  renderDynamicFormPage() {
    var form = this.state.dynamicQuestions.map((question, i) =>
      <div key={i} className="form-question">
        <h4>{question.question}</h4>
        {
          question.answers.map((answer, i) =>
          <div key={i} className="answer">
            <input type="radio" id={answer} onChange={() => formAnswers[question] = answer} />
            <label htmlFor={answer}>{answer}</label>
          </div>
        )
      }
      </div>
    );

    return (
      <div>
        <div className="container">
          <div className="box">
            <div className="container">
              <h2>Investement Goals & Strategy Aims</h2>
              <h4 className="grey">Asked every month (or quarter/year)</h4>
              {form}
              <div className="row-padding">
                <Link to={"/static form"}>
                  <button className="back" onClick={() => this.prevousPage()}>Back</button>
                </Link>
                <Link to={this.state.currentManager !== -1 ? "/manager form" : "/investor register"}>
                  <button className="continue" onClick={() => {
                    api.post('investor/risk', {formAnswers})
                      .then(() => {
                        this.setPage(this.state.currentManager !== -1 ? "manager form" : "investor register")
                      })
                      .catch(console.log);
                  }}>Continue</button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }



  // renderManagerFormPage() {
  //   // if (this.state.algorythms[this.state.currentAlgorythm]) {

  //     var manager = this.state.managers.find(manager => manager.id == this.state.algorythms[this.state.currentAlgorythm].creator);
  //     var form = this.state.managerQuestions.map((question, i) =>
  //       <div key={i} className="form-question">
  //         <h4>{question.question}</h4>
  //         {
  //           question.answers.map((answer, i) =>
  //           <div key={i} className="answer">
  //             <input type="radio" id={answer} />
  //             <label htmlFor={answer}>{answer}</label>
  //           </div>
  //         )
  //       }
  //       </div>
  //     );

  //     return (
  //       <div>
  //         <div className="container">
  //           <div className="box">
  //             <div className="container">
  //               <h2>Manager Form Questions</h2>
  //               <h4 className="grey">Asked by manager ({manager.name} {manager.surname})</h4>
  //               {form}
  //               <div className="row-padding">
  //                 <Link to={"/dynamic form"}>
  //                   <button className="back" onClick={() => this.prevousPage()}>Back</button>
  //                 </Link>
  //                 <Link to={"/kyc"}>
  //                   <button className="continue" onClick={() => this.setPage("KYC")}>Continue</button>
  //                 </Link>
  //               </div>
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //     );
  //   // } else {
  //   //   return this.renderKYCPage();
  //   // }
  // }

  renderThanksPage() {
    return(
      <div>
        <div className="container">
          <div className="box">
            <h2>Thanks for your investment</h2>
            <p>By the way, u can invest more:</p>
            <div className="row-padding">
              <Link to={"/managers"}>
                <button className="continue" onClick={() => this.setPage("managers")}>Continue</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderThanks2Page() {
    return(
      <div>
        <div className="container">
          <div className="box">
            <h2>Thanks for filling forms</h2>
            <p>Your risk profile is 4</p>
            <p>After manager reads and accepts your request, it will appear in your Accepted Requests List</p>
            <div className="row-padding">
              <Link to={"/requests"}>
                <button className="continue" onClick={() => this.setPage("accept")}>Send to manager</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderAcceptPage() {
    var portfolio = this.state.portfolios.find(p => p.id == this.state.currentPortfolio);
    var totalValue = this.state.currentCurrencyPrices.find(c => c.name == portfolio.currency).price * portfolio.value;
    var currentCurrency = this.state.currentCurrencyPrices.find(c => c.name == this.state.currentCurrency);
    var currencies = this.state.currentCurrencyPrices.map((c, i) =>
      <option key={i} value={c.name}>{c.name}</option>
    );
    var currenciesList = this.state.portfolioCurrencies.map(currency => {
      var price = this.state.currentCurrencyPrices.find(c => c.name == currency.currency).price;

      return {
        id: currency.id,
        type: currency.type,
        number: "",
        currency: currency.currency,
        percent_portfolio: currency.percent,
        amount: (currency.percent / 100 * totalValue / price).toFixed(3),
        value: (currency.percent / 100 * totalValue / currentCurrency.price).toFixed(3) + " " + currentCurrency.name,
        analysis: currency.analysis,
        comments: currency.comments,
      };
    });

    var investor = this.state.investors.find(i => i.id == portfolio.investor);
    var manager = this.state.managers.find(m => m.id == portfolio.manager);
    var image = this.state.user == 0 ? <img src={"../manager/" + manager.img} className="avatar" /> : <img src={"../investor/" + investor.img} className="avatar" />;
    var info;
    if (this.state.user == 0)
      info = (
        <div>
          <h3>Manager</h3>
          <h4>{manager.name} {manager.surname}</h4>
          {/* <p>New client. 1   days on platform</p> */}
          <p>{manager.age} years old</p>
          <p>manager id 50{manager.id}00{manager.id}</p>
        </div>
      );
    else
    info = (
      <div>
        <h3>Investor</h3>
        <h4>{investor.name} {investor.surname}</h4>
        <p>New client. 1   days on platform</p>
        <p>{investor.age} years old</p>
        <p>client id 50{investor.id}00{investor.id}</p>
      </div>
    );

    return(
      <div>
        <div className="second-header">
          <div className="container">
            <div className="title">
              <h2>Porfolio</h2>
              <p className="grey">Total value</p>
            </div>
            <div className="description">
              <h2>{(totalValue / currentCurrency.price).toFixed(3) + " " + currentCurrency.name}</h2>
              <select value={this.state.currentCurrency} onChange={this.setCurrency.bind(this)}>
                {currencies}
              </select>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="box">
            <div className="circle left">
              {image}
            </div>
            <div className="third">
              {info}
            </div>
            <div className="row-padding">
              <button className="continue">Start chat</button>
            </div>
            <p>Target value: {portfolio.value}{portfolio.currency}</p>
            <p>Term 4 month</p>
            <p>Target earning rate 10%</p>
            <p>Fee: с прибыли</p>
            <p>Frequency for recalculation: 1 day</p>
            {/* <img className="portfolio" src="../portfolio.jpg" />
            <div className="row-padding">
              <button className="back right" onClick={() => this.prevousPage()}>Delete</button>
            </div> */}
          </div>
          <div className="box">
            <h2>Portfolio Preview</h2>
            {/* <Sortable
              listings={currenciesList}
              setPage={this.setPage.bind(this)}
              currencySelector={
                <select value={this.state.currentCurrency} onChange={this.setCurrency.bind(this)}>
                  {
                    this.state.currentCurrencyPrices.map((c, i) =>
                      <option key={i} value={c.name}>{c.name}</option>
                    )
                  }
                </select>
              }
            /> */}

            {/* <div>
              <h4>User Agreement</h4>
              <ul>
                <li>U pay 5% to site</li>
                <li>U pay 10% to manager</li>
                <li>U'll get your money back in a month</li>
                <li>All risks are on U!!!</li>
              </ul>
              <ul>
                <li>U pay 5% to site</li>
                <li>U pay 10% to manager</li>
                <li>U'll get your money back in a month</li>
                <li>All risks are on U!!!</li>
              </ul>
            </div> */}

            <div className="row-padding">
              <Link to={"/thanks2"}>
                <button className="back" onClick={() => this.prevousPage()}>Cancel</button>
              </Link>
              <Link to={"/signagreement"}>
                <button className="continue" onClick={() => this.setPage("money")}>Accept</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }


  renderAlgorythmsPage() {
    var currentPage;
    switch(this.state.currentAlgorythmsPage) {
      case "uploaded":
        currentPage = (
          <div className="box">
            <h2>Current Algorythms</h2>

          </div>
        );
        break;
      case "upload":
        currentPage = (
          <div className="box">
            <h2>Upload Algorythms</h2>
            <div className="row">
              <div className="document-box">
                <h3 className="text-center">Algorythm code</h3>
                <div className="row">
                  <button className="continue">UPLOAD FILE</button>
                </div>
              </div>
            </div>
          </div>
        );
        break;
    }

    return (
      <div className="container">
        <h1>Algorythms page</h1>
        <div className="main-column">
          {currentPage}
        </div>
        <div className="second-column">
          <div className="box">
            <button className="transactions-link" onClick={() => setReduxState({ currentAlgorythmsPage: "uploaded" })}>Current Algorythms</button>
            <button className="transactions-link" onClick={() => setReduxState({ currentAlgorythmsPage: "upload" })}>Upload new</button>
          </div>
        </div>
      </div>
    );
  }

  renderTeamPage() {
    var coreTeam = this.state.coreTeam
    .map((member, i) =>
      <div key={i} className="row-padding">
        <h6>{member.name} {member.surname}</h6>
        <p>{member.position}</p>
      </div>
    );

    var advisory = this.state.advisory
    .map((member, i) =>
      <div key={i} className="row-padding">
        <h6>{member.name} {member.surname}</h6>
        <p>{member.position}</p>
      </div>
    );

    return (
      <div className="container">
        <div className="box">
          <h2>Core Team</h2>
          {coreTeam}
          <h2>Advisory Board</h2>
          {advisory}
        </div>
      </div>
    );
  }

  renderMetamaskPage() {
    return (
      <div>
        <div className="container">
          <div className="box">
            Before you continue, please download <a href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn" target="_blank">Metamask</a> to your browser and log in to the extention through the private key.
            <div className="row">
              <div className="metamask" />
            </div>
            <div className="row-padding">
              <Link to={"/register"} onClick={() => this.setPage("register")}>
                <button className="back">Back</button>
              </Link>
              <Link to="/agreement" onClick={() => this.setPage("email")}>
                <button className="continue">I have downloaded</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
  renderEmailPage() {
    return (
      <div>
        <div className="container">
          <div className="box">
            <h3>Confirm Email</h3>
            <p>(Front-end can't send emails. So here is the next step without actually confirming email)</p>
            <div className="row-padding">
              <Link to={"/register"} onClick={() => this.setPage("metamask")}>
                <button className="back">Back</button>
              </Link>
              <Link to="/agreement" onClick={() => this.setPage("agreement")}>
                <button className="continue">Confirm email</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  render() {
    document.title = "Wealthman Platform";
    if (!authCompleted && this.props.userData === undefined)
      return 'loading...'
    const Loading = () => <div>Loading...</div>;
    // const Home = Loadable({
    //   loader: () => import('./routes/Home.js'),
    //   loading: Loading,
    // });

    return (
      <Router>
        <article className="page">
          <Header
            user={this.state.user}
          />
          <div className="content">
            {this.renderPage()}
          </div>
          <Footer
            user={this.state.user}
          />
        </article>
      </Router>
    );
  }
}


export default connect(a => a)(App);
