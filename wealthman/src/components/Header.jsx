import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { setReduxState } from './../redux/index';

import { api } from './helpers';

import logo from './../img/logo.svg';

import HeaderUserIcon from './HeaderUserIcon';

import '../css/Header.sass';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  render() {
    let headerLinks = [];
    switch(this.props.user) {
      case -1:
        headerLinks = this.props.unloggedLinks;
        break;
      case 0:
        headerLinks = this.props.loggedInvestorLinks;
        break;
      case 1:
        headerLinks = this.props.loggedManagerLinks;
        break;
      case 2:
        headerLinks = this.props.loggedSuplierLinks;
        break;
      case 3:
        headerLinks = this.props.loggedCompanyLinks;
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
          <Link
            to={"/" + link.link}
            className={link.link == "login" || link.link == "register" ? "big-blue-button" : "link"}
            onClick={() => {(link.link == "logout" ? this.logout() : "")}}
          >
            {capitalize(link.label)}
          </Link>
        </li>
      );
    });

    return (
      <header>
        <div className="contents">
          <div className="container">
            <Link to={(this.props.user == -1 ? "/managers" : "/portfolios")}>
              <img src={logo} className="logo"/>
            </Link>
            {
              this.props.user != -1 ?
                <HeaderUserIcon /> : ""
            }
            <ul className="links right">
              {headerLinks}
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
