import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import LevDate from '../../LevDate';
import Cards from '../../dashboards/Cards';
import SmartContract from '../../dashboards/SmartContract';

import { api } from '../../helpers';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      smartContract: ''
    }
  }
  componentWillMount() {
    if (this.props.request)
      api.post('portfolio/load', {
        request: this.props.request._id,
        state: 'active'
      })
        .then((res) => {
          if (res.data.exists && res.data.portfolio.smart_contract) {
            this.setState({smartContract: res.data.portfolio.smart_contract});
          }
        })
        .catch(console.log);
  }
  render() {
    let smartContract = ''
    if (this.state.smartContract && this.state.smartContract !== '-') {
      smartContract = <SmartContract address={this.state.smartContract} />
    }
    console.log(this.props);
    return (<div>
      {smartContract}
      {this.props.request ? (
          this.props.request.type === 'portfolio' ?
          <React.Fragment>
            <Cards
              whiteBg={true}
              cards={[{
                title: this.props.request.type,
                subtitle: 'Request type'
              }, {
                title: this.props.request.status,
                subtitle: 'Request status'
              }]}
            />
            <Cards
              whiteBg={false}
              cards={[{
                title: this.props.request.value + ' ETH',
                subtitle: 'Value'
              }, {
                title: this.props.request.period + ' ' + (this.props.request.period > 1 ? 'days' : 'day'),
                subtitle: 'Period'
              }, {
                title: this.props.request.service,
                subtitle: 'Service'
              }, {
                title: this.props.request.service === 'Robo-advisor' ? 'unlimited' : this.props.request.revisions_amount,
                subtitle: 'Allowed revision amounts'
              }]}
            />
            <Cards
              whiteBg={true}
              cards={[{
                title: (this.props.request.options || {}).analysis ? 'yes' : 'no',
                subtitle: 'Investor needs analysis'
              }, {
                title: (this.props.request.options || {}).comment ? 'yes' : 'no',
                subtitle: 'Investor needs comment'
              }]}
            />
            <Cards
              whiteBg={false}
              cards={[{
                title: this.props.request.comment ? this.props.request.comment : 'no comment',
                subtitle: 'Investor comment'
              }]}
            />
            <Cards
              whiteBg={true}
              cards={[{
                title: this.props.request.exit_fee + ' %',
                subtitle: 'Exit fee'
              }, {
                title: this.props.request.managment_fee + ' %',
                subtitle: 'Management fee'
              }, {
                title: this.props.request.perfomance_fee + ' %',
                subtitle: 'Perfomance fee'
              }, {
                title: this.props.request.front_fee + ' %',
                subtitle: 'Front fee'
              }]}
            />
          </React.Fragment>
          :
          <Cards
            whiteBg={true}
            cards={[{
              title: this.props.request.type,
              subtitle: 'Request type'
            }, {
              title: this.props.request.status,
              subtitle: 'Request status'
            }, {
              title: this.props.request.initiatedByManager ? 'manger' : 'company',
              subtitle: 'Initinated by'
            }]}
          />) : 'Loading...'}
      </div>)
  }
}

export default Header;