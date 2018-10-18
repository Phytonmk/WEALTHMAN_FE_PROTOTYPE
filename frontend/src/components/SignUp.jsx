import React, { Component } from 'react'
import { setReduxState } from '../redux/index'
import { Link } from 'react-router-dom'

import { api, setCookie, getCookie, setPage } from './helpers'
import auth from './auth'
import '../css/AuthWindows.sass'
import Form from './pages/registration/Form'
import questions from './pages/registration/questions'
import Input from './inputs/Input'
import GoogleLogin from 'react-google-login'
import FacebookLogin from 'react-facebook-login'

const mailingServices = [{
  title: 'GMail inbox',
  domain: 'gmail.com',
  url: 'https://mail.google.com'
}, {
  title: 'Yandex mail inbox',
  domain: 'yandex.ru',
  url: 'https://mail.yandex.ru'
}]

export default class SignUp extends Component {
  constructor(props) {
    super(props)
    this.state = {
      step: 0,
      login: '',
      password: '',
      passwordRepeat: '',
      badLogin: false,
      register: this.props.forManagers ? '' : 'investor',
      registerNewClient: !!this.props.registerNewClient,
      notConfirmed: false,
      oauthService: null,
      oauthToken: null
    }
  }
  hide(event=({target: {classList: {contains: () => false}}}), forced=false) {
    if (forced || event.target.classList.contains('close-modal-btn') ||
          event.target.classList.contains('modal-wrapper'))
      this.props.hide()
  }
  openDetailsStep() {
    if (this.state.password === this.state.passwordRepeat) {
      api.post('check-login', {login: this.state.login})
        .then(() => {
          if (!this.state.registerNewClient && this.state.register === 'investor') {
            this.sendAllForms(null)
          } else {
            this.setState({step: 1})
          }
        })
        .catch((e) => e.response && e.response.status === 403 ? this.setState({badLogin: true}) : alert('Error, registration is temporarely unavalible'))
      
    } else {
      alert('Passwords are not equal')
    }
  }
  sendAllForms(data) {
    const callback = (res) => {
      if (!this.state.registerNewClient) {
        setCookie('accessToken', res.data.token)
        auth()
        if (res.data.confirmToken)
          this.setState({confirmToken: res.data.confirmToken})
      }
      if (!res.data.dataFilled)
        this.sendDetails(data, res.data.token)
      else if (this.state.oauthService !== null)
        this.props.hide()
      else
        this.setState({step: 2})
    }

    if (this.state.oauthService) {
      api.post('oauth/' + this.state.oauthService, {
        token: this.state.oauthToken
      })
        .then(callback)
        .catch(console.log)
    } else {
      api.post(this.state.registerNewClient ? 'register-new-client' : 'register', {
        login: this.state.login,
        password: this.state.password,
        register: this.state.register
      })
        .then(callback)
        .catch(console.log)
    }
  }
  sendDetails(data, token) {
    api.post(this.state.registerNewClient ? 'investor/data' : (this.state.register + '/data'), this.state.registerNewClient ? Object.assign(data, {accessToken: token}): data)
      .then((res) => {
        // console.log('res.data')
        if (this.state.registerNewClient || this.state.oauthService) {
          this.props.hide()
          if (this.state.oauthService)
            auth()
        } else {
          this.setState({step: 2})
          // this.setState({
          //   step: 0,
          // })
        }
      })
      .catch(console.log)
  }
  confirm() {
    auth((confirmed) => {
      //console.log(confirmed)
      if (confirmed) {
        this.setState({step: 3})
        this.hide(null, true)
        if (typeof this.props.callback === 'function') {
          this.props.callback()
        } else {
          if (this.state.register === 'manager' || this.state.register === 'company')
            setPage('investors')
          else
            setPage('questions/first-question')
        }
      } else {
        // this.setState({notConfirmed: true})
        this.setState({
          step: 0,
          login: '',
          password: '',
          passwordRepeat: '',
          badLogin: false,
          notConfirmed: false,
          oauthService: null,
          oauthToken: null
        })
      }
    })
  }
  oauth(service, authData) {
    switch(service) {
      case 'google': 
        this.setState({
          oauthService: 'google',
          oauthToken: authData.accessToken,
          step: this.state.register === 'investor' ? 0 : 1
        })
        break
      case 'facebook': 
        this.setState({
          oauthService: 'facebook',
          oauthToken: authData.accessToken,
          step: this.state.register === 'investor' ? 0 : 1
        })
        break
    }
    if (this.state.register === 'investor')
      this.sendAllForms()
  }
  logout() {
    setCookie('accessToken', '')
    setCookie('usertype', '')
    this.setState({step: 0})
    this.props.hide()
  }
  render() {
    // console.log(`Registration of another user via email: ${this.state.registerNewClient}`)
    return (
      <div onClick={(event) => this.hide(event)} className={(this.props.visible || this.state.step === 2) ? 'modal-wrapper visible' : 'modal-wrapper'}>
        <div className="auth-box registration-box">
          {this.state.step !== 2 ? <div className="close-modal-btn" /> : ''}
          <h2>{this.state.registerNewClient ? 'Register new client to Wealthman' : ('Sign up to Wealthman' + (this.props.forManagers ? ' as manager.' : '.'))}</h2>
          {this.state.step !== 0 ? '' : <React.Fragment>
          <div className="row first-input-row">
            <label>Email address</label>
            <Input value={this.state.login} error={this.state.badLogin} setValue={value => this.setState({login: value, badLogin: false})} placeholder="username@email.com" />
            {this.state.badLogin ? <small className="red">This login is invalid or already used</small> : ''}
          </div>
          {this.state.registerNewClient ? '' :
            <React.Fragment>
              <div className="row">
                <label>Password</label>
                <Input value={this.state.password} setValue={value => this.setState({password: value})} type="password" placeholder="Enter your password" />
              </div>
              <div className="row">
                <Input value={this.state.passwordRepeat} setValue={value => this.setState({passwordRepeat: value})} type="password" placeholder="Repeat your password" />
              </div>
              <small>
                If you leave password field empty, it will be generated and sent to your e-mail automatically.
              </small>
            </React.Fragment>

          }
          <div className="row submit-row">
            <button className="big-blue-button auth-btn" onClick={() => this.openDetailsStep()}>Continue</button>
            <br />
            <small>By clicking “Continue” I agree to <Link to="/user-agreement" target="_blank">Terms of Service</Link> and <Link to="/user-agreement" target="_blank">Privacy Policy</Link></small>
          </div>
          {this.state.registerNewClient ? '' :
            <div className="row-padding oauth-container">
              <GoogleLogin
                  clientId={this.props.googleClientId}
                  buttonText="Sign up via Google"
                  onSuccess={(authData) => this.oauth('google', authData)}
                  onFailure={(e) => {console.log(e); alert('Unable to sign up via Google')}}
                />
                <FacebookLogin
                  appId={this.props.facebookAppId}
                  autoLoad={true}
                  fields="email"
                  callback={(authData) => this.oauth('facebook', authData)}
                  textButton="Sign up via Facebook"
                />
            </div>
          }
          {this.state.registerNewClient ? '' : <div className="devider"></div>}
          {this.state.registerNewClient ? '' : <div className="row footer-row">
            Already have an account?
            <a onClick={() => this.props.openSignIn()} className="another-auth-window-link">Sign in</a>
          </div>}
        </React.Fragment>}
         {this.state.step !== 1 ? '' : <div>
            {this.state.register !== '' ? <Form
              questions={questions[this.state.register + 'Short']}
              onSubmit={(data) => {this.sendAllForms(data)}}
            /> : <React.Fragment>
              <div className="row-padding">
                <button className="big-blue-button auth-btn" onClick={() => this.setState({register: 'manager'})}>
                  Register manager
                </button>
              </div>
              <div className="row-padding">
                <button className="big-blue-button auth-btn" onClick={() => this.setState({register: 'company'})}>
                  Register company
                </button>
              </div>
            </React.Fragment>
          }
         </div>}
         {this.state.step !== 2 ? '' : <div>
            {/^[^@]+@{1}[^\.]+\.{1}.+$/.test(this.state.login) ?
            <div>
              <div className="row">
                Email sent to <b>{this.state.login}</b>
              </div>
              <div className="row">
                Confirm your email and then push the button below
              </div>
              {(() => { 
                const mainlingService = mailingServices.find((inbox) => inbox.domain === this.state.login.substr(this.state.login.indexOf('@') + 1))
                if (mainlingService === undefined)
                  return ''
                return  <div className="row">
                          <br />
                          <ins><a
                            target="_blank"
                            href={mainlingService.url} >
                          Go to {mainlingService.title}
                          </a></ins>
                        </div>
              })()}
            </div> :
            <div>
              <div className="row">
                <small>It is availible only in developer version!</small>
              </div>
              <div className="row">
                Your login is not a valid email so to confirm it go to <b><ins><a target="_blank" href={'http://platform.wealthman.io:8080/api/confirm-email/' + this.state.confirmToken}>link</a></ins></b>
                <br />
              </div>
            </div>}
            <div className="row-padding">
              <button className="big-blue-button auth-btn" onClick={() => this.confirm()}>Ok</button>
            </div>
            {/*<div className="row-padding">
              <button className="big-blue-button auth-btn" onClick={() => this.confirm()}>I have comfirmed</button>
            </div>
            {!this.state.notConfirmed ? '' : <small>Seems like you haven't</small>}*/}
            <div className="row-padding">
              <small>
                In case you have entered wrong email address
                <br />
                <a href="#" onClick={() => this.logout()}>Logout and try with another email</a>
              </small>
            </div>
         </div>}
        </div>
      </div>
    )
  }
}
