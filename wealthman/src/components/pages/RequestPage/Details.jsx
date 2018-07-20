import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import myDate from '../../myDate.jsx';

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
        request: this.props.request.id,
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
    return (<div>
      {smartContract}
      <div className="box">
        {this.props.request ? (
          this.props.request.type === 'portfolio' ?
            <div>
              <div className="row"><b>Request type</b>: {this.props.request.type}</div>
              <div className="row"><b>Request status</b>: {this.props.request.status}</div>
              <div className="row-padding"><b>Value</b>: {this.props.request.value} ETH</div>
              <div className="row"><b>Comment</b>: {this.props.request.comment ? this.props.request.comment : 'no comment'}</div>
              <div className="row"><b>Service</b>: {this.props.request.service}</div>
              <div className="row"><b>Alowed revision amounts</b>: {this.props.request.service === 'Robo-advisor' ? 'unlimited' : this.props.request.revisions_amount}</div>
              <div className="row-padding">Investor needs:</div>
              <div className="row"><b>Analysis</b>: {(this.props.request.options || {}).analysis ? 'yes' : 'no'}</div>
              <div className="row"><b>Comment</b>: {(this.props.request.options || {}).comment ? 'yes' : 'no'}</div>
              <code>
                {/*JSON.stringify(this.props.request, null, 4)*/}
              </code>
              
            </div>
          : 'This version of frontend is unable to render request of this type'
        ) : 'Loading...'}
        </div>
      </div>)
  }
}

export default Header;