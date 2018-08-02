import React, { Component } from 'react';

import { Link } from 'react-router-dom';
import Cards from '../../../dashboards/Cards';
import Person from '../../../dashboards/Person';
import Details from '../Details';

export default class ManagerPortfolioPending extends Component {
  render() {
    return <div>
      <Person requestData={this.props.requestData}/>
      <Details request={this.props.requestData.request} />
      <Cards
        whiteBg={true}
        cards={[{
          title: <Link to={'/decline/' + this.props.requestData.request._id} style={{color: 'inherit', textDecoration: 'none'}}>Decline</Link>,
          state: 'bad'
        }, {
          title: <Link to={"/portfoliocreation/" + this.props.requestData.request._id} style={{color: 'inherit', textDecoration: 'none'}}>Create portfolio</Link>,
          state: 'good'
        }]}
      />
    </div>
  }
}
