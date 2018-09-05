import React, { Component } from 'react';
import { store, setReduxState } from '../../redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { api, setPage, setCurrency, previousPage } from '../helpers';

class InviteManagerPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      manager: '-',
      company: this.props.userData.company_name || '-' 
    };
    store.subscribe(() => store.getState().userData.company_name ? this.setState({company: store.getState().userData.company_name}) : '')
  }
  componentDidMount() {
    api.get('manager/' + this.props.match.params.manager)
      .then((res) => {
        this.setState({manager: (res.data.name || '') + ' ' + (res.data.surname || '')})
      });
    api.get('company/' + this.props.match.params.manager)
      .then((res) => {
        this.setState({company: res.data.company_name});
      });
  }
  invite() {
    if (this.props.user === 3)
      api.post('company/invite-manager', {
        manager: this.props.match.params.manager,
      })
        .then(() => setPage('requests'))
        .catch(console.log);
    else if (this.props.user === 1)
      api.post('company/apply', {
        company: this.props.match.params.manager,
      })
        .then(() => setPage('requests'))
        .catch(console.log);
  }
  render() {
    let title = <h2>Are you sure you want invite manager <b>{this.state.manager}</b> to your company <b>{this.state.company}</b>?</h2>;
    let inviteBtn = 'Yes, invite';
    if (this.props.user === 1) {
      title = <h2>Are you sure you want to apply be part of company <b>{this.state.company}</b>?</h2>
      inviteBtn = 'Yes, apply';
    }
    return(
      <div>
        <div className="container">
          <div className="box">
            <div className="row">
              {title}
            </div>
            <div className="row-padding">
              <Link to={"/manager/" + this.props.match.params.manager}>
                <button className="back">Back</button>
              </Link>
              <button className="continue" onClick={() => this.invite()}>{inviteBtn}</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}


export default connect(a => a)(InviteManagerPage);