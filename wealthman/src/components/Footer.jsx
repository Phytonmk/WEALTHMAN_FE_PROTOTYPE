import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Social from './Social';

import '../css/Footer.sass';

import AuthWindows from './AuthWindows'


class Footer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openSignUp: () => {},
    }
  }

  render() {
    return (
      <div className="footer">
        <AuthWindows
          openSignUp={(func) => this.setState({openSignUp: func})}
          forManagers={true}
        />
        <div className="container">
          <span>
            Copyright © 2018 Wealthman. All Rights Reserved. Privacy Policy
          </span>
          <div className="right">
            <Social links={[
              "https://t.me/wealthman_global",
              "https://www.facebook.com/WealthMan.io/",
              "https://www.instagram.com/wealthman.io/",
              "https://bitcointalk.org/index.php?topic=2006205"
            ]} />
          </div>
          <Link to={"https://wealthman.io/contact/"} className="right">
            <button className="big-blue-button">CONTACT US</button>
          </Link>
          <Link to={"faq"} className="right">
            <button className="big-blue-button">FAQ</button>
          </Link>
          {this.props.user === -1 ? <Link to={'#'} onClick={() => this.state.openSignUp()} className="right">
            <button className="big-blue-button">Registration for managers</button>
          </Link> : ''}
        </div>
      </div>
    );
  }
}

export default Footer;
