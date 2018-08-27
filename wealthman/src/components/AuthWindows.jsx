import React, { Component } from 'react'

import SignIn from './SignIn'
import SignUp from './SignUp'

const googleClientId = '284455547769-8m06ntqreg5qv2m8nm6nlcmm7ska9uss.apps.googleusercontent.com'
const facebookAppId = '440673259755979'
export default class AuthWindows extends Component {
  constructor(props) {
    super(props);
    this.state = {
      signInVisible: false,
      signUpVisible: false,
      callback: null
    }
  }
  componentDidMount() {
    if (typeof this.props.openSignIn === 'function') {
      this.props.openSignIn((callback=null) => {
        this.setState({
          signInVisible: true,
          callback
        })
      })
    }
    if (typeof this.props.openSignUp === 'function') {
      this.props.openSignUp((callback=null) => {
        this.setState({
          signUpVisible: true,
          callback
        })
      })
    }
  }
  render() {
    return <React.Fragment>
      <SignIn
        visible={!!this.state.signInVisible}
        hide={() => this.setState({signInVisible: false})}
        openSignIn={() => {
          this.setState({
            signInVisible: false,
            signUpVisible: true,
          })}
        }
        googleClientId={googleClientId}
        facebookAppId={facebookAppId}
        callback={this.state.callback}/>
      <SignUp
        forManagers={!!this.props.forManagers}
        registerNewClient={!!this.props.registerNewClient}
        visible={!!this.state.signUpVisible}
        hide={() => this.setState({signUpVisible: false})}
        openSignIn={() => {
          this.setState({
            signUpVisible: false,
            signInVisible: true,
          })}
        }
        googleClientId={googleClientId}
        facebookAppId={facebookAppId}
        callback={this.state.callback}/>
    </React.Fragment>
  }
}
