import React, { Component } from 'react';
import $ from 'jquery';
import { setReduxState } from './../redux/index';
import { api, setPage, setCookie } from './helpers';
import { Link } from 'react-router-dom';
import Avatar from './Avatar';
import { connect } from 'react-redux';

import '../css/HeaderUserIcon.sass';

{/*
  //  //  //              USAGE EXAMPLE              //  //  //

<HeaderUserIcon />
*/}

class HeaderUserIcon extends Component {
  constructor(props) {
    super(props);
    this.state = {
      opened: false
    };
  }

  logout() {
    api.post('logout')
      .then(() => {
        setReduxState({
          user: -1,
          userData: {}
        })
        setCookie('accessToken', '')
        setCookie('usertype', '')
        auth()
        setPage('')
        // document.cookie = ''
        // setTimeout(() => auth(), 0)
        // auth(() => {
        //   window.location.reload(false);
        //     // this.state = store.getState();
        //     // this.forceUpdate();

        // });
      });
  }

  // componentWillMount() {
    // $(window).click(event => {
      // if (this.state.opened && !event.target.className.includes("header-user-icon") && !event.target.className.includes("default-avatar-user")) {
        // this.setState({opened: false});
        // alert(event.target.className);
      // }
    // });
  // }

  render() {
    if (!this.props.userData)
      return '...'
    else
      console.log(this.props.userData)
    return (
      <div
        className="header-user-icon"
        onClick={() => this.setState({opened: !this.state.opened})}
      >
        {
          this.state.opened ?
          <div className="options" style={{width: 150}}>
            <Link to={'/account'} style={{textDecoration: 'none'}}>
              <div className="option">
                {this.props.userData ? (this.props.userData.name || this.props.userData.company_name || '') + ' ' + (this.props.userData.surname || '') : 'Account settings'}
              </div>
            </Link>
            <Link to={'/chats'} style={{textDecoration: 'none'}}>
              <div className="option">
                Chats
              </div>
            </Link>
            <Link to={'/requests'} style={{textDecoration: 'none'}}>
              <div className="option">
                My requests
              </div>
            </Link>
            <div className="option" onClick={() => this.logout()}>
              Log out
            </div>
          </div>
          : ""
        }
        <Avatar
          size="58px"
          src={this.props.userData ? api.imgUrl(this.props.userData.img) : ''}
        />
      </div>
    );
  }
}

export default connect(a => a)(HeaderUserIcon);
