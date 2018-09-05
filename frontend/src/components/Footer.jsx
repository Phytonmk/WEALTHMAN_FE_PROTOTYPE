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
          <p>
            Copyright © 2018 Wealthman. All Rights Reserved. <a href="https://wealthman.io/privacy-policy/" target="_blank">Privacy Policy</a>
          </p>
          <div className="right">
            <Social links={[
              "https://t.me/wealthman_global",
              "https://www.facebook.com/WealthMan.io/",
              "https://www.instagram.com/wealthman_platform/",
              "https://bitcointalk.org/index.php?topic=2006205"
            ]} />
          </div>
          <Link to={"contact"} className="right">
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
