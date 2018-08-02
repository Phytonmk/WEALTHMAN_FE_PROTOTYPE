import React, { Component } from 'react';

import { Link } from 'react-router-dom';
import Cards from '../../../dashboards/Cards';
import Person from '../../../dashboards/Person';

import { api, setPage } from '../../../helpers'

export default class ManagerInvitingPending extends Component {
  acceptInviting() {
    api.post('company/accept-inviting', {
      company: this.props.requestData.company._id,
      request: this.props.requestData.request._id
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
          subtitle: 'This company invites yu to join them on platform',
        }]}
      />
      <Cards
        whiteBg={true}
        cards={[{
          title: <Link to={'/decline/' + this.props.requestData.request._id} style={{color: 'inherit', textDecoration: 'none'}}>Decline</Link>,
          state: 'bad'
        }, {
          title: <Link to={"#"} onClick={() => this.acceptInviting()} style={{color: 'inherit', textDecoration: 'none'}}>Accept inviting</Link>,
          state: 'good'
        }]}
      />
    </div>
  }
}
