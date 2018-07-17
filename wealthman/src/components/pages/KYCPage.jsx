import React, { Component } from 'react';
import { setReduxState } from '../../redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { api, setPage, setCurrency, previousPage } from '../helpers';

class KYCPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      analysis: false,
      manager_comment: false,
      value: '',
      comment: '',
      manager: 'Manager-name'
    };
  }
  componentWillMount() {
    api.get('manager/' + this.props.currentManager)
      .then((res) => {
        this.setState({manager: (res.data.name || '') + ' ' + (res.data.suname || '')})
      })
  }
  send() {
    api.post('request', {
      manager: this.props.currentManager,
      value: this.state.value,
      comment: this.state.comment,
      options: {
        analysis: this.state.analysis,
        comment: this.state.manager_comment
      }})
      .then(() => {
        setPage('requests');
      })
      .catch(console.log);
  }
  render() {
    return(
      <div>
        {/* {this.renderBackButton()} */}
        {/*this.renderProgressBar()*/}
        <div className="container">
          <div className="box">
            <div className="row">
              <h2>Know Your Criminals</h2>
            </div>
            <div className="row">
              <p>By clicking “Send to manager” button you send</p>
              <ol>
                <li> Request for portfolio balance to manager <b>{this.state.manager}</b></li>
                <li> Your personal risk profile and information </li>
              </ol>
            </div>
            <div className="row">
              <p>Before it is sent, please, specify your target investment volume: and mark the follow options to get deep understanding of manager`s strategy (takes more time to get return portfolio recommendation):</p>
            </div>
            <h3><b>Sending request to manager</b></h3>
            <div className="row">
              <p>Investment size</p>
            </div>
            <div className="row">
              <input type="number" value={this.state.value} min="0" step="0.1" onChange={(event) => this.setState({value: event.target.value})} /> ETH
            </div>
            <div className="row">
              <p>Comment for manager</p>
            </div>
            <div className="row">
              <input type="text" value={this.state.comment} onChange={(event) => this.setState({comment: event.target.value})} />
            </div>
            <div className="row">
              <p><label><input type="checkbox" checked={this.state.analysis} onChange={(event) => this.setState({analysis: event.target.checked})} /> Analysis Neccesity</label></p>
            </div>
            <div className="row-padding">
              <p><label><input type="checkbox" checked={this.state.manager_comment} onChange={(event) => this.setState({manager_comment: event.target.checked})} /> Comment Neccesity</label></p>
            </div>
            <br />
            <div className="row-padding">
              <Link to={"/manager form"}>
                <button className="back" onClick={() => previousPage()}>Back</button>
              </Link>
              <button className="continue" onClick={() => this.send()}>Send to manager</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}


export default connect(a => a)(KYCPage);