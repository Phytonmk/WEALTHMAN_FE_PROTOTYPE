import React, { Component } from 'react';
import { setReduxState } from '../../redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Sortable2 from '../Sortable2.jsx';
import { api, setPage, setCurrency } from '../helpers';

class DeclinePage extends Component {
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
            <h3>Reason for decline</h3>
            <div className="row-padding">
              <label htmlFor="1">
                <input type="checkbox" id="1" />
                Insufficient information
              </label>
            </div>
            <div className="row-padding">
              <label htmlFor="2">
                <input type="checkbox" id="2" />
                Information is unacceptable
              </label>
            </div>
            <div className="row-padding">
              <label htmlFor="3">
                <input type="checkbox" id="3" />
                Other
              </label>
            </div>
            <div className="row-padding">
              <textarea rows="4" cols="50" placeholder="Comment">
                {}
              </textarea>
            </div>
            <div className="row-padding">
              <Link to={"/request/" + this.props.match.params.id} onClick={() => this.setPage("request", this.props.match.params.id)}>
                <button className="back">Back</button>
              </Link>
              <button className="continue" onClick={() => this.decline()}>Submit</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default connect(a => a)(DeclinePage);