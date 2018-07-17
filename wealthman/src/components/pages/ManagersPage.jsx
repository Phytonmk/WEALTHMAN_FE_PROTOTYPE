import React, { Component } from 'react';
import { setReduxState } from '../../redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
// import Sortable from '../Sortable.jsx';
import Sortable from '../Sortable.jsx';
import Sortable2 from '../Sortable2.jsx';
import { api, setPage, setCurrency } from '../helpers';

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
  {
    link: "Unsorted",
    description: "Display all managers",
  }
];

class ManagersPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchName: "",
      gotData: false,
      filter: 'Unsorted',
      offers: [],
      totalInvestors: '-',
      totalManagers: '-',
      totalAum: '-',
    }
  }
  applyManager(managerID) {
    setReduxState({
      currentManager: managerID,
    });
  }
  load(filter) {
    if (filter)
      this.setState({filter});
    else
      filter = this.state.filter
    this.setState({gotData: false});

    let filterIndex;
    switch(filter.toLowerCase()) {
      case 'robo-advisor': filterIndex = 0; break;
      case 'discretionary': filterIndex = 1; break;
      case 'advisory': filterIndex = 2; break;
      default: filterIndex = -1
    }
    console.log(filterIndex);
    api.get('marketplace/' + filterIndex)
      .then((res) => {
        this.setState(res.data);
        this.setState({gotData: true});
      })
      .catch(console.log);
  }
  componentWillMount() {
    this.setState({gotData: false});
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
        width: "206px",
      },
      {
        property: "rating",
        title: "Success rate",
        // width: "55px",
        width: "85px",
        type: "number",
      },
      {
        property: "min",
        title: "min. investment",
        // width: "64px",
        width: "104px",
        type: "number",
      },
      {
        property: "aum",
        title: "AUM, mln $",
        // width: "32px",
        width: "82px",
        type: "number",
        tooltip: "Assets Under Management in millions of $"
      },
      {
        property: "services",
        title: "Services",
        // width: "73px",
        width: "100px",
        type: "unsortable",
      },
      {
        property: "perfomance",
        title: "performance fee",
        // width: "73px",
        width: "103px",
        type: "number",
      },
      {
        property: "clients",
        title: "Number of clients",
        // width: "52px",
        width: "82px",
      },
      {
        property: "aum6",
        title: "6m aum graph",
        width: "100px",
        type: "unsortable",
        tooltip: "Assets Under Management in the last 6 month"
      },
      {
        property: "apply",
        width: "135px",
        type: "unsortable",
      },
    ];
    let sortableManagers = this.state.offers.map((manager, i) => {
      return {
        id: manager.id,
        img: <img src={manager.img ? api.imgUrl(manager.img) : 'manager/user.svg'} className="user-icon" />,
        name: {
          render: <Link to={"/manager/" + manager.id} className="no-margin no-link-style">
            {manager.name + " " + manager.surname}
          </Link>,
          sortBy: manager.name + " " + manager.surname
        },
        rating: {
          render: <div className="rating">{manager.successRate}</div>,
          sortBy: manager.successRate
        },
        //rename this variable everywhere !!!
        min: '-',
        aum: {
          render: manager.aum + "$",
          sortBy: manager.aum
        },
        services: manager.services.length === 0 ? <div>-</div> : 
        <ul className="services-in-table-list">{manager.services.map((service, i) => <li key={i}>
          {filters[service.type].link}
        </li>)}</ul>,
        //rename this variable everywhere !!!
        clients: manager.clients,
        perfomance: manager.services.length === 0 ? <div>-</div> : 
        <ul className="services-in-table-list">{manager.services.map((service, i) => <li key={i}>
          {manager.services[i].fee}%
        </li>)}</ul>,
        aum6: <img src="graph.png" className="graph" />,
        apply: <Link to={this.props.user === -1 ? "/reg-or-login/" + manager.id : "/kyc/" + manager.id} className="no-margin" onClick={() => this.applyManager(manager.id)}>
            <button className="big-blue-button">
              APPLY NOW
            </button>
          </Link>
      };
    });

    // var filtersMapped = filters.map((filter, i) =>
    //   <button key={i} className={"blue-link left" + (this.props.managersFilter == filter.link ? " active" : "")} onClick={() => setReduxState({managersFilter: filter.link})}>
    //     {filter.link}
    //   </button>
    // );
    let filtersMapped = filters.map((filter, i) =>
      <button key={i} className={"blue-link left" + (this.state.filter == filter.link ? " active" : "")} onClick={() => this.load(filter.link)}>
        {filter.link}
      </button>
    );

    return (
      <div>
        <article className="long-text-input">
          <div className="container">
            <button className="search" />
            <button className="cancel" onClick={() => this.setState({searchName: ""})} />
            <input type="text" value={this.state.searchName} onChange={(event) => this.setState({ searchName: event.target.value })} placeholder="Search..." />
          </div>
        </article>
        <div className="container">
            <div className="row">
              <div className="advisors">
                <div className="row">
                  <span>Sort by</span>
                  {filtersMapped}
                </div>
                <div className="row margin">
                  <Link to="faq" className="grey-link" onClick={() => {setPage("faq"); setReduxState({faqId: filters.find(filter => filter.link == this.props.managersFilter).link})}}>
                    Invest on Autopilot
                  </Link>
                </div>
              </div>
              <div className="card-3">
                <div className="img" />
                <span>Total AUM, min $</span>
                <h4>{this.state.totalAum}</h4>
              </div>
              <div className="card-2">
                <div className="img" />
                <span>Total managers</span>
                <h4>{this.state.totalManagers}</h4>
              </div>
              <div className="card-1">
                <div className="img" />
                <span>Total investors</span>
                <h4>{this.state.totalInvestors}</h4>
              </div>
            </div>
        </div>
        <div className="container">
          {this.state.gotData ?
            <Sortable2
              filter={row => row.name.sortBy.toLowerCase().includes(this.state.searchName.toLowerCase())}
              columns={sortableHeader}
              data={sortableManagers}
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
