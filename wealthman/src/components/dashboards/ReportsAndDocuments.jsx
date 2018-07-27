import React, { Component } from 'react';

import Subheader from '../Subheader'

export default class ReportsAndDocuments extends Component {
  render() {
    return <div className="reports-and-documents-box">
      <div className="box">
        <h3>Reports & Documents</h3>
        <Subheader
          data={[
            {
              header: 'Transactions',
              content: 'no data'
            },{
              header: 'Agrements',
              content: 'no data'
            },{
              header: 'Recomendation history',
              content: 'no data'
            }
          ]}
        />
      </div>
    </div>
  }
}
