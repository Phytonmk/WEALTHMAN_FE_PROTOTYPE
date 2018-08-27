import React, { Component } from 'react'
import $ from 'jquery'
import { setReduxState } from './../redux/index'
import { api, setPage, setCookie } from './helpers'
import { Link } from 'react-router-dom'
import Avatar from './Avatar'
import { connect } from 'react-redux'
import { default as chatsApi } from './pages/ChatPage/chatsApi'

import '../css/HeaderUserIcon.sass'

{/*
  //  //  //              USAGE EXAMPLE              //  //  //

<HeaderUserIcon />
*/}

class HeaderUserIcon extends Component {
  constructor(props) {
    super(props)
    this.state = {
      opened: false,
      notifications: 0
    }
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
        setPage('')
        auth()
        // document.cookie = ''
        // setTimeout(() => auth(), 0)
        // auth(() => {
        //   window.location.reload(false)
        //     // this.state = store.getState()
        //     // this.forceUpdate()

        // })
      })
  }

  componentWillMount() {
    $(window).click(event => {
      if (this.state.opened &&
        !event.target.className.includes("header-user-icon") &&
        !event.target.className.includes("loaded") && // "loaded" img of avatar
        !event.target.className.includes("default-avatar-user"))
        this.setState({opened: false})
    })
    chatsApi.connect()
      .then((socket) => {
        socket.on('message', msg => {
          this.setState(pervState => { return {notifications: pervState.notifications + 1}})
          window.dispatchEvent(newMsgEvent)
        });
      })
      .catch(console.log)
    chatsApi.chatsList()
      .then(res => {
        let notifications = 0
        res.data.map((chat) => notifications += chat.unread)
        this.setState({notifications})
      })
      .catch(console.log)
  }

  render() {
    if (!this.props.userData)
      return '...'
    return (
      <div
        className="header-user-icon"
        onClick={() => this.setState({opened: !this.state.opened})}
      >
        {
          this.state.opened ?
          <div className="options">
            <Link to={'/account'}>
              <div className="option">
                Account settings{/*{this.props.userData ? (this.props.userData.name || this.props.userData.company_name || '') + ' ' + (this.props.userData.surname || '') : 'Account settings'}*/}
              </div>
            </Link>
            <Link to={'/chats'}>
              <div className="option">
                Chats
              </div>
            </Link>
            <Link to={'/requests'}>
              <div className="option">
                Event log
              </div>
            </Link>
            <Link to={'/'}>
              <div className="option" onClick={() => this.logout()}>
                Log out
              </div>
            </Link>
          </div>
          : ""
        }
        <Avatar
          size="58px"
          src={this.props.userData ? api.imgUrl(this.props.userData.img) : ''}
        />
        <div className="notifications">{this.state.notifications > 0 ? this.state.notifications : ''}</div>
      </div>
    )
  }
}

export default connect(a => a)(HeaderUserIcon)
