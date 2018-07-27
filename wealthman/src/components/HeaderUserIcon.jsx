import React, { Component } from 'react';
import $ from 'jquery';
import { setReduxState } from './../redux/index';
import { api } from './helpers';
import Avatar from './Avatar';

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
        // auth(() => {
        //   window.location.reload(false);
        //     // this.state = store.getState();
        //     // this.forceUpdate();

        // });
      });
  }

  componentWillMount() {
    $(window).click(event => {
      if (this.state.opened && !event.target.className.includes("header-user-icon") && !event.target.className.includes("default-avatar-user")) {
        this.setState({opened: false});
        // alert(event.target.className);
      }
    });
  }

  render() {
    return (
      <div
        className="header-user-icon"
        onClick={() => this.setState({opened: !this.state.opened})}
      >
        {
          this.state.opened ?
          <div className="options">
            <div className="option" onClick={() => this.logout()}>
              Log out
            </div>
          </div>
          : ""
        }
        <Avatar size="58px"/>
      </div>
    );
  }
}

export default HeaderUserIcon;
