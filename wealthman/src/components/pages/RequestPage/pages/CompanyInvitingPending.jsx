import React, { Component } from 'react';

import { Link } from 'react-router-dom';
import Cards from '../../../dashboards/Cards';
import Person from '../../../dashboards/Person';

import { api, setPage } from '../../../helpers'

export default class CompanyInvitingPending extends Component {
  acceptApply() {
    api.post('company/accept-apply', {
      manager: this.props.requestData.manager.id,
      request: this.props.requestData.request.id
    })
      .then(() => {
        setPage('account');
      })
      .catch(console.log);
  }
  render() {
    return <div>
      <Person requestData={this.props.requestData}/>
      <Cards
        cards={[{
          subtitle: 'This manager whants to join your company on platform',
        }]}
      />
      <Cards
        whiteBg={true}
        cards={[{
          title: <Link to={'/decline/' + this.props.requestData.request.id} style={{color: 'inherit', textDecoration: 'none'}}>Decline</Link>,
          state: 'bad'
        }, {
          title: <Link to={"#"} onClick={() => this.acceptApply()} style={{color: 'inherit', textDecoration: 'none'}}>Accept apply</Link>,
          state: 'good'
        }]}
      />
    </div>
  }
}
