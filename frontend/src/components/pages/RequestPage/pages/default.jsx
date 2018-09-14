import React, { Component } from 'react';

import Details from '../Details';
import Person from '../../../dashboards/Person';
import PageDevider from '../../../dashboards/PageDevider';
import PortfolioPreview from '../PortfolioPreview'

export default class DefaultPage extends Component {
  render() {
    return <div>
      <Person requestData={this.props.requestData}/>
      <Details request={this.props.requestData.request} />
      {this.props.requestData.portfolio ? 
        <PortfolioPreview requestData={this.props.requestData} /> : ''}
    </div>
  }
}
