import React, { Component } from 'react';

export default class SmartContract extends Component {
  constructor(props) {
    super(props)
    this.state = {
      inputId: 'input-to-copy-' + Math.round(Math.random() * 1000000),
      copied: false
    }
  }
  copy() {
    const input = document.querySelector('#' + this.state.inputId);
    input.select();
    document.execCommand('copy');
    this.setState({copied: true});
  }
  render() {
    return <div className="smart-contract-box">
      <div className="box">
        <h3>Smart contract address</h3>
        <p>
          <span className="smart-contract-text">{this.props.address}</span>
          <span onClick={() => this.copy()} className="copy-contract-btn" style={{opacity: this.state.copied ? 0 : 1}}>copy</span>
          <input value={this.props.address} id={this.state.inputId} onChange={() => {}} className="copy-input" />
        </p>
      </div>
    </div>
  }
}
