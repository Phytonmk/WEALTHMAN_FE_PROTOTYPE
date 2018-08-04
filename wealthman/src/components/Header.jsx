import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { setReduxState } from './../redux/index';

import HeaderUserIcon from './HeaderUserIcon';
import AuthWindows from './AuthWindows'
import { api } from './helpers';

import logo from './../img/logo.svg';

import '../css/Header.sass';

class Header extends Component {
  constructor(props) {
    super(props)
    this.state = {
      openSignIn: () => {},
      openSignUp: () => {},
    }
    window.openSignUp = this.state.openSignUp
  }

  render() {
    let headerLinks = [];

    const loggedInvestorLinks = [
      {
        label: "summary",
        link: "dashboard"
      }, {
        label: "portfolio",
        link: "portfolios",
      }, {
        label: "marketplace",
        link: "managers"
      }
    ];
    const loggedManagerLinks = [
      {
        label: "dashboard",
        link: "dashboard"
      }, {
        label: "clients",
        link: "investors"
      }, {
        label: "companies",
        link: "managers"
      }, {
        label: "portfolio",
        link: "portfolios"
      }
    ]
    const loggedSuplierLinks = [
      {
        label: "some page",
        link: "sone"
      }
    ];
    const loggedCompanyLinks = [
      {
        label: "company managers",
        link: "company-managers"
      }, {
        label: "lonely managers",
        link: "managers"
      }
    ];
    const unloggedLinks = [
      {
        label: "About Wealthman",
        link: "about"
      }
    ];//, "login"],//, "invest"];

    switch(this.props.user) {
      case -1:
        headerLinks = unloggedLinks;
        break;
      case 0:
        headerLinks = loggedInvestorLinks;
        break;
      case 1:
        headerLinks = loggedManagerLinks;
        break;
      case 2:
        headerLinks = loggedSuplierLinks;
        break;
      case 3:
        headerLinks = loggedCompanyLinks;
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
      if (link.link == "logout")
        return;
      return (
        <li key={i} className="link" onClick={() => this.setPage(link.link)}>
          <NavLink
            to={"/" + link.link}
            className={link.link == "login" || link.link == "register" ? "big-blue-button" : "link"}
            onClick={() => {(link.link == "logout" ? this.logout() : "")}}
            activeClassName="selected"
          >
            {capitalize(link.label)}
          </NavLink>
        </li>
      );
    });

    return (
      <header>
        <AuthWindows
          openSignIn={(func) => this.setState({openSignIn: func})}
          openSignUp={(func) => {
            this.setState({openSignUp: func})
            window.openSignUp = func
          }}
          forManagers={false}
          />
        <div className="contents">
          <div className="container">
            <NavLink
              to={(this.props.user == -1 ? "/managers" : "/portfolios")}
              activeClassName="selected"
            >
              <img src={logo} className="logo"/>
            </NavLink>
            {
              this.props.user != -1 ?
                <HeaderUserIcon /> : ""
            }
            <ul className="links right">
              {headerLinks}
              {this.props.user != -1 ? '' :
              <React.Fragment>
                <button className="big-blue-button" onClick={() => this.state.openSignIn()}>
                  Sign In
                </button>
                <button className="big-blue-button margin-left" onClick={() => this.state.openSignUp()}>
                  Sign Up
                </button>
              </React.Fragment>}
            </ul>
          </div>
        </div>
      </header>
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

export default Header;
