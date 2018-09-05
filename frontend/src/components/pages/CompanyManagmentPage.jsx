import React, { Component } from 'react';
import { setReduxState } from '../../redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Sortable2 from '../Sortable2.jsx';
import { api, setPage, setCurrency } from '../helpers';

class CompanyManagmentPage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  decline () {
    api.post('decline-request/' + this.props.match.params.id)
      .then((res) => {
        setPage('requests');
      })
      .catch(console.log);
  }
  render() {
    return (
      <div>
        {/* {this.renderBackButton()} */}
        <div className="container">
          <div className="box">
            <h3>Manage your compony</h3>
            <div className="row">
              <textarea placeholder="Description"></textarea>
            </div>
            <div className="row">
              <textarea placeholder="Socials links"></textarea>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default connect(a => a)(CompanyManagmentPage);