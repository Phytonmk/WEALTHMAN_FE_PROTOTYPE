import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import LevDate from '../../LevDate.jsx';

import { api } from '../../helpers';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      smartContract: ''
    }
  }
  componentWillMount() {
    if (this.props.request)
      api.post('portfolio/load', {
        request: this.props.request._id,
        state: 'active'
      })
        .then((res) => {
          console.log(res.data);
          if (res.data.exists && res.data.portfolio.smart_contract) {
            this.setState({smartContract: res.data.portfolio.smart_contract});
          }
        })
        .catch(console.log);
  }
  render() {
    let smartContract = '';
    if (this.state.smartContract && this.state.smartContract !== '-') {
      smartContract = <div className="box">
        <h4>Smart contract address:</h4>
        <br />
        <b className="eth-address">{this.state.smartContract}</b>
      </div>
    }
    console.log(this.props);
    return (<div>
      {smartContract}
      <div className="box">
        {this.props.request ? (
          this.props.request.type === 'portfolio' ?
            <div>
              <div className="row"><b>Request type</b>: {this.props.request.type}</div>
              <div className="row"><b>Request status</b>: {this.props.request.status}</div>
              <div className="row-padding"><b>Value</b>: {this.props.request.value} ETH</div>
              <div className="row-padding"><b>Period</b>: {this.props.request.period} {this.props.request.period > 1 ? 'days' : 'day'}</div>
              <div className="row"><b>Comment</b>: {this.props.request.comment ? this.props.request.comment : 'no comment'}</div>
              <div className="row"><b>Service</b>: {this.props.request.service}</div>
              <div className="row"><b>Alowed revision amounts</b>: {this.props.request.service === 'Robo-advisor' ? 'unlimited' : this.props.request.revisions_amount}</div>
              <div className="row-padding">Investor needs:</div>
              <div className="row"><b>Analysis</b>: {(this.props.request.options || {}).analysis ? 'yes' : 'no'}</div>
              <div className="row"><b>Comment</b>: {(this.props.request.options || {}).comment ? 'yes' : 'no'}</div>
              <div className="row"><b>Comment</b>: {(this.props.request.options || {}).comment ? 'yes' : 'no'}</div>
              <div className="row-padding">Fees:</div>
              <div className="row"><b>Exit fee</b>: {this.props.request.exit_fee} %</div>
              <div className="row"><b>Managment fee</b>: {this.props.request.managment_fee} %</div>
              <div className="row"><b>Perfomance fee</b>: {this.props.request.perfomance_fee} %</div>
              <div className="row"><b>Front fee</b>: {this.props.request.front_fee} %</div>
              <code>
                {/*JSON.stringify(this.props.request, null, 4)*/}
              </code>
              
            </div>
          : 
            <div>
              <div className="row"><b>Request type</b>: {this.props.request.type}</div>
              <div className="row"><b>Request status</b>: {this.props.request.status}</div>
              <div className="row"><b>Initinated by</b>: {this.props.request.initiatedByManager ? 'manger' : 'company'}</div>
              <code>
                {/*JSON.stringify(this.props.request, null, 4)*/}
              </code>
              
            </div>
        ) : 'Loading...'}
        </div>
      </div>)
  }
}

export default Header;