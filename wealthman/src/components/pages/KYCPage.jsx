import React, { Component } from 'react';
import { setReduxState } from '../../redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { api, setPage, setCurrency, previousPage, getCookie } from '../helpers';

const filters = [
  {
    link: "Robo-advisor",
    description: "Invest on Autopilot",
  },
  {
    link: "Discretionary",
    description: "Get The Right Investment Manager For Your Wealth",
  },
  {
    link: "Advisory",
    description: "Find The Right Advisory Support For Your Own Decisions On Investment Management",
  },
];

class KYCPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      analysis: false,
      manager_comment: false,
      value: '',
      comment: '',
      manager: '-',
      managerId: '',
      managerName: '-',
      service: '-',
      revisionsAmount: 0,
    };
    if (this.props.match.params.manager === undefined) {
      let managerString = getCookie('selectedManager');
      this.props.match.params.manager = managerString.split('/')[0];
      this.props.match.params.id = managerString.split('/')[1];
    }
  }
  componentWillMount() {
    let manager = '';
    if (this.props.match.params.manager === 'manager')
      manager = 'manager';
    else if (this.props.match.params.manager === 'company')
      manager = 'company';
    this.setState({manager, service: (filters[getCookie('service')] || {link: '-'}).link});
    api.get(manager + '/' + this.props.match.params.id)
      .then((res) => {
        console.log(res.data.name, res.data.surname)
        this.setState({
          managerName: (res.data.name || res.data.company_name || '') + ' ' + (res.data.surname || ''),
          managerId: res.data.id
        })
      })
  }
  send() {
    api.post('request', {
      type: 'portfolio',
      [this.state.manager]: this.state.managerId,
      value: this.state.value,
      comment: this.state.comment,
      service: this.state.service,
      revisions_amount: this.state.revisionsAmount,
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
              <p>By clicking “Send to {this.state.manager}” button you send</p>
              <ol>
                <li> Request for portfolio balance to {this.state.manager} <b>{this.state.managerName}</b> and selected service: <b>{this.state.service}</b></li>
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

            {this.state.service === 'Robo-advisor' || this.state.service === '-' ? '' : <div>
              <div className="row">
                <p>Allowed revisions amount</p>
              </div>
              <div className="row">
                <input type="number" value={this.state.revisionsAmount} min="0" step="1" onChange={(event) => this.setState({revisionsAmount: event.target.value})} />
              </div>
            </div>}
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
              <button className="continue" onClick={() => this.send()}>Send to {this.state.manager}</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}


export default connect(a => a)(KYCPage);