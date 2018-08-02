import React, { Component } from 'react';

import Subheader from '../Subheader'
import LevDate from '../LevDate'
import { api } from '../helpers'

export default class ReportsAndDocuments extends Component {
  constructor(props) {
    super(props)
    this.state = {
      history: [],
      transactions: []
    }
  }
  componentDidMount() {
    if (this.props.request) {
      api.get('request/history/' + this.props.request)
        .then((res) => {
          console.log(res.data)
          this.setState({history: res.data})
        })
        .catch(console.log)
    }
  }
  render() {
    return <div className="reports-and-documents-box">
      <div className="box">
        <h3>Reports & Documents</h3>
        <Subheader
          data={[
            {
              header: 'Transactions',
              content: this.state.transactions.length === 0 ? 'no data' : this.state.transactions.map(transaction => <div>transaction</div>)
            },{
              header: 'Agreements',
              content: 'no data'
            },{
              header: 'History',
              content: this.state.history.length === 0 ? 'no data' : this.state.history.map(transaction => 
                <div className="request-history-block">
                  <div className="request-history-text">
                    <h4>{transaction.title}</h4>
                    <p>{transaction.subtitle}</p>
                  </div>
                  <div className="request-history-date">
                    {new LevDate(transaction.date).niceTime()}
                  </div>
                </div>)
            }
          ]}
        />
      </div>
    </div>
  }
}
