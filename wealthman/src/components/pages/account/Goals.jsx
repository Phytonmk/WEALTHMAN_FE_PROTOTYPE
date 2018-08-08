import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class RiskProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  render() {
    return (
      <div>
        <div className="account-box">
          <small>YOU ARE INVESTING FOR</small>
          <ul>
            <li>Living</li>
            <li>Journeys</li>
          </ul>
          <Link to="/questions">
            <button className="big-blue-button">
              change results
            </button>
          </Link>
        </div>
      </div>
    );
  }
}

export default RiskProfile;
