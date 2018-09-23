import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Link } from 'react-router-dom'

import '../css/Modal.sass'

/*
USAGE EXAMPLE

Button is text of 
Buttons are optional, you can pass any valid react component between the <Modal> and </Modal>

<Modal btnClassName="big-blue-button" button="Lorem ipsum" initVisible={true} buttons={[
  {type: 'blue', text: 'Normal alert', action: () => alert('Lorem ipsum')},
  {type: 'red', text: 'Danger alert', action: () => alert('Lorem ipsum dolor sit amet bla-bla-bla')},
  {link: 'https://google.com', text: 'Google'},
  {link: 'https://facebook.com', text: 'Facebook'},
  {link: 'https://vk.com', text: 'vk'},
]}>
  Culpa anim nostrud irure reprehenderit ut ea quis ea excepteur commodo mollit eiusmod ex id sed dolor proident sit eiusmod incididunt consectetur do aliquip consectetur.
</Modal>

*/


const modalRoot = document.querySelector('#modal-root')

class ModalWindow extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    const buttons = !this.props.buttons ? '' : this.props.buttons.map((button, i) => {
      if (button.link)
        return <Link key={i} to={button.link} className="big-blue-button" onClick={() => {this.props.hide(); button.action && button.action()}}>{button.text}</Link>
      else if (button.type === 'blue')
        return <button key={i} className="big-blue-button" onClick={() => {this.props.hide(); button.action()}}>{button.text}</button>
      else if (button.type === 'red')
        return <button key={i} className="big-red-button" onClick={() => {this.props.hide(); button.action()}}>{button.text}</button>
      else
        return <span key={i}>Unsupported <b>{i}</b> button type <b>{button.type}</b> </span>
    })
    return <div onClick={(e) => e.target.className.includes('modal-window-container') && this.props.hide()} className={this.props.visible ? "modal-window-container visible" : "modal-window-container"}>
      <div className="view">
        <div className="close-container">
          <div className="close" onClick={() => this.props.hide()}/>
        </div>
        <div className="content">{this.props.view}</div>
        <div className="buttons">{buttons}</div>
      </div>
    </div>
  }
}

class Modal extends Component {
  constructor(props) {
    super(props)
    this.state = {visible: !!this.props.initVisible}
    this.layer = document.createElement('div')
    if (this.props.hider) {
      this.props.hider(() => this.setState({visible: false}))
    }
  }
  componentDidMount() {
    modalRoot.appendChild(this.layer)
  }
  componentWillUnmount() {
    modalRoot.removeChild(this.layer)
  }
  render() {
    return <React.Fragment>
      <button
        className={this.props.btnClassName ? this.props.btnClassName : 'big-blue-button'}
        onClick={() => this.setState({visible: true})}
      >{this.props.button}</button>
      {ReactDOM.createPortal(<ModalWindow
        view={this.props.children}
        buttons={this.props.buttons}
        visible={this.state.visible}
        hide={() => {
          this.setState({visible: false})
          if (this.props.onClose)
            this.props.onClose()
        }}
      />, this.layer)}
    </React.Fragment>
  }
}

export default Modal