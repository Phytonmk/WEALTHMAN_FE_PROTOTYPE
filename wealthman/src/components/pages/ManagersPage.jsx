import React, { Component } from 'react';
import { store, setReduxState } from '../../redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Sortable2 from '../Sortable2.jsx';
import Select from '../Select.jsx';
import Search from '../Search.jsx';
import Avatar from '../Avatar.jsx';
import { api, setPage, setCurrency, setCookie } from '../helpers';
import {AreaChart} from 'react-easy-chart';

const filters = [
  {
    link: "Robo-advisor",
    description: "Invest on Autopilot",
  },
  {
    link: "Discretionary",
    description: "Get The Right Investment Manager For Your Wealth",
  },
  {
    link: "Advisory",
    description: "Find The Right Advisory Support For Your Own Decisions On Investment Management",
  },
];

class ManagersPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchName: "",
      gotData: false,
      filter: "Robo-advisor",
      offers: [],
      totalInvestors: '-',
      totalManagers: '-',
      totalAum: '-',
    }
    let lastPage
    store.subscribe(() => {
      const state = store.getState();
      if ((state.currentPage === 'company-managers' || state.currentPage === 'managers') && state.currentPage !== lastPage)
        setTimeout(this.load.bind(this), 0);
    });
  }
  applyManager(managerID) {
    setReduxState({
      currentManager: managerID,
    });
    const manager = this.state.offers.find(i => i._id === managerID);
    setCookie('service', this.state.filter);
    setCookie('selectedManager', (manager.company_name ? 'company' : 'manager') + '/' + manager._id);
    setPage(this.props.user === -1 ? "reg-or-login/" : "kyc/" + (manager.company_name ? 'company' : 'manager') + '/' + manager._id);
  }
  load(filter) {
    this.setState({
      offers: [],
      gotData: false
    })
    if (filter)
      this.setState({filter});
    else
      filter = this.state.filter

    let filterIndex;
    switch(filter.toLowerCase()) {
      case 'robo-advisor': filterIndex = 0; break;
      case 'discretionary': filterIndex = 1; break;
      case 'advisory': filterIndex = 2; break;
      default: filterIndex = 0
    }
    this.setState({gotData: false});
    let query = 'marketplace/'
    if (this.props.user === 3) {
      if (this.props.match.path  === '/company-managers') {
        query += '-1?only-from-company=' + this.props.userData._id
      } else {
        query += '-1?only-single-managers=true'
      }
    } else if (this.props.user === 1) {
      query += '-1?only-companies=true'
    } else {
      query += filterIndex
    }
    console.log(query)
    api.get(query)
      .then((res) => {
        this.setState(res.data);
        this.setState({gotData: true});
        setTimeout(() => this.forceUpdate(), 0);
      })
      .catch(console.log);
  }
  genGraphData() {
    const data = []
    const points = 10 + Math.round(Math.random() * 40)
    const range = 20 + Math.round(Math.random() * 60)
    for (let i = 0; i < points; i++)
      data.push({
        x: i,
        y: 10 + i + Math.round(Math.random() * (range / 2)  - range)
      })
    return data
  }
  componentDidMount() {
    if (!this.state.gotData)
      this.load();
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
        title: "Manager name",
        // width: "156px",
        width: "106px",
      },
      {
        property: "rating",
        title: "Success rate",
        // width: "85px",
        width: "70px",
        type: "number",
      },
      {
        property: "min",
        title: "min. investment",
        // width: "103px",
        width: "90px",
        type: "number",
      },
      {
        property: "aum",
        title: "AUM, mln $",
        // width: "82px",
        width: "70px",
        type: "number",
        tooltip: "Assets Under Management in millions of $"
      },
      {
        property: "services",
        title: "Services",
        // width: "150px",
        width: "100px",
        type: "unsortable",
      },
      {
        property: "perfomance",
        title: "performance fee",
        // width: "103px",
        width: "90px",
        type: "number",
      },
      {
        property: "clients",
        title: "Number of clients",
        // width: "82px",
        width: "70px",
      },
      {
        property: "aum6",
        title: "6m aum graph",
        // width: "100px",
        width: "90px",
        type: "unsortable",
        tooltip: "Assets Under Management in the last 6 month"
      }
    ];
    if (this.props.user === 0)
      sortableHeader.push({
          property: "apply",
          width: "135px",
          type: "unsortable",
        })
    else
      sortableHeader.push({
          property: "details",
          width: "135px",
          type: "unsortable",
        })
    if (this.props.user === 3) { // user -- company
      sortableHeader.pop();
      if (this.props.currentPage === 'company-managers')
        sortableHeader.push({
          property: 'chat',
          width: "105px",
          type: "unsortable",
        })
      else
        sortableHeader.push({
          property: 'invite',
          width: "135px",
          type: "unsortable",
        })
    }
    let sortableManagers = this.state.offers.map((manager, index) => {
      const name = (manager.name || manager.company_name || '') + " " + (manager.surname || '');
      return {
        id: manager.id,
        img: <Avatar src={manager.img ? api.imgUrl(manager.img) : ""} size="40px" />,
        name: {
          render: <Link to={(manager.company_name ? "/company/" : "/manager/") + manager._id} className="no-margin no-link-style">
            <b>{name}</b>
          </Link>,
          value: name
        },
        rating: {
          render: <div className="rating">{manager.successRate}</div>,
          value: manager.successRate
        },
        min: manager.services.length === 0 ? <div>-</div> :
        <ul className="services-in-table-list">{manager.services.map((service, i) => <li key={i}>
          {manager.services[i].min || '?'} $
        </li>)}</ul>,
        aum: {
          render: manager.aum + "$",
          value: manager.aum
        },
        services: {
          render: manager.services.length === 0 ? <div>-</div> :
          <ul className="services-in-table-list">{manager.services.map((service, i) => <li key={i}>
            {filters[service.type].link}
          </li>)}</ul>,
          value: manager.services.map(service => filters[service.type].link).reduce((a, b) => a + " " + b)
        },
        clients: manager.clients,
        perfomance: manager.services.length === 0 ? <div>-</div> :
        <ul className="services-in-table-list">{manager.services.map((service, i) => <li key={i}>
          {manager.services[i].perfomance_fee || '?'} %
        </li>)}</ul>,
        aum6: <AreaChart
            margin={{top: 0, right: 0, bottom: 0, left: 0}}
            width={80}
            height={20}
            data={[this.genGraphData()]}
          />,
        apply: <div className="no-margin" onClick={() => this.applyManager(manager._id)}>
            <button className="big-blue-button">
              APPLY NOW
            </button>
          </div>,
        invite: <Link to={"/participating/" + manager._id} className="no-margin">
            <button className="big-blue-button">
              INVITE NOW
            </button>
          </Link>,
        chat: <Link to={"/chat/" + manager.user} className="no-margin">
            <button className="big-blue-button">
              Chat
            </button>
          </Link>,
        details: <Link to={(manager.company_name ? "/company/" : "/manager/") + manager._id} className="no-margin">
            <button className="big-blue-button">
              Details
            </button>
          </Link>
      };
    });

    return (
      <div id="managers-page">
        <article className="long-text-input">
          <div className="container">
            <Search value={this.state.searchName} setValue={(value) => this.setState({searchName: value})} />
          </div>
        </article>
        <div className="container">
            {(this.props.user !== 1 && this.props.user !== 3) ? <div className="advisors">
                <span>Sort by</span>
                <Select
                  value={this.state.filter}
                  options={filters.map(filter => filter.link)}
                  setValue={(value) => {this.setState({filter: value}); setTimeout(() => this.load(), 0)}}
                  width="135px"
                />
              <br />
              <div className="row margin">
                <Link to="faq" className="grey-link" onClick={() => {setPage("faq"); setReduxState({faqId: filters.find(filter => filter.link == this.props.managersFilter).link})}}>
                  Invest on Autopilot
                </Link>
              </div>
            </div> : ''}
            <div className="card-3">
              <div className="img" />
              <span>Total AUM, min $</span>
              {/* <h4>{this.state.totalAum}</h4> */}
              <h4>
                {
                  this.state.offers.length > 0 ?
                  this.state.offers
                  .map(manager => manager.aum)
                  .reduce((a, b) => a + b)
                  : ""
                }
              </h4>
            </div>
            <div className="card-2">
              <div className="img" />
              <span>Total managers</span>
              {/* <h4>{this.state.totalManagers}</h4> */}
              <h4>{this.state.offers.length}</h4>
            </div>
            <div className="card-1">
              <div className="img" />
              <span>Total investors</span>
              {/* <h4>{this.state.totalInvestors}</h4> */}
              <h4>
                {
                  this.state.offers.length > 0 ?
                  this.state.offers
                  .map(manager => manager.clients)
                  .reduce((a, b) => a + b)
                  : ""
                }
              </h4>
            </div>
        </div>
        <div className="container">
          {this.state.gotData ?
            <Sortable2
              filter={row =>
                row.name.value.toLowerCase().includes(this.state.searchName.toLowerCase())
                //&&
                //row.services.value.toLowerCase().includes(this.state.filter.toLowerCase())
              }
              columns={sortableHeader}
              data={sortableManagers}
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



export default connect(a => a)(ManagersPage);
