import React, { Component } from 'react'

import LevDate from '../../../LevDate'

import { Link } from 'react-router-dom'
import Cards from '../../../dashboards/Cards'
import Person from '../../../dashboards/Person'
import PageDevider from '../../../dashboards/PageDevider'
import PortfolioPreview from '../PortfolioPreview'
import ReportsAndDocuments from '../../../dashboards/ReportsAndDocuments'
import SmartContract from '../../../dashboards/SmartContract'
import InvstorPortfolioHeader from '../../../dashboards/InvstorPortfolioHeader'


export default class InvestorPortfolioActive extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    console.log(this.props.requestData)
    return <div>
      <Cards
        whiteBg={true}
        cards={[{
          title: this.props.requestData.request.service,
          subtitle: 'Style'
        },{
          title: this.props.requestData.request.period,
          subtitle: 'Days'
        },{
          title: new LevDate(this.props.requestData.request.contract_deployment || 0).date(),
          subtitle: 'Start date'
        },{
          title: new LevDate(new Date(this.props.requestData.request.contract_deployment || 0).getTime() + 1000 * 60 * 60 * 24 * this.props.requestData.request.period).date(),
          subtitle: 'Finish date'
        }]}
      />
      <Cards
        cards={[{
          title: this.props.requestData.request.investing_reason,
          subtitle: 'Primary reason for investing'
        },{
          title: this.props.requestData.portfolio.balance,
          subtitle: 'Balance portfolio'
        },{
          title: '? %',
          subtitle: 'Change (24h)'
        },{
          title: '? $',
          subtitle: 'Total earnings'
        }]}
      />
      <Cards
        whiteBg={true}
        cards={[{
          title: <Link className="blue" to={'/portfoliocreation/' + this.props.requestData.request._id} style={{color: 'inherit', textDecoration: 'none'}}>Rebalance portfolio</Link>,
        }]}
      />
      <SmartContract address={this.props.requestData.portfolio.smart_contract} />
      <PortfolioPreview requestData={this.props.requestData} />
      <PageDevider />
      <Person requestData={this.props.requestData}/>
      <ReportsAndDocuments investorAgreement={this.props.requestData.request.investor_agreement} request={this.props.requestData.request._id} transactions={this.props.requestData.transactions}/>
    </div>
  }
}
 