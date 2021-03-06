import React, { Component } from 'react';
import { store, setReduxState } from '../../redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Sortable2 from '../Sortable2';
import Select from '../inputs/Select';
import Input from '../inputs/Input';
import Search from '../Search';
import Avatar from '../Avatar';
import LevDate from '../LevDate';
import { api, setPage, setCurrency, setCookie, niceNumber } from '../helpers';
import AuthWindows from '../AuthWindows'

class InvestorsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchName: "",
      gotData: false,
      investors: [],
      openSignUp: () => {},
      onlyClients: false,
      clientApplications: []
    }
  }
  componentDidMount() {
    api.post('investors-list')
      .then((res) => {
        this.setState({gotData: true, investors: res.data});
      })
      .catch(console.log)
    api.post('requests')
      .then((res) => {
        const filteredRequests = []
        for (let request of res.data) {
          if (request.status === 'pending' && !request.initiatedByManager && request.type === 'portfolio')
            filteredRequests.push(request)
        }
        this.setState({
          clientApplications: filteredRequests.map(request => ({
            label: 'New application: ' + request.investing_reason,
            link: '/request/' + request._id
          }))
        })
      })
  }
  render() {
    let sortableHeader = [
      {
        property: "img",
        title: "",
        width: "41px",
        type: "unsortable",
      },
      {
        property: "name",
        title: "Investor name",
        width: "86px",
        type: "unsortable",
      },
      {
        property: "registered",
        title: "Days in system",
        // width: "55px",
        width: "60px",
        type: "date",
      },
      {
        property: "source",
        title: "source",
        width: "82px",
      },
      {
        property: "target",
        title: "target",
        width: "102px",
      },
      {
        property: "managers",
        title: "Number of managers",
        // width: "52px",
        width: "72px",
      },
      {
        property: "aum",
        title: "AUM, $",
        width: "62px",
        type: "number",
        tooltip: "Assets Under Management in millions of $"
      },
      {
        property: "risk",
        title: "Risk",
        width: "32px",
        type: "number",
        tooltip: "Risk tolerance rate"
      },
      {
        property: "kyc",
        title: "KYC",
        width: "52px",
        type: "number",
      },
      {
        property: "lastActive",
        title: "Last active",
        width: "82px",
        type: "number",
      },
      {
        property: "recommendation",
        title: "Recommendation needed",
        width: "32px",
        type: "number",
      },
      // {
      //   property: 'chat',
      //   width: "105px",
      //   type: "unsortable",
      // },
      {
        property: 'offer',
        width: "76px",
        type: "unsortable",
      }
    ];

    let sortableInvestors = this.state.investors.map((investor, i) => {
      const name = (investor.name || '') + " " + (investor.surname || '');
      const risk = 20 + Math.round(Math.random() * 60) 
      return {
        id: investor._id,
        img: <Avatar src={investor.img ? api.imgUrl(investor.img) : ""} size="40px" />,
        name: {
          render: <Link to={"/investor/" + investor._id} className="no-margin">
            {(investor.name || '') + ' ' + (investor.surname || '')}
          </Link>,
          toLowerCase: () => (investor.name || '') + ' ' + (investor.surname || ''),
          value: (investor.name || '') + ' ' + (investor.surname || '')
        },
        registered: new LevDate(investor.registered || (Date.now() - 1000 * 60 * 600)).pastDays(),
        aum: niceNumber(investor.aum),
        kyc: investor.kyc_filled ? 'filled' : 'unfilled',
        risk: {
          value: risk,
          render: risk + ' %'
        },
        source: investor.source,
        target: investor.last_target,
        managers: investor.managers_amount,
        lastActive: investor.online ? 'online' : new LevDate(investor.last_active).niceTime(),
        recommendation: 'no',
        offer: <Link to={"/special-offer/" + investor._id} className="no-margin offer-link">
              add portfolio
          </Link>
      };
    });
    return (
      <div className="invesotrs-page">
        <AuthWindows
          openSignUp={(func) => this.setState({openSignUp: func})}
          forManagers={false}
          registerNewClient={true}
        />
        <article className="long-text-input">
          <div className="container">
            <Search value={this.state.searchName} setValue={(value) => this.setState({searchName: value})} />
          </div>
        </article>
        {this.state.clientApplications.length > 0 && <div className="container">
          <div className="row-padding">
            <div className="box">
              <h2>Client applications:</h2>
              <br />
              {this.state.clientApplications.map(application => 
                <div className="row">
                  <ins>
                    <Link to={application.link}>{application.label}</Link>
                  </ins>
                  <br />
                  <br />
                </div>
              )}
            </div>
          </div>
        </div>}
        <div className="container">
          <div className="row-padding">
            <h1 className="inlibe-block-header">Marketplace</h1>
            <label>
              <Input type="switcher" value={this.state.onlyClients} setValue={(value) => this.setState({onlyClients: value})}/>
              My clients
            </label>
            <button onClick={() => this.state.openSignUp()} className="big-blue-button right">Add clients</button>
          </div>
          {this.state.gotData ?
            <Sortable2
              filter={investor =>
                investor.name.toLowerCase().includes(this.state.searchName.toLowerCase())
                &&
                (
                  !this.state.onlyClients
                  ||
                  investor.source === 'Added client'
                )
              }
              columns={sortableHeader}
              data={sortableInvestors}
              navigation={true}
              maxShown={5}
            />
            :
            <div className="loading"><p>Loading</p></div>
          }
        </div>
      </div>
    );
  }
}



export default connect(a => a)(InvestorsPage);
