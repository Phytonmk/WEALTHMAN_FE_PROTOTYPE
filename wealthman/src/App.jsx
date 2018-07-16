import React, { Component } from 'react';
import { Provider, connect } from 'react-redux';
import { store, setReduxState } from './redux/index';

import { HashRouter as Router, Route, Switch, Link } from 'react-router-dom';
import Loadable from 'react-loadable';

import Sortable from './components/Sortable.jsx';
import myDate from './components/myDate.jsx';

import logoWhite from './img/logo.svg';
import logoBlue from './img/logo_blue.svg';
import './css/main.sass';
import './css/design.sass';

import { api, setPage } from './components/helpers';

import defaultState from './redux/default-state';

import auth from './components/auth.js';

// pages
import loginPage from './components/pages/loginPage';
import login2Page from './components/pages/Login2Page';
import RegisterPage from './components/pages/RegisterPage';
import InvestorRegistorPage from './components/pages/InvestorRegistorPage';
import AgreementPage from './components/pages/AgreementPage';
import ManagerRegPage from './components/pages/ManagerRegPage';
import ManagerDetailingPage from './components/pages/ManagerDetailingPage';
import ManagersPage from './components/pages/ManagersPage';
import ManagerPage from './components/pages/ManagerPage';
import CompanyPage from './components/pages/CompanyPage';
import KYCPage from './components/pages/KYCPage';
import RequestsPage from './components/pages/RequestsPage';
import RequestPage from './components/pages/RequestPage';
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

//

const formAnswers = [];

class App extends Component {
  constructor(props) {
    super(props);
    this.state = defaultState;
    store.subscribe(() => {
      this.state = store.getState();
      this.forceUpdate();
    });
    auth();
  }


  logout() {
    api.post('logout')
      .then(() => {
        auth();
        window.location.reload(false);
      });
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

  renderBackButton() {
    if (this.state.prevousPages.length == 0)
      return;

    var prevousPage = capitalize(this.state.prevousPages[this.state.prevousPages.length - 1]);

    return (
      <div className="third-header">
        <div className="container">
          <button className="back" onClick={() => this.prevousPage()}>Back to {prevousPage}</button>
        </div>
      </div>
    );
  }
  renderProgressBar() {
    var pages = ["register", "email", "agreement", "static form", "dynamic form", "manager form", "kyc", "thanks2", "accept", "signagreement", "money", , "investor register"];
    var progress = pages.indexOf(this.state.currentPage.toLowerCase()) + 2;
    var total = pages.length + 1;

    return (
      <div className="progress-bar">
        <div className="progress" style={{width: (100 / total * progress) + "%"}}></div>
      </div>
    );
  }
          // <Route exact path="/" render={() => (this.state.user == -1 ? this.renderManagersPage() : this.renderPortfoliosPage())}/>
  renderPage() {
    return (
        <Switch>

          <Route exact path="/" component={this.state.user === -1 || this.state.user === 0 ? ManagersPage : RequestsPage}/>
          <Route path="/login" component={loginPage}/>
          <Route path="/totallydifferentlogin"  component={login2Page}/>
          <Route path="/account" component={AccountPage}/>
          <Route path="/about" render={() => this.renderAboutUsPage()}/>
          <Route path="/origin" render={() => this.renderOriginPage()}/>
          <Route path="/invest" render={() => this.renderInvestPage()}/>
          <Route path="/dashboard" component={DashboardPage}/>

          <Route path="/legal" render={() => this.renderLegalPage()}/>
          <Route path="/methodology" render={() => this.renderMethodologyPage()}/>
          <Route path="/press" render={() => this.renderPressPage()}/>
          <Route path="/help center" render={() => this.renderHelpCenterPage()}/>
          <Route path="/blog" render={() => this.renderBlogPage()}/>

          <Route path="/manager/:id" component={ManagerPage}/>
          <Route path="/company/:id" component={CompanyPage}/>
          <Route path="/algorythm/:id" render={({match}) => this.renderAlgorythmPage(match)}/>
          <Route path="/portfolio/:id" component={PortfolioPage}/>
          <Route path="/request/:id" component={RequestPage}/>

          <Route path="/portfolios" component={PortfoliosPage}/>
          <Route path="/managers" component={ManagersPage}/>
          <Route path="/algorythms" render={() => this.renderAlgorythmsPage()}/>
          <Route path="/requests" component={RequestsPage}/>

          <Route path="/reg-or-login" component={RegOrLoginForNewInvestorPage}/>
          <Route path="/static form" component={StaticFormPage}/>
          <Route path="/dynamic form" render={() => this.renderDynamicFormPage()}/>
          <Route path="/agreement" component={AgreementPage}/>
          <Route path="/signagreement/:id" component={SignAgreementPage}/>
          <Route path="/manager form" render={() => this.renderManagerFormPage()}/>
          <Route path="/thanks" render={() => this.renderThanksPage()}/>
          <Route path="/thanks2" render={() => this.renderThanks2Page()}/>
          <Route path="/register" component={RegisterPage}/>
          <Route path="/money/:id" component={MoneyPage}/>
          <Route path="/kyc" component={KYCPage}/>
          <Route path="/investor register" component={InvestorRegistorPage}/>
          <Route path="/accept" render={() => this.renderAcceptPage()}/>

          <Route path="/chat" render={() => this.renderChatPage()}/>
          <Route path="/decline/:id" component={DeclinePage}/>
          <Route path="/faq" render={() => this.renderFAQPage()}/>
          <Route path="/team" render={() => this.renderTeamPage()}/>
          <Route path="/contact" render={() => this.renderContactPage()}/>
          <Route path="/investor-ua" render={() => this.renderInvestorUserAgreementPage()}/>
          <Route path="/manager-ua" render={() => this.renderManagerUserAgreementPage()}/>

          <Route path="/email" render={() => this.renderEmailPage()}/>
          <Route path="/logout" component={ManagersPage}/>

          <Route path="/portfoliocreation/:id" component={PortfolioCreationPage}/>
          <Route path="/signagreement" component={AgreementPage}/>
          <Route path="/supported-browsers" render={() => this.renderSupportedBrowsersPage()}/>

          <Route path="/manager-reg" component={ManagerRegPage}/>
          <Route path="/manager-detailing" component={ManagerDetailingPage}/>
          <Route path="/withdraw/:id" component={WithdrawPage}/>
        </Switch>
    );
  }


  renderManagerAccountPage() {
    this.setPage("account");
  }

  renderAboutUsPage() {
    var text = "Wealthman is a decentralized platform for development, execution and marketing of wealth management service. The platform is embedded with strong antifraud features allowing autonomous robo-advisors and human-driven digital asset management services to be secure for investors.\n\nMarketplace of wealth management service with efficiency metrics.\n\nInvestment portfolio is being rebalanced by chosen wealth manager through Wealthman DApp.\n\nManaged assets could be observed and accessed by private key at any time."
    return (
      <div className="container">
        <div className="box">
          <h2>About us</h2>
          <p>{newLines(text)}</p>
          <h4>High competency</h4>
          <p>Wealthman evaluates the degree to which the robo-advisors and wealth managers meet objectives set by investors. Ranking based on such findings makes service effectiveness transparent and motivates the demand for quality. Competition lead to the benefit of the quality of wealth management service</p>
          <h4>Assets security</h4>
          <p>Wealthman embedded with strong antifraud desing, that protects against deception. Decentralized service execution and assets storage eliminate capital risks caused by errors/vulnerability of central party.</p>
          <h4>Trustfull</h4>
          <p>Being decentralized, Wealthman wins in situations where there is lack of trust of investor in wealth manager’s competency, honesty, and infrastructure reliability.</p>
          <h4>Our vision</h4>
          <p>In our long-term vision WealthMan is the most intelligent, safest and fastest platform for wealth management that gains accepted industry-wide. It is our belief that decentralized autonomous robo-advisors based on smart contracts will dislodge centralized robo-advisors and human-driven wealth management service. Registers of global assets will be decentralized. Thus, the decentralized robo-advisors will dominate the market of wealth management services.</p>
        </div>
      </div>
    );
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
        {/* {this.renderBackButton()} */}
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
        {/* {this.renderBackButton()} */}
        {this.renderProgressBar()}
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



  renderManagerFormPage() {
    // if (this.state.algorythms[this.state.currentAlgorythm]) {

      var manager = this.state.managers.find(manager => manager.id == this.state.algorythms[this.state.currentAlgorythm].creator);
      var form = this.state.managerQuestions.map((question, i) =>
        <div key={i} className="form-question">
          <h4>{question.question}</h4>
          {
            question.answers.map((answer, i) =>
            <div key={i} className="answer">
              <input type="radio" id={answer} />
              <label htmlFor={answer}>{answer}</label>
            </div>
          )
        }
        </div>
      );

      return (
        <div>
          {/* {this.renderBackButton()} */}
          {this.renderProgressBar()}
          <div className="container">
            <div className="box">
              <div className="container">
                <h2>Manager Form Questions</h2>
                <h4 className="grey">Asked by manager ({manager.name} {manager.surname})</h4>
                {form}
                <div className="row-padding">
                  <Link to={"/dynamic form"}>
                    <button className="back" onClick={() => this.prevousPage()}>Back</button>
                  </Link>
                  <Link to={"/kyc"}>
                    <button className="continue" onClick={() => this.setPage("KYC")}>Continue</button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    // } else {
    //   return this.renderKYCPage();
    // }
  }

  renderThanksPage() {
    return(
      <div>
        {/* {this.renderBackButton()} */}
        {this.renderProgressBar()}
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
        {/* {this.renderBackButton()} */}
        {this.renderProgressBar()}
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
        {/* {this.renderBackButton()} */}
        {this.renderProgressBar()}
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
            <Sortable
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
            />

            {/* <div className="user-agreement">
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

  renderManagerControlPanelPage() {
    return (
      <div className="container">
        <div className="box">
          <h2>Manager Control Panel</h2>
          <p>В разработке</p>
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
        <div className="first-tab">
          {currentPage}
        </div>
        <div className="second-tab">
          <div className="box">
            <button className="transactions-link" onClick={() => setReduxState({ currentAlgorythmsPage: "uploaded" })}>Current Algorythms</button>
            <button className="transactions-link" onClick={() => setReduxState({ currentAlgorythmsPage: "upload" })}>Upload new</button>
          </div>
        </div>
      </div>
    );
  }

  renderFAQPage() {
    var types = [
      {
        id: "Discretionary",
        title: "Discretionary investment management",
        body: "Discretionary investment management is a form of wealth management through which investment decisions are made at the discretion of a professional wealth manager. It is essentially a hands-off approach, suitable for investors who lack the time, experience, or desire to actively manage their portfolio and wish to delegate this responsibility to a professional. If you opt for discretionary management services, the first thing the wealth manager will probably do – in order to understand your investment objectives and risk appetite – is to have you answer a questionnaire. Expect to be asked how much investment risk you are willing to take on, the amount of returns you aim to receive by taking that level of risk, and your preferred asset classes and markets.\nYour wealth manager will then formulate a customised investment strategy that fits your preferences and risk profile, and you will have the opportunity to review this. After you sign off on this plan, your wealth manager will be responsible for all the investment decisions relating to your portfolio. You will not be required to provide consent for individual transactions. The majority of wealth managers offer discretionary services, and this style of investment management is the most popular choice among private clients.\nIf you lack extensive experience in investing, are time-strapped, or are simply not inclined to get involved in managing their investment portfolio, the discretionary approach is probably the right one for you. By delegating the management of your portfolio to a wealth service professional, you are freed from the burden of making investment decisions on a day-to-day basis.",
      },
      {
        id: "Advisory",
        title: "Advisory investment management",
        body: "Advisory investment management – is a hands-on approach, suitable for those investors who possess the necessary expertise and initiative to take an active role in managing their own portfolios. With advisory services, the wealth manager will consult with you and provide investment strategy advice and guidance, but you will make the final buy-and-sell decisions and changes to your portfolio. In order to be able to provide you with personalised investment guidance, your wealth manager will first need to schedule a sit-down session with you to develop an understanding of your investment objectives and risk appetite.\nHaving a say over your investment portfolio is the most compelling reason for choosing the advisory style of asset management. You will always be in the driver’s seat and will have total control over where your money is being invested at any given time.\nHowever advisory portfolio management requires you to be very knowledgeable about investing tools and techniques and highly attuned to market movements. Because you are required to “sign-off” on every deal, you need to remain contactable at all times to approve of any changes made to an order. If your wealth manager is unable to reach you at a particularly crucial moment, it might result in a missed opportunity for a financial gain or even a loss.",
      },
      {
        id: "Robo-advisor",
        title: "Robo-advisors (robo-advisers)",
        body: "Robo-advisors (robo-advisers) are automated, algorithm-driven financial planning services with no human supervision. A robo-advisor collects information from clients about their financial situation and future goals through an online survey, and then uses the data to automatically invest client assets.\nOther common designations for robo-advisors are “robo-advisory”, “automated investment advisor”, “automated investment management”, “virtual adviser” and “digital advice platforms”.\nAll robo-advisors on the Wealthman platform are controlled by investor’s smart contracts.",
      },
    ];

    if (this.state.faqId != "") {
      setTimeout(() => {
        var elem = document.getElementById(this.state.faqId);
        if (elem)
          elem.scrollIntoView();
        setReduxState({faqId: ""});
      }, 200);
    }

    return (
      <div className="container">
        <div className="box">
          <h2>FAQ</h2>
          <h4>What is the future of WealthMan?</h4>
          <p>WealthMan is a state-of-the-art wealth management platform with fast and secure transaction algorithms. Decentralized autonomous robo-advisors based on smart contracts will dislodge centralized robo-advisors and human-conducted wealth management service. Global asset registers will become digital, accounts decentralized. Thus, decentralized robo-advisors will soon dominate the market of wealth management services.</p>
          <h4>What is the WealthMan DAO?</h4>
          <p>It is a smart contract, in which all functions run on top of Ethereum. WealthMan DAO is used to: - manage of platform settings (remuneration, the level of the data provider's pledge, etc.); - maintain list of accepted series of data; - mint AWM tokens during token generation event; - burn AWM tokens; - store funds and tokens and transmits them based on the code (e.g. lock AWM tokens of Data Provider).</p>
          <h4>What is the WealthMan?</h4>
          <p>WealthMan is a decentralized platform for development and execution of autonomous Wealth Management robo-advisors. In creating the platform, we are placing particular emphasis on situations where there is no trust of investor in wealth manager’s competency and honesty, infrastructure security, and where low costs and speed of high-tech wealth management service deployment are important.  So, Wealthman is a platform that does this by building a decentralized application on top of blockchain protocol that capable to execute algorithms written on Wealthman’s proprietary built-in high-level programming language. The application allows any user to start a secure advisory service or easily develop a decentralized robot-advisor. Such services can be configured with arbitrary rules for calculating the structure of the investment portfolio on the basis of a constantly updated and insured data set, transaction execution rules and remuneration terms.</p>
          {/* <h3>Robo-Advisor:</h3>
          <h4>What are the advantages of a Robo-advisor?</h4>
          <p>Robo-advisor is a low-cost alternative to conventional advisors. By eliminating human labor, online solutions can offer the same services at a lower cost. Most robo-advisors charge an annual fee of 0.2% to 0.5% of the client's net assets value (NAV). Robo-advisors are also more accessible, being available 24/7 as long as the user has an Internet connection. Moreover, they have such advantages as: access to a human advisor, tax optimization, and portfolio rebalancing.</p>
          <h4>What is a Robo-advisor?</h4>
          <p>A robo-advisor is a digital instrument, which provides an automated, algorithm-driven wealth management service with little to no human supervision. Typically, robo-advisor collects information about client’s goals and financials via online survey. Then, robo-advisor  analyzes the market data and automatically manages the client's assets in accordance to client’s investment goals.</p> */}
          {types.map((type, i) =>
            <div key={i} id={type.id} className="row-padding">
              <h3>{type.title}</h3>
              {newLines(type.body)}
              <Link to="/managers" className="blue-link active" onClick={() => {this.setPage("managers"); setReduxState({managersFilter: type.id})}}>Try it</Link>
            </div>
          )}
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

  renderContactPage() {
    return (
      <div className="container">
        <div className="box">
          <h2>CONTACT US</h2>
          <p>Follow us:</p>
          <a className="telegram" href="https://t.me/wealthman_global">Telegram</a>
          <a className="bitcointalk" href="https://bitcointalk.org/index.php?topic=2006205">Bitcointalk</a>
          <a className="facebook" href="https://www.facebook.com/WealthMan.io/">Facebook</a>
          <a className="instagram" href="https://www.instagram.com/wealthman.io/">Instagram</a>
          <a className="medium" href="https://medium.com/@Wealthman">Medium</a>
          <a className="reddit" href="https://www.reddit.com/r/Wealthman/">Reddit</a>
          <a className="twitter" href="https://twitter.com/wealthman_io">Twitter</a>
          <a className="linkedin" href="https://www.linkedin.com/company/wealthman-io">Linkedin</a>
          <a className="youtube" href="https://www.youtube.com/c/wealthman">YouTube</a>
          <h3>Have some questions?</h3>
          <p>If you have any questions regarding the Wealthman project do not hesitate to contact us using the contact form! We will be glad to answer any questions about our project.</p>
          <p>General questions: info@wealthman.io</p>
          <p> ICO, Media\PR inquiries: office@wealthman.io</p>
          <p>Get in touch with the Wealthman team:</p>
          <input placeholder="Your Name" />
          <input placeholder="Your e-mail" />
          <input type="textarea" placeholder="Message" />
          <button className="continue">Submit</button>
        </div>
      </div>
    );
  }

 
  renderChatPage() {
    return (
      <div>
        {/* {this.renderBackButton()} */}
        <div className="container">
          <div className="box">
            <h3>Chat page</h3>
          </div>
        </div>
      </div>
    );
  }
  renderInvestorUserAgreementPage() {
    return (
      <div>
        <div className="container">
          <div className="box">
            <h3>Investor User Agreement</h3>
            {newLines(this.state.agreement)}
          </div>
        </div>
      </div>
    );
  }
  renderManagerUserAgreementPage() {
    return (
      <div>
        <div className="container">
          <div className="box">
            <h3>Manager User Agreement</h3>
            {newLines(this.state.agreement)}
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
              <Link to={"/register"} onClick={() => this.setPage("register")}>
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


  renderSupportedBrowsersPage() {
    return <div className="container">
      Google Chrome, Safari, Mozilla Firefox.
    </div>;
  }

  render() {
    document.title = "Wealthman Platform";

    const Loading = () => <div>Loading...</div>;
    // const Home = Loadable({
    //   loader: () => import('./routes/Home.js'),
    //   loading: Loading,
    // });

    let headerLinks = [];
    switch(this.state.user) {
      case -1:
        headerLinks = this.state.unloggedLinks;
        break;
      case 0:
        headerLinks = this.state.loggedInvestorLinks;
        break;
      case 1:
        headerLinks = this.state.loggedManagerLinks;
        break;
      case 2:
        headerLinks = this.state.loggedSuplierLinks;
        break;
    }
    headerLinks = headerLinks.map((link, i) => {
      if (link.link.includes("https://"))
        return (
          <li key={i} className="link">
            <a href={link.link} target="_blank" className="link">
              {capitalize(link.label)}
            </a>
          </li>
        );
      return (
        <li key={i} className="link" onClick={() => this.setPage(link.link)}>
          <Link to={"/" + link.link} className={link.link == "login" || link.link == "register" ? "big-blue-button" : "link"} onClick={() => {(link.link == "logout" ? this.logout() : "")}}>
            {capitalize(link.label)}
          </Link>
        </li>
      );
    });
    var logo = this.state.user == -1 ? logoBlue : logoWhite;

    var logButton;
    if (this.state.user !== -1)
      logButton = (
        <Link to={"#"} className="login" onClick={() => this.logout()}>
          {/* Log out */}
        </Link>
      );
    else
      logButton = (
        <Link to={"/totallydifferentlogin"} className="login" onClick={() => this.setPage("login")}>
          {capitalize("login")}
        </Link>
      );
    var footer = this.state.currentPage == "login" ?
    <div className="footer-white">
      <div className="row border-bottom">
        <div className="footer-container">
          <Link to="/" onClick={() => this.setPage("index")}>
            Home
          </Link>
          <Link to="/contact" onClick={() => this.setPage("contact")}>
            Contact us
          </Link>
        </div>
      </div>
      <div className="row border-bottom">
        <div className="footer-container padding">
          Portfolio management and advisor services you offer with the use of software of Wealthman, Ltd. Please reference our Terms & Conditions and Privacy Policy. Unless otherwise specified, all return figures shown are for illustrative purposes only, and are not actual customer or model returns. Actual returns will vary greatly and depend on personal and market circumstances.
        </div>
      </div>
      <div className="row">
        <div className="footer-container text-center">
          Patent Pending - © 2018 Wealthman, Ltd. All Rights Reserved
        </div>
      </div>
    </div>
    :
    <div className="footer">
      <div className="footer-container">
        <div className={"z1" + (this.state.user != -1 ? " full" : "")}>
            <div className="third">
              <h4>Documents</h4>
              <Link to={this.state.user == 1 ? "/manager-ua" : "/investor-ua"} onClick={() => this.setPage(this.state.user == 1 ? "manager-ua" : "investor-ua")}>
                User Agreement
              </Link>
              <a href="https://wealthman.io/faq/">FAQ</a>
              <a href="https://github.com/Wealthman">GitHub</a>
            </div>
            <div className="third">
              <h4>Community</h4>
              <a className="telegram" href="https://t.me/wealthman_global">Telegram</a>
              <a className="bitcointalk" href="https://bitcointalk.org/index.php?topic=2006205">Bitcointalk</a>
              <a className="facebook" href="https://www.facebook.com/WealthMan.io/">Facebook</a>
              <a className="instagram" href="https://www.instagram.com/wealthman_platform/">Instagram</a>
            </div>
            <div className="third">
              <h4>Blog</h4>
              <a className="medium" href="https://medium.com/@Wealthman">Medium</a>
              <a className="reddit" href="https://www.reddit.com/r/Wealthman/">Reddit</a>
              <a className="twitter" href="https://twitter.com/wealthman_io">Twitter</a>
              <a className="linkedin" href="https://www.linkedin.com/company/wealthman-io">Linkedin</a>
              <a className="youtube" href="https://www.youtube.com/c/wealthman">YouTube</a>
            </div>
            {/* <div className="half">
              <h4>Wealthman</h4>
              <a href="https://wealthman.io/#about">About</a>
              <a href="https://wealthman.io/team/">Team</a>
              <a href="https://wealthman.io/contact/">Contact</a>
            </div> */}
        </div>
        <div className={"z2" + (this.state.user != -1 ? " hidden" : "")}>
          <h4>Wealth Managers</h4>
          <Link to="/manager-reg">Register as manager</Link>
        </div>
      </div>
      <div className="row text-center white small">
        Copyright © 2018 Wealthman. All Rights Reserved. Privacy Policy
      </div>
    </div>;

    return (
      <Router>
        <article className="page">
          <header className="header">
            <div className="contents">
              <div className="container">
                <Link to={(this.state.user == -1 ? "/managers" : "/portfolios")} onClick={() => this.setPage(this.state.user == -1 ? "managers" : "portfolios")}>
                  <img src={logoWhite} className="logo"/>
                </Link>
                <ul className="links right">
                  {headerLinks}
                </ul>
              </div>
            </div>
          </header>
          <div className="content">
            {this.renderPage()}
          </div>
          <div className="footer">
            <div className="container">
              <span>
                Copyright © 2018 Wealthman. All Rights Reserved. Privacy Policy
              </span>
              <div className="social">
                <a href="https://t.me/wealthman_global" target="_blank">
                  <img src="img/footer/telegram.png" className="social-icon" />
                </a>
                <a href="https://www.facebook.com/WealthMan.io/" target="_blank">
                  <img src="img/footer/facebook.png" className="social-icon" />
                </a>
                <a href="https://www.instagram.com/wealthman.io/" target="_blank">
                  <img src="img/footer/instagram.png" className="social-icon" />
                </a>
                <a href="https://bitcointalk.org/index.php?topic=2006205" target="_blank">
                  <img src="img/footer/linkedin.png" className="social-icon" />
                </a>
              </div>
              {this.state.user === -1 ? <Link to={"/manager-reg"} className="right">
                <button className="big-blue-button">Registration for managers</button>
              </Link> : ''}
            </div>
          </div>
        </article>
      </Router>
    );
  }
}


function capitalize(string) {
  if (string.toLowerCase() === "id")
    return "ID";
  if (string.toLowerCase() === "kyc")
    return "KYC";
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function newLines(string) {
  var paragraphs = [];
  var prevI = 0;

  for (var i = 0; i < string.length; i++) {
    if (string[i] === '\n') {
      paragraphs.push(string.slice(prevI, i));
      prevI = i;
    }
  }
  paragraphs.push(string.slice(prevI));
  var style = {color: "inherit", fontFamily: "inherit"};

  return <div style={style}>{paragraphs.map((paragraph, i) => <p  key={i} style={style}>{paragraph}</p>)}</div>;
}

export default connect(a => a)(App);
