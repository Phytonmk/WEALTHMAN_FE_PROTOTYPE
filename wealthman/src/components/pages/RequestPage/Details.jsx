import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import myDate from '../../myDate.jsx';

class Header extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (<div className="box">
        {this.props.request ? <div>
          <div className="row"><b>Value</b>: {this.props.request.value} ETH</div>
          <div className="row"><b>Comment</b>: {this.props.request.comment ? this.props.request.comment : 'no comment'}</div>
          <div className="row"><b>Service</b>: {this.props.request.service}</div>
          <div className="row-padding">Investor needs:</div>
          <div className="row"><b>Analysis</b>: {(this.props.request.options || {}).analysis ? 'yes' : 'no'}</div>
          <div className="row"><b>Comment</b>: {(this.props.request.options || {}).comment ? 'yes' : 'no'}</div>
        </div> : 'Loading...'}
      </div>)
  }
}

export default Header;