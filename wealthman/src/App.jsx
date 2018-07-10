import React, { Component } from 'react';
import { Provider, connect } from 'react-redux';
import { store, setReduxState } from './redux/index';

import { HashRouter as Router, Route, Switch, Link } from 'react-router-dom';
import Loadable from 'react-loadable';

import Sortable from './components/Sortable.jsx';
import myDate from './components/myDate.jsx';

import logoWhite from './img/logo.svg';
import logoBlue from './img/logo_blue.svg';
import './css/main.css';

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
import KYCPage from './components/pages/KYCPage';
import RequestsPage from './components/pages/RequestsPage';
import RequestPage from './components/pages/RequestPage';


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

  tryLogin(login, password) {
    if (typeof login === "undefined") {
      login = this.state.login;
      password = this.state.password;
    }

    if (password == "123" && login == "investor")
      setReduxState({
        user: 0,
        currentPage: "portfolios"
      });
    if (password == "123" && login == "manager")
      setReduxState({
        user: 1,
        currentPage: "requests"
      });
    if (password == "123" && login == "supplier")
      setReduxState({
        user: 2,
        currentPage: "managers"
      });
  }
  logout() {
    document.cookie = '';
    document.location.href = '#';
    setReduxState({
      user: -1,
      currentPage: "managers",
      login: "",
      password: ""
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
          <Route exact path="/" component={ManagersPage}/>
          <Route path="/login" component={loginPage}/>
          <Route path="/totallydifferentlogin"  component={login2Page}/>
          <Route path="/account" render={() => this.renderAccountPage()}/>
          <Route path="/about" render={() => this.renderAboutUsPage()}/>
          <Route path="/origin" render={() => this.renderOriginPage()}/>
          <Route path="/invest" render={() => this.renderInvestPage()}/>

          <Route path="/legal" render={() => this.renderLegalPage()}/>
          <Route path="/methodology" render={() => this.renderMethodologyPage()}/>
          <Route path="/press" render={() => this.renderPressPage()}/>
          <Route path="/help center" render={() => this.renderHelpCenterPage()}/>
          <Route path="/blog" render={() => this.renderBlogPage()}/>

          <Route path="/manager/:id" component={ManagerPage}/>
          <Route path="/algorythm/:id" render={({match}) => this.renderAlgorythmPage(match)}/>
          <Route path="/portfolio/:id" render={({match}) => this.renderPortfolioPage(match)}/>
          <Route path="/request/:id" component={ManagerPage}/>

          <Route path="/portfolios" render={() => this.renderPortfoliosPage()}/>
          <Route path="/managers" component={ManagersPage}/>
          <Route path="/algorythms" render={() => this.renderAlgorythmsPage()}/>
          <Route path="/requests" component={RequestsPage}/>

          <Route path="/static form" render={() => this.renderStaticFormPage()}/>
          <Route path="/dynamic form" render={() => this.renderDynamicFormPage()}/>
          <Route path="/agreement" component={AgreementPage}/>
          <Route path="/manager form" render={() => this.renderManagerFormPage()}/>
          <Route path="/thanks" render={() => this.renderThanksPage()}/>
          <Route path="/thanks2" render={() => this.renderThanks2Page()}/>
          <Route path="/register" component={RegisterPage}/>
          <Route path="/money" render={() => this.renderMoneyPage()}/>
          <Route path="/kyc" component={KYCPage}/>
          <Route path="/investor register" component={InvestorRegistorPage}/>
          <Route path="/accept" render={() => this.renderAcceptPage()}/>

          <Route path="/chat" render={() => this.renderChatPage()}/>
          <Route path="/decline" render={() => this.renderDeclinePage()}/>
          <Route path="/faq" render={() => this.renderFAQPage()}/>
          <Route path="/team" render={() => this.renderTeamPage()}/>
          <Route path="/contact" render={() => this.renderContactPage()}/>
          <Route path="/investor-ua" render={() => this.renderInvestorUserAgreementPage()}/>
          <Route path="/manager-ua" render={() => this.renderManagerUserAgreementPage()}/>

          <Route path="/email" render={() => this.renderEmailPage()}/>
          <Route path="/logout" component={ManagersPage}/>

          <Route path="/portfoliocreation" render={() => this.renderPortfolioCreationPage()}/>
          <Route path="/signagreement" component={AgreementPage}/>
          <Route path="/supported-browsers" render={() => this.renderSupportedBrowsersPage()}/>

          <Route path="/manager-reg" component={ManagerRegPage}/>
          <Route path="/manager-detailing" component={ManagerDetailingPage}/>
        </Switch>
    );
  }

  // renderLoginPage() {
  //   return (
  //     <div className="container">
  //       <LoginForm title="" tryLogin={(login, password) => this.tryLogin(login, password)} setPage={(page, id) => this.setPage(page, id)}/>
  //       {/* <LoginForm title="Log in as Manager" tryLogin={(login, password) => this.tryLogin(login, password)} />
  //       <LoginForm title="Log in as Data Supplier" tryLogin={(login, password) => this.tryLogin(login, password)} /> */}
  //     </div>
  //   );
  //   return (
  //     <div className="login-box">
  //       <h3>Welcome back</h3>
  //       <b>Email</b>
  //       <input type="text" value={this.state.login} onChange={(event) => setReduxState({ login: event.target.value })} placeholder="me@example.com" />
  //       <b>Password</b>
  //       <input type="password" value={this.state.password} onChange={(event) => setReduxState({ password: event.target.value })} placeholder="password" />
  //       {/* <h3>Choose your role</h3>
  //       <select>
  //         <option onClick={() => setReduxState({ login: "investor", password: "123" })}>investor</option>
  //         <option onClick={() => setReduxState({ login: "manager", password: "123" })}>manager</option>
  //       </select> */}
  //       <button className="login" onClick={() => this.tryLogin()}>Log in</button>
  //     </div>
  //   );
  // }
  // renderLogin2Page() {
  //   return (
  //     <div>
  //       <LoginForm title="Login for Wealth Managers" tryLogin={(login, password) => this.tryLogin(login, password)} setPage={(page, id) => this.setPage(page, id)} />
  //       {/* <LoginForm title="Log in as Manager" tryLogin={(login, password) => this.tryLogin(login, password)} />
  //       <LoginForm title="Log in as Data Supplier" tryLogin={(login, password) => this.tryLogin(login, password)} /> */}
  //     </div>
  //   );
  //   return (
  //     <div className="login-box">
  //       <h3>Welcome back</h3>
  //       <b>Email</b>
  //       <input type="text" value={this.state.login} onChange={(event) => setReduxState({ login: event.target.value })} placeholder="me@example.com" />
  //       <b>Password</b>
  //       <input type="password" value={this.state.password} onChange={(event) => setReduxState({ password: event.target.value })} placeholder="password" />
  //       {/* <h3>Choose your role</h3>
  //       <select>
  //         <option onClick={() => setReduxState({ login: "investor", password: "123" })}>investor</option>
  //         <option onClick={() => setReduxState({ login: "manager", password: "123" })}>manager</option>
  //       </select> */}
  //       <button className="login" onClick={() => this.tryLogin()}>Log in</button>
  //     </div>
  //   );
  // }

  renderPortfoliosPage() {
    var currentPage;
    var currencies = this.state.currentCurrencyPrices.map((c, i) =>
      <option key={i} value={c.name}>{c.name}</option>
    );
    var currentCurrency = this.state.currentCurrencyPrices.find(c => c.name == this.state.currentCurrency);
    var totalValue = this.state.portfolios
      .map(p => {
        var price = this.state.currentCurrencyPrices.find(c => c.name == p.currency).price;
        // return (p.value - p.cost) * price;
        return p.value * price;
      })
      .reduce((a, b) => a + b);

    var titles = [
      {
        title: "#",
        tooltip: "number",
        class: "number",
      },
      {
        title: "portfolio",
        tooltip: "number of portfolio",
        class: "number-portfolio",
      },
      {
        title: "smart-cntract",
         tooltip: "number of smart contract",
        class: "number-smart",
      },
      {
        title: "instrument",
        tooltip: "name of algorythm",
        class: "instrument",
      },
      {
        title: "profit",
        tooltip: "current profit",
        class: "profit",
      },
      {
        title: "value",
        tooltip: "value of portfolio",
        class: "value",
      },
      {
        title: "status",
        tooltip: "status of portfolio",
        class: "status",
      },
      {
        title: "cost",
        tooltip: "commision",
        class: "cost",
      },
    ];
    var portfolios = this.state.portfolios.map(portfolio => {
      var investor = this.state.investors.find(inv => inv.id == portfolio.investor);
      var manager = this.state.managers.find(m => m.id == portfolio.manager);
      var alg = this.state.algorythms.find(alg => alg.id == portfolio.alg);
      var price = this.state.currentCurrencyPrices.find(c => c.name == portfolio.currency).price;

      return {
        type: "portfolio",
        id: portfolio.id,
        number: "",
        number_portfolio: "1000" + portfolio.id,
        number_smart: "23" + (portfolio.id + 3) + (portfolio.id * 2) + "7" + ((portfolio.id + 1) * 7),
        instrument: alg.name,
        profit: "тут будет график",//portfolio.profit,
        // currency: portfolio.currency,
        // percent_portfolio: (portfolio.value * price / totalValue * 100).toFixed(1),
        // amount: portfolio.value,
        value: (portfolio.value * price / currentCurrency.price).toFixed(3) + " " + currentCurrency.name,
        status: portfolio.status,
        cost: "тут будет график",//(portfolio.cost * price / currentCurrency.price).toFixed(3) + " " + currentCurrency.name,
        // analysis: "link.com",
        // comments: "comment",
      };
    });

    var statistics;

    switch (this.state.currentPortfoliosPage) {
      case "active":
        currentPage = (
          <div className="box">
            <h4>Active Portfolios</h4>
            <Sortable
              titles={titles}
              listings={portfolios}
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
          </div>
        );
        break;
      case "archived":
        currentPage = (
          <div className="box">
            <h4>Archived Portfolios</h4>
            <Sortable
              titles={titles}
              listings={portfolios}
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
          </div>
        );
        break;
      case "statistics":
        currentPage = (
          <div className="box">
            <h4>Statistics</h4>
            {statistics}
          </div>
        );
        break;
      /* NEW ONES */
      case "proposed":
        currentPage = (
          <div className="box">
            <h4>Proposed Portfolios</h4>
            <Sortable
              titles={titles}
              listings={portfolios}
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
          </div>
        );
        break;
        case "revision":
          currentPage = (
            <div className="box">
              <h4>Portfolios on revision</h4>
              <Sortable
                titles={titles}
                listings={portfolios}
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
            </div>
          );
          break;
          case "recalculated":
            currentPage = (
              <div className="box">
                <h4>Recalculated Portfolios</h4>
                <Sortable
                  titles={titles}
                  listings={portfolios}
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
              </div>
            );
            break;
    }

    return (
      <div>
        <div className="second-header">
          <div className="container">
            <div className="title">
              <h2>My Portfolios</h2>
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
          <div className="upper-tab">
            <div className="box">
              <button className="transactions-link" onClick={() => setReduxState({ currentPortfoliosPage: "proposed" })}>Proposed (Initial)</button>
              <button className="transactions-link" onClick={() => setReduxState({ currentPortfoliosPage: "active" })}>Active</button>
              <button className="transactions-link" onClick={() => setReduxState({ currentPortfoliosPage: "revision" })}>Revision</button>
              <button className="transactions-link" onClick={() => setReduxState({ currentPortfoliosPage: "recalculated" })}>Recalculated</button>
              <button className="transactions-link" onClick={() => setReduxState({ currentPortfoliosPage: "archived" })}>Archived</button>
              <button className="transactions-link" onClick={() => setReduxState({ currentPortfoliosPage: "statistics" })}>Statistics</button>
            </div>
          </div>
          {currentPage}
        </div>
      </div>
    );
  }

  // renderManagersPage() {
  //   var titles = [
  //     {
  //       title: "#",
  //       tooltip: "number",
  //       class: "number",
  //     },
  //     {
  //       title: "",
  //       tooltip: "",
  //       class: "none",
  //     },
  //     {
  //       title: "Name",
  //       tooltip: "manager name",
  //       class: "name",
  //     },
  //     {
  //       title: "Success rate",
  //       tooltip: "rating",
  //       class: "rating",
  //     },
  //     {
  //       title: "number of clients",
  //       tooltip: "number of clients",
  //       class: "clients",
  //     },

  //     {
  //       title: "AUM",
  //       tooltip: "AUM",
  //       class: "aum",
  //     },
  //     {
  //       title: "% of Net Assets",
  //       tooltip: "% of Net Assets",
  //       class: "assets",
  //       upper: "Expense ratio",
  //     },
  //     {
  //       title: "% of Perfomance",
  //       tooltip: "% of Perfomance",
  //       class: "profit",
  //       upper: "Expense ratio",
  //     },
  //     {
  //       title: "% Front fee",
  //       tooltip: "% Front fee",
  //       class: "initial",
  //       upper: "Expense ratio",
  //     },
  //     {
  //       title: "% exit Fee",
  //       tooltip: "% Exit fee",
  //       class: "output",
  //       upper: "Expense ratio",
  //     },
  //     {
  //       title: "minimum investment",
  //       tooltip: "minimum investment",
  //       class: "annual",
  //     },
  //     {
  //       title: "6M AUM Graph",
  //       tooltip: "6M AUM Graph",
  //       class: "aum6",
  //     },
  //     {
  //       title: "",
  //       tooltip: "",
  //       class: "none",
  //     },
  //   ];
  //   var managers = this.state.managers.map(manager => {
  //     return {
  //       type: "manager",
  //       id: manager.id,
  //       number: "",
  //       img: "manager/" + manager.img,
  //       name: manager.name + " " + manager.surname,
  //       rating: manager.rating,
  //       clients: manager.clients,

  //       // aum: <img src="graph.png" className="graph" />,
  //       // assets: <img src="graph.png" className="graph" />,
  //       // profit: <img src="graph.png" className="graph" />,
  //       aum: 10,
  //       assets: 10,
  //       profit: 10,
  //       initial: manager.initial,
  //       output: manager.output,
  //       annual: manager.annual,
  //       aum6: <img src="graph.png" className="graph" />,
  //       cart: <img src="cart.png" className="graph" />,
  //     };
  //   });

  //   var filters = [
  //     {
  //       link: "Robo-advisor",
  //       description: "Invest on Autopilot",
  //     },
  //     {
  //       link: "Discretionary",
  //       description: "Get The Right Investment Manager For Your Wealth",
  //     },
  //     {
  //       link: "Advisory",
  //       description: "Find The Right Advisory Support For Your Own Decisions On Investment Management",
  //     }
  //   ];
  //   var filtersMapped = filters.map((filter, i) =>
  //     <button key={i} className={"blue-link left" + (this.state.managersFilter == filter.link ? " active" : "")} onClick={() => setReduxState({managersFilter: filter.link})}>
  //       {filter.link}
  //     </button>
  //   );

  //   return (
  //     <div>
  //       <div className="long-header"></div>
  //       <div className="container">
  //         <div className="box">
  //           <h3>Marketplace</h3>
  //           <div className="row">
  //             <div className="column center">
  //               {filtersMapped}
  //             </div>
  //           </div>
  //           <div className="row-padding">
  //             {filters.find(filter => filter.link == this.state.managersFilter).description}
  //             <Link to="faq" className="grey-link" onClick={() => {this.setPage("faq"); setReduxState({faqId: filters.find(filter => filter.link == this.state.managersFilter).link})}}>
  //               Learn more
  //             </Link>
  //           </div>
  //           <div className="row-padding">
  //             <div className="fourth">
  //               Total investors: 3
  //             </div>
  //             <div className="fourth">
  //               Total managers: 3
  //             </div>
  //             <div className="fourth">
  //               Total AUM: 3 mln $
  //             </div>
  //           </div>
  //           <div className="row-padding">
  //             <Sortable
  //               titles={titles}
  //               listings={managers}
  //               setPage={this.setPage.bind(this)}
  //               currencySelector={
  //                 <select value={this.state.currentCurrency} onChange={this.setCurrency.bind(this)}>
  //                   {
  //                     this.state.currentCurrencyPrices.map((c, i) =>
  //                       <option key={i} value={c.name}>{c.name}</option>
  //                     )
  //                   }
  //                 </select>
  //               }
  //             />
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  renderAccountPage() {
    var changed = false;
    var accountPage;
    switch (this.state.currentAccountPage) {
      case "personal":
        accountPage = (
          <div className="box">
            {/* <div className="half padding-side">
              <h3 className="high">Personal Info</h3>
              <input type="text" placeholder="First Name"/>
              <input type="text" placeholder="Last Name"/>
              <input type="text" placeholder="day of birth"/>
              <input type="text" placeholder="month"/>
              <input type="text" placeholder="year"/>
              <input type="text" placeholder="nationality"/>
            </div> */}
            <div className="half padding-side">
              <h3 className="high">Contact information</h3>
              <input type="text" placeholder="email"/>
              <input type="text" placeholder="phone number"/>
              <h3 className="high">Change password</h3>
              <input type="password" placeholder="old password"/>
              <input type="password" placeholder="new password"/>
              <input type="password" placeholder="repeat new password"/>
            </div>
            <div className="row-padding">
              <button className={changed ? "continue" : "continue"}>Save changes</button>
            </div>
          </div>
        );
        break;
        case "kyc":
          accountPage = (
            <div className="box">
              <div className="half padding-side">
                <h3 className="high">Personal Info</h3>
                <input type="text" placeholder="First Name"/>
                <input type="text" placeholder="Last Name"/>
                <input type="text" placeholder="phone number"/>
                <input type="text" placeholder="day of birth"/>
                <input type="text" placeholder="month"/>
                <input type="text" placeholder="year"/>
                <input type="text" placeholder="nationality"/>
              </div>
              <div className="half padding-side">
                <h3 className="high">Address Information</h3>
                <input type="text" placeholder="Street Address"/>
                <input type="text" placeholder="Postal Code"/>
                <input type="text" placeholder="City"/>
                <input type="text" placeholder="State"/>
                <input type="text" placeholder="Country"/>
              </div>
              {/* <div className="row-padding">
                <button className={changed ? "continue" : "continue"}>Save changes</button>
              </div> */}
                <div className="row padding-side">
                  <h3 className="high">ID or Passport</h3>
                  <p>Please upload a photo or a scan of the following:</p>
                  <div className="document-box">
                    <h3 className="text-center">ID or Passport</h3>
                    <div className="row">
                      <button className="continue">UPLOAD DOCUMENT</button>
                    </div>
                  </div>
                  <div className="document-box">
                    <h3 className="text-center">Selfie holding ID or Passport</h3>
                    <div className="row">
                      <button className="continue">UPLOAD DOCUMENT</button>
                    </div>
                  </div>
                </div>
            </div>
          );
          break;
      case "risk":
        accountPage = (
          <div className="box">
            <h3>Risk Tollerance Profile</h3>
            Your tisk profile: 25%;
            <div className="row-padding">
              <button className="continue">Change results</button>
            </div>
          </div>
        );
        break;
      case "inv":
        accountPage = (
          <div className="box">
            <h3>Investment goals and strategy aims</h3>
            You are investing for:
            <ul>
              <li>living</li>
              <li>journeys</li>
            </ul>
            <div className="row-padding">
              <button className="continue">Change results</button>
            </div>
          </div>
        );
        break;
    }
    return (
      <div>
        {/* {this.renderBackButton()} */}
        <div className="container">
          <h1>Account</h1>
          <div className="first-tab">
            {accountPage}
          </div>
          <div className="second-tab">
            <div className="box">
              {/* <button className="transactions-link" onClick={() => setReduxState({ currentAccountPage: "personal" })}>Personal Info</button>
              <button className="transactions-link" onClick={() => setReduxState({ currentAccountPage: "address" })}>Address details</button>
              <button className="transactions-link" onClick={() => setReduxState({ currentAccountPage: "ID" })}>ID confirmation</button>
              <button className="transactions-link" onClick={() => setReduxState({ currentAccountPage: "residency" })}>Residency</button>
              <button className="transactions-link" onClick={() => setReduxState({ currentAccountPage: "forms" })}>Fill forms</button>
              <button className="transactions-link" onClick={() => setReduxState({ currentAccountPage: "kyc" })}>Know Your Criminals</button> */}
              <button className="transactions-link" onClick={() => setReduxState({ currentAccountPage: "personal" })}>Account Information</button>
              {this.state.user == 1 ? "" : <button className="transactions-link" onClick={() => setReduxState({ currentAccountPage: "risk" })}>Risk Tollerance Profile</button>}
              {this.state.user == 1 ? "" : <button className="transactions-link" onClick={() => setReduxState({ currentAccountPage: "inv" })}>Investment goals and strategy aims</button>}
              <button className="transactions-link" onClick={() => setReduxState({ currentAccountPage: "kyc" })}>Detailed information (kyc)</button>
            </div>
          </div>
        </div>
      </div>
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

  // renderManagerPage(match) {
  //   var manager = this.state.managers.find(manager => manager.id == match.params.id);
  //   var company = this.state.companies.find(company => company.id == manager.company);
  //   var companies;
  //   var algs = this.state.algorythms.filter(alg => {
  //     return alg.creator == manager.id;
  //   });
  //   if (this.state.currentManager !== manager.id) 
  //     setReduxState({
  //       currentManager: manager.id,
  //       currentAlgorythm: this.state.algorythms.find(algorythm => algorythm.creator === manager.id).id
  //     });
  //   console.log(`currentAlgorythm set as ${this.state.currentAlgorythm}`);
  //   // }).map(alg =>
  //   //   <div className="manager-listing" onClick={() => this.setPage("algorythm", alg.id)}>
  //   //     <h4>{alg.name}</h4>
  //   //     <p className="grey">rating {alg.rating}/10</p>
  //   //   </div>
  //   // );

  //   return (
  //     <div>
  //       {/* {this.renderBackButton()} */}
  //       <div className="container">
  //         <div className="first-tab">
  //           <div className="manager-box">
  //             <div className="cover"></div>
  //             <div className="info">
  //               <div className="circle">
  //                 <img src={"manager/" + manager.img} className="avatar" />
  //               </div>
  //               <h2 className="text-center">{manager.name} {manager.surname}</h2>
  //               <h4 className="text-center">Age {manager.age}</h4>
  //               <div className="row-padding">
  //                 <div className="column center">
  //                   {/* {this.state.user !== -1 ? (<button className="back">Contact</button>) : ""} */}
  //                   <Link to={"/contact"} onClick={() => this.setPage("contact")}>
  //                     <button className="back">Contact</button>
  //                   </Link>
  //                   <Link to="/register" onClick={() => this.setPage("register")}>
  //                     <button className="continue">Apply now</button>
  //                   </Link>
  //                 </div>
  //               </div>
  //             </div>
  //           </div>

  //             <div className="box">
  //               <h4>Fees</h4>
  //               {/* <p>Manager will ask you to agree with</p>
  //               <ul>
  //                 <li>Condition 1</li>
  //                 <li>Condition 2</li>
  //                 <li>Condition 3</li>
  //                 <li>Condition 4</li>
  //               </ul>
  //               <p>and also</p>
  //               <ul>
  //                 <li>Condition 1</li>
  //                 <li>Condition 2</li>
  //                 <li>Condition 3</li>
  //                 <li>Condition 4</li>
  //               </ul> */}
  //               {manager.terms}
  //             </div>

  //             <div className="box margin-right row">
  //               <div className="third">
  //                 <p className="blue">Social networks:</p>
  //                 <button className="facebook"></button>
  //                 <button className="twitter"></button>
  //                 <button className="linkedin"></button>
  //               </div>
  //               <div className="two-third">
  //                 <p className="blue">Biography:</p><p> {manager.biography}</p>
  //               </div>
  //             </div>
  //             {/* <div className="half-box">
  //               <div className="circle left">
  //                 <img src={"companies/" + company.img} className="avatar" />
  //               </div>
  //               <div className="half">
  //                 <p className="blue">Company</p>
  //                 <h3>{company.name}</h3>
  //                 <a>{company.site}</a>
  //               </div>
  //               <div className="row">
  //                 <p className="blue">Social networks:</p>
  //                 <button className="facebook"></button>
  //                 <button className="twitter"></button>
  //                 <button className="linkedin"></button>
  //               </div>
  //             </div>            */}

  //         </div>
  //         <div className="second-tab">
  //           <div className="box">
  //             <div className="circle left">
  //               <img src={"manager/companies/" + company.img} className="avatar" />
  //             </div>
  //             <div className="row">
  //               <p className="blue">Company</p>
  //               <h3>{company.name}</h3>
  //               <div className="row tridot">
  //                 <a>{company.site}</a>
  //               </div>
  //             </div>
  //             <div className="row">
  //               <p className="blue">Social networks:</p>
  //               <button className="facebook"></button>
  //               <button className="twitter"></button>
  //               <button className="linkedin"></button>
  //             </div>
  //           </div>
  //           <div className="box">
  //             <p className="blue">Methodology:</p><p> {manager.methodology}</p>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   )
  // }

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

  renderStaticFormPage() {
    var form = this.state.staticQuestions.map((question, i) =>
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
              <h2>Risk Tolerance Profile Questions</h2>
              <h4 className="grey">Asked once</h4>
              {form}
              <div className="row-padding">
                <Link to={"/agreement"}>
                  <button className="back" onClick={() => this.prevousPage()}>Back</button>
                </Link>
                <Link to={"/dynamic form"}>
                  <button className="continue" onClick={() => this.setPage("dynamic form")}>Continue</button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  renderDynamicFormPage() {
    var form = this.state.dynamicQuestions.map((question, i) =>
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
              <h2>Investement Goals & Strategy Aims</h2>
              <h4 className="grey">Asked every month (or quarter/year)</h4>
              {form}
              <div className="row-padding">
                <Link to={"/static form"}>
                  <button className="back" onClick={() => this.prevousPage()}>Back</button>
                </Link>
                <Link to={this.state.currentManager !== -1 ? "/manager form" : "/investor register"}>
                  <button className="continue" onClick={() => this.setPage(this.state.currentManager !== -1 ? "manager form" : "investor register")}>Continue</button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // renderAgreementPage() {
  //   return (
  //     <div>
  //       {/* {this.renderBackButton()} */}
  //       {this.renderProgressBar()}
  //       <div className="container">
  //         <div className="box">
  //           <h1 className="text-center">Agreement</h1>
  //           {/* <p>U agree with that by the way</p>
  //           <ul>
  //             <li>Condition 1</li>
  //             <li>Condition 2</li>
  //             <li>Condition 3</li>
  //             <li>Condition 4</li>
  //           </ul>
  //           <p>U agree with that too</p>
  //           <ul>
  //             <li>Condition 1</li>
  //             <li>Condition 2</li>
  //             <li>Condition 3</li>
  //             <li>Condition 4</li>
  //           </ul>
  //           <p>U agree with that also</p>
  //           <ul>
  //             <li>Condition 1</li>
  //             <li>Condition 2</li>
  //             <li>Condition 3</li>
  //             <li>Condition 4</li>
  //           </ul> */}
  //           {newLines(this.state.agreement)}
  //           <div className="row-padding">
  //             <Link to={"/email"}>
  //               <button className="back" onClick={() => this.prevousPage()}>Back</button>
  //             </Link>
  //             <Link to={"/static form"}>
  //               <button className="continue" onClick={() => { this.setPage("static form"); setReduxState({ user: 0 }); }}>Agree</button>
  //             </Link>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  renderSignAgreementPage() {
    return (
      <div>
        {this.renderProgressBar()}
        <div className="container">
          <div className="box">
            <div className="container">
              <h2>Sign Agreement</h2>
              <p>Please download and fill this form. Then scan and upload it back to the site.</p>
              <div className="document-box">
                <h3 className="text-center">Agreement form</h3>
                <div className="row">
                  <button className="continue">DOWNLOAD FILE</button>
                </div>
              </div>
              <div className="document-box">
                <h3 className="text-center">Filled Agreement form</h3>
                <div className="row">
                  <button className="continue">UPLOAD FILE</button>
                </div>
              </div>
              <div className="row-padding">
                <Link to={"/accept"}>
                  <button className="back" onClick={() => this.prevousPage()}>Back</button>
                </Link>
                <Link to={"/money"}>
                  <button className="continue" onClick={() => this.setPage("KYC")}>Continue</button>
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

  // renderRegisterPage() {
  //   return(
  //     <div>
  //       {/* {this.renderBackButton()} */}
  //       {this.renderProgressBar()}
  //       <div className="container">
  //         <div className="box">
  //           <h2>Registration page</h2>
  //           {/* <div className="row-padding">
  //             <b>Name</b>
  //             <div className="row">
  //               <input type="text" placeholder="John" />
  //             </div>
  //             <b>Surname</b>
  //             <div className="row">
  //               <input type="text" placeholder="Appleseed" />
  //             </div>
  //             <b>Email</b>
  //             <div className="row">
  //               <input type="text" placeholder="me@example.com" />
  //             </div>
  //             <b>Password</b>
  //             <div className="row">
  //               <input type="password" placeholder="password" />
  //             </div>
  //             <b>Repeat password</b>
  //             <div className="row">
  //               <input type="password" placeholder="repeat password" />
  //             </div>
  //           </div> */}
  //             <div className="row">
  //               <b>Email</b>
  //             </div>
  //             <div className="row">
  //               <input type="text" value={this.state.login} onChange={(event) => setReduxState({ login: event.target.value })} placeholder="me@example.com" />
  //             </div>
  //             <div className="row">
  //               <b>Password</b>
  //             </div>
  //             <div className="row">
  //               <input type="password" value={this.state.password} onChange={(event) => setReduxState({ password: event.target.value })} placeholder="password" />
  //             </div>
  //             <div className="row-padding">
  //             <Link to={("/manager" + this.state.currentManager)}>
  //               <button className="back" onClick={() => this.prevousPage()}>Back</button>
  //             </Link>
  //             <Link to={"/email"}>
  //               <button className="continue" onClick={() => this.setPage("agreement")}>Register</button>
  //             </Link>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  // renderKYCPage() {
  //   return(
  //     <div>
  //       {/* {this.renderBackButton()} */}
  //       {this.renderProgressBar()}
  //       <div className="container">
  //         <div className="box">
  //           <h2>Know Your Criminals</h2>
  //           <div className="row-padding">
  //             <p>by clicking send, u send this data to manager</p>
  //           </div>
  //           <div className="row-padding">
  //             <Link to={"/manager form"}>
  //               <button className="back" onClick={() => this.prevousPage()}>Back</button>
  //             </Link>
  //             <Link to={"/thanks2"}>
  //               <button className="continue" onClick={() => this.setPage("thanks2")}>Send to manager</button>
  //             </Link>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

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

  renderMoneyPage() {
    return (
      <div>
        {/* {this.renderBackButton()} */}
        {this.renderProgressBar()}
        <div className="container">
          <div className="box">
            <h2>Send Money</h2>
            <div className="row">
              <button className="show-code" onClick={() => setReduxState({showCode: !this.state.showCode})}>{this.state.showCode ? "Hide" : "Show"} Smart-contract code</button>
              <div className={"code-container " + (this.state.showCode ? "show" : "hide")}>
                {newLines(this.state.code)}
              </div>
            </div>
            <div className="row">
              <ol type="1">
                <li>
                  Please choose your Ethereum wallet
                </li>
                <li>
                  Check that you have enough money on it to invest
                </li>
                <li>
                  Copy this address of smart-contract <b className="eth-address">0x3a8b4013eb7bb370d2fd4e2edbdaf6fd8af6a862</b>
                </li>
                <li>
                  Go to your Ethereum wallet and paste the address of smart-contract as destination address
                </li>
                <li>
                  Submit the money transfer
                </li>
              </ol>
            </div>
            <div className="row-padding">
              As soon as transaction is accomplished you can follow the details and statistics at <Link to={"/portfolios"} onClick={() => this.setPage("portfolios")}>Portfolio page</Link>
            </div>
            <div className="row-padding">
              <Link to="/signagreement">
                <button className="back" onClick={() => this.prevousPage()}>Back</button>
              </Link>
              <Link to="/portfolios">
                <button className="continue" onClick={() => this.setPage("portfolios")}>Finish</button>
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

  // renderRequestsPage() {
  //   var requests = this.state.requests.slice().map((request, index) => {
  //     var investor = this.state.user == 1 ? this.state.investors.find(i => i.id == request.investor) : this.state.managers.find(i => i.id == request.manager);
  //     var date = new myDate(request.date);
  //     var registered;
  //     var daysInSystem;
  //     if (this.state.user == 1) {
  //       registered = new myDate(investor.registered);
  //       daysInSystem = registered.pastMonths();
  //     }

  //     return {
  //       type: "request",
  //       id: request.id,
  //       number: "",
  //       img: (this.state.user == 1 ? "investor/" : "manager/") + (investor.img || ''),
  //       // id_shown: "1000" + investor.id,
  //       name: investor.name + " " + investor.surname,
  //       date: date.getTime(),
  //       // type_shown: daysInSystem >= 6 ? "old" : "new",
  //       // days: registered,
  //       // kyc: investor.kyc ? "yes" : "no",
  //       // value: (request.value * this.state.currentCurrencyPrices[request.currency]).toFixed(1) + " " + this.state.currentCurrency,
  //       status: request.status,
  //     };
  //   });

  //   return (
  //     <div>
  //       <div className="long-header"></div>
  //       <div className="container">
  //         <div className="box">
  //           <h2 className="text-center">My requests</h2>
  //           <Sortable
  //             listings={requests}
  //             setPage={this.setPage.bind(this)}
  //             currencySelector={
  //               <select value={this.state.currentCurrency} onChange={this.setCurrency.bind(this)}>
  //                 {
  //                   this.state.currentCurrencyPrices.map((c, i) =>
  //                     <option key={i} value={c.name}>{c.name}</option>
  //                   )
  //                 }
  //               </select>
  //             }
  //           />
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }
  // renderRequestPage(match) {
  //   var request = this.state.requests.find(r => r.id == match.params.id);
  //   var investor = this.state.user == 1 ? this.state.investors.find(i => i.id == request.investor) : this.state.managers.find(i => i.id == request.manager);
  //   var name;
  //   var age;
  //   if (investor.kyc == "yes") {
  //     name = <h4>{investor.name} {investor.surname}</h4>;
  //     age = <p>{investor.age} years old</p>;
  //   }
  //   else {
  //     name = <h4>{investor.email}</h4>;
  //     age = <p>KYC unfullfilled</p>;
  //   }

  //   var buttons = request.status == "accepted" ?
  //     (
  //       <div className="row-padding">
  //         <Link to={"/accept"} onClick={() => this.setPage("accept")}>
  //           <button className="continue right">Portfolio preview</button>
  //         </Link>
  //       </div>
  //     ) : "";
  //   if (this.state.user == 0)
  //     return (
  //       <div>
  //         <div className="container">
  //           <div className="first-tab">
  //             <div className="box">
  //               <div className="circle left">
  //                 <img src={("../manager/") + investor.img} className="avatar" />
  //               </div>
  //               <div className="third">
  //                 <h4>{investor.name} {investor.surname}</h4>
  //               </div>
  //               <div className="third text-right">
  //                 <p>request number {this.state.currentRequest}</p>
  //                 <p>{request.date}</p>
  //                 <p className={request.status}>{request.status}</p>
  //               </div>
  //               <div className="row-padding">
  //                 <Link to={"/chat"}>
  //                   <button className="continue" onClick={() => this.setPage("chat")}>Start chat</button>
  //                 </Link>
  //               </div>
  //               {buttons}
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //     );
  //   return (
  //     <div>
  //       {/* {this.renderBackButton()} */}
  //       <div className="container">
  //         <div className="first-tab">
  //           <div className="box">
  //             <div className="circle left">
  //               <img src={("../investor/") + investor.img} className="avatar" />
  //             </div>
  //             <div className="third">
  //               {name}
  //               <p>New client. 1   days on platform</p>
  //               {age}
  //               <p>client id 50{investor.id}00{investor.id}</p>
  //             </div>
  //             <div className="third text-right">
  //               <p>request number {this.state.currentRequest}</p>
  //               <p>{request.date}</p>
  //             </div>
  //             <div className="row-padding">
  //               <Link to={"/chat"}>
  //                 <button className="continue" onClick={() => this.setPage("chat")}>Start chat</button>
  //               </Link>
  //             </div>
  //             <p>Target value: {request.value}{request.currency}</p>
  //             <p>Term 4 month</p>
  //             <p>Risk profile: 25%</p>
  //             <p>Target earning rate</p>
  //             <div className="row-padding">
  //               <Link to={"/portfoliocreation"} onClick={() => this.setPage("portfoliocreation")}>
  //                 <button className="continue right">Accept</button>
  //               </Link>
  //               <Link to={"/decline"} onClick={() => this.setPage("decline")}>
  //                 <button className="back right">Decline</button>
  //               </Link>
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //       <div>
  //         {/* {this.renderBackButton()} */}
  //         <div className="container">
  //           <div className="first-tab">
  //             <div className="box">
  //               <div className="circle left">
  //                 <img src={("../investor/") + investor.img} className="avatar" />
  //               </div>
  //               <div className="third">
  //                 {name}
  //                 <p>New client. 1   days on platform</p>
  //                 {age}
  //                 <p>client id 50{investor.id}00{investor.id}</p>
  //               </div>
  //               <div className="third text-right">
  //                 <p>request number {this.state.currentRequest}</p>
  //                 <p>{request.date}</p>
  //               </div>
  //               <div className="row-padding">
  //                 <Link to={"/chat"}>
  //                   <button className="continue" onClick={() => this.setPage("chat")}>Start chat</button>
  //                 </Link>
  //               </div>
  //               <p>Target value: {request.value}{request.currency}</p>
  //               <p>Term 4 month</p>
  //               <p>Risk profile: 25%</p>
  //               <p>Target earning rate</p>
  //               <div className="row-padding">
  //                 <Link to={"/portfoliocreation"} onClick={() => this.setPage("portfoliocreation")}>
  //                   <button className="continue right">Accept</button>
  //                 </Link>
  //                 <Link to={"/decline"} onClick={() => this.setPage("decline")}>
  //                   <button className="back right">Decline</button>
  //                 </Link>
  //               </div>
  //             </div>
  //           </div>
  //         </div>
  //       </div>      </div>
  //   );
  // }
  renderPortfolioPage(match) {
    var portfolio = this.state.portfolios.find(p => p.id == match.params.id);
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

    return (
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
        {/* {this.renderBackButton()} */}
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
            <p>Risk profile: 25%</p>
            <p>Target earning rate</p>
            {/* <img className="portfolio" src="../portfolio.jpg" />
            <div className="row-padding">
              <button className="back right" onClick={() => this.prevousPage()}>Delete</button>
            </div> */}
          </div>
          <div className="box">
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

  renderDeclinePage() {
    return (
      <div>
        {/* {this.renderBackButton()} */}
        <div className="container">
          <div className="box">
            <h3>Reason for decline</h3>
            <div className="row-padding">
              <label htmlFor="1">
                <input type="checkbox" id="1" />
                Insufficient information
              </label>
            </div>
            <div className="row-padding">
              <label htmlFor="2">
                <input type="checkbox" id="2" />
                Information is unacceptable
              </label>
            </div>
            <div className="row-padding">
              <label htmlFor="3">
                <input type="checkbox" id="3" />
                Other
              </label>
            </div>
            <div className="row-padding">
              <textarea rows="4" cols="50" placeholder="Comment">
                {}
              </textarea>
            </div>
            <div className="row-padding">
              <Link to={"/request/" + this.state.currentRequest} onClick={() => this.setPage("request", this.state.currentRequest)}>
                <button className="back">Back</button>
              </Link>
              <Link to={"/requests"} onClick={() => this.setPage("requests")}>
                <button className="continue">Submit</button>
              </Link>
            </div>
          </div>
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

  renderPortfolioCreationPage() {
    var set = "USD";
    var tokens = this.state.tokens.map((token, index) =>
      <li key={index}>
        <div className="number">
          {index + 1}
        </div>
        <div className="check">
          <input type="checkbox"></input>
        </div>
        <div className="currency">
          {token.name}
        </div>
        <div className="percent">
          <input type="number"></input>
        </div>
        <div className="amount">
          0
        </div>
        <div className="value">
          {set}
        </div>
        <div className="comments last">
          <input type="text"></input>
        </div>
        <div className="analysis last">
          <input type="text"></input>
        </div>
      </li>
    );
    var request = this.state.requests.find(r => r.id == this.state.currentRequest);
    var investor = this.state.investors.find(i => i.id == request.investor);
    var name;
    var age;
    if (investor.kyc == "yes") {
      name = <h4>{investor.name} {investor.surname}</h4>;
      age = <p>{investor.age} years old</p>;
    }
    else {
      name = <h4>{investor.email}</h4>;
      age = <p>KYC unfullfilled</p>;
    }

    return (
      <div>
        <div className="container">
          <div className="box">
            <h3>Portfolio Creation</h3>

            <div className="circle left">
              <img src={"../investor/" + investor.img} className="avatar" />
            </div>
            <div className="third">
              {name}
              <p>New client. 1   days on platform</p>
              {age}
              <p>client id 50{investor.id}00{investor.id}</p>
            </div>
            <div className="third text-right">
              <p>request number {this.state.currentRequest}</p>
              <p>{request.date}</p>
            </div>
            <div className="row-padding">
              <Link to={"/chat"}>
                <button className="continue" onClick={() => this.setPage("chat")}>Start chat</button>
              </Link>
            </div>
            <p>Target value: {request.value}{request.currency}</p>
            <p>Term 4 month</p>
            <p>Risk profile: 25%</p>
            <p>Target earning rate</p>

            <ul className="token-listings">
              <li className="titles">
                <div className="number">
                  #
                </div>
                <div className="check">
                  Include
                </div>
                <div className="currency">
                  Currency
                </div>
                <div className="percent">
                  % in portfolio
                </div>
                <div className="amount">
                  Amount
                </div>
                <div className="value">
                  Value in set currency
                </div>
                <div className="comments last">
                  Comments
                </div>
                <div className="analysis last">
                  Analysis
                </div>
              </li>
              {tokens}
            </ul>
          </div>
          <div className="box">
            <div className="row">
              <div className="half">
                <h4>Fee</h4>
                <ul>
                  <div className="row">
                    <input type="checkbox" />
                      С прибыли
                  </div>
                  <div className="row">
                    <input type="checkbox" />
                      С объема
                  </div>
                  <div className="row">
                    <input type="checkbox" />
                      За вход
                  </div>
                  <div className="row">
                    <input type="checkbox" />
                      За выход
                  </div>
                </ul>
              </div>
              <div className="half">
                <h4>Frequency for recalculation</h4>
                <input placeholder="no more than"></input>
              </div>
            </div>
            <div className="row">
              <input placeholder="Comments"></input>
            </div>
            <div className="row-padding">
              <Link to="/portfolios" onClick={() => this.setPage("portfolios")}>
                <button className="continue right margin">Send</button>
              </Link>
              <button className="continue right margin">Save</button>
              <button className="continue right margin">Load Saved form</button>
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
          <Link to={"/" + link.link} className={link.link == "login" || link.link == "register" ? "login" : "link"} onClick={() => {(link.link == "logout" ? this.logout() : "")}}>
            {capitalize(link.label)}
          </Link>
        </li>
      );
    });
    var logo = this.state.user == -1 ? logoBlue : logoWhite;

    var logButton;
    if (this.state.user !== -1)
      logButton = (
        <Link to={"/"} className="login" onClick={() => this.logout()}>
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
          <header className={(this.state.user == -1 ? "header transparent" : "header") + (this.state.currentPage == "login" ? " invisible" : '')}>
            <div className="container">
              <Link to={(this.state.user == -1 ? "/managers" : "/portfolios")} onClick={() => this.setPage(this.state.user == -1 ? "managers" : "portfolios")}>
                <img src={logo} className="logo"/>
              </Link>
              <ul className="links right">
                {headerLinks}
              </ul>
            </div>
          </header>
          <div className="content">
            {this.renderPage()}
          </div>
          {footer}
        </article>
      </Router>
    );
  }
}

class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      login: "",
      password: "",
    }
  }

  render() {
    return (
      <div className="login-box">
        <div className="row">
          <img src={logoBlue} className="logo"/>
        </div>
        <h3>{this.state.title}</h3>
        <b>Email Address:</b>
        {/* <input type="text" value={this.state.login} onChange={(event) => this.setState({ login: event.target.value })} placeholder="me@example.com" /> */}
        <input type="text" value={this.state.login} onChange={(event) => this.setState({ login: event.target.value })} placeholder="Enter email" />
        <b>Password:</b>
        {/* <input type="password" value={this.state.password} onChange={(event) => this.setState({ password: event.target.value })} placeholder="password" /> */}
        <input type="password" value={this.state.password} onChange={(event) => this.setState({ password: event.target.value })} placeholder="Enter password" />
        {/* <b>Or via</b>
        <div className="row">
          <button className="facebook"></button>
          <button className="google"></button>
        </div> */}
        <Link to={"/portfolios"}>
          <button className="login" onClick={() => this.state.tryLogin(this.state.login, this.state.password)}>Log in</button>
        </Link>
        <div className="row-padding">
          <label htmlFor="remember">
            <input type="checkbox" id="remember" />
            Remember me
          </label>
        </div>
        <div className="row-padding">
          <span className="blue-text">Forgot password?</span>
        </div>
        <Link to={"/register"} onClick={() => this.state.setPage("register")}>
          <button className="register">Register</button>
        </Link>
        <div className="row text-center">
          <Link to="/supported-browsers" onClick={() => this.state.setPage("supported-browsers")}>
            <span className="blue-text">
              supported browsers
            </span>
          </Link>
        </div>
        {/* <div className="row-padding">
          <small>Not registered yet?</small>
          <Link to={"/register"}>Register</Link>
        </div> */}
      </div>
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
