import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import myDate from '../../myDate.jsx';

class Title extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    if (!this.props.request)
      return <p></p>
    let title = '-';
    switch (this.props.user) {
      case 0:
        switch(this.props.request.status) {
          case 'proposed':
            title = 'Portfolio poroposed'
          break;
          case 'revision':
            title = 'Portfolio on revision'
          case 'waiting for deposit':
            title = 'Waiting for deposit'
          break;
          case 'active':
            title = 'Portfolio is active'
          break;
        }
      break;
      case 1:
        switch(this.props.request.status) {
          case 'pending':
            title = 'You have an incomming request'
          case 'active':
            title = 'Portfolio is active'
        }
      break;
      case 3:
      break;
    }
    return (
      <div className="box">
        <h1>{title}</h1>
      </div>)
  }
}

export default Title;