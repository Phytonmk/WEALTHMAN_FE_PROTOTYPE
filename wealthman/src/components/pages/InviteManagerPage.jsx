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
  componentWillMount() {
    api.get('manager/' + this.props.match.params.manager)
      .then((res) => {
        this.setState({manager: (res.data.name || '') + ' ' + (res.data.surname || '')})
      });
  }
  invite() {
    api.post('company/invite-manager', {
      manager: this.props.match.params.manager,
    })
      .then(() => setPage('requests'))
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
              <h2>Are you sure you want invite manager <b>{this.state.manager}</b> to your company <b>{this.state.company}?</b></h2>
            </div>
            <div className="row-padding">
              <Link to={"/manager form"}>
                <button className="back" onClick={() => previousPage()}>Back</button>
              </Link>
              <button className="continue" onClick={() => this.invite()}>Yes, invite</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}


export default connect(a => a)(InviteManagerPage);