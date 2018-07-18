import React, { Component } from 'react';
import { store, setReduxState } from '../../redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Sortable2 from '../Sortable2.jsx';
import { api, setPage, setCurrency, setCookie } from '../helpers';

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
      filter: 'Robo-advisor',
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
    const manager = this.state.offers.find(i => i.id === managerID);
    setCookie('service', filters[this.state.filter]);
    setCookie('selectedManager', (manager.company_name ? 'company' : 'manager') + '/' + manager.id);
    setPage(this.props.user === -1 ? "reg-or-login/" : "kyc/" + (manager.company_name ? 'company' : 'manager') + '/' + manager.id);
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
    this.setState({gotData: false});

    let filterIndex;
    switch(filter.toLowerCase()) {
      case 'robo-advisor': filterIndex = 0; break;
      case 'discretionary': filterIndex = 1; break;
      case 'advisory': filterIndex = 2; break;
      default: filterIndex = 0
    }
    console.log(`filterIndex: ${filterIndex}`);
    // console.log('marketplace/' + filterIndex + (this.props.user === 3 ? (this.props.currentPage === 'company-managers' ? '?only-from-company=' + this.props.userData.id : '?only-single-managers=true') : ''));
    api.get('marketplace/' + filterIndex + (this.props.user === 3 ? (this.props.currentPage === 'company-managers' ? '?only-from-company=' + this.props.userData.id : '?only-single-managers=true') : ''))
      .then((res) => {
        this.setState(res.data);
        this.setState({gotData: true});
      })
      .catch(console.log);
  }
  componentWillMount() {
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
        width: "156px",
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
        width: "64px",
        // width: "104px",
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
        width: "150px",
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
    let sortableManagers = this.state.offers.map((manager, i) => {
      const name = manager.name || manager.company_name || '' + " " + manager.surname || '';
      return {
        id: manager.id,
        img: <img src={manager.img ? api.imgUrl(manager.img) : 'manager/user.svg'} className="user-icon" />,
        name: {
          render: <Link to={"/manager/" + manager.id} className="no-margin no-link-style">
            {name}
          </Link>,
          value: name
        },
        rating: {
          render: <div className="rating">{manager.successRate}</div>,
          value: manager.successRate
        },
        //rename this variable everywhere !!!
        min: '-',
        aum: {
          render: manager.aum + "$",
          value: manager.aum
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
        apply: <div className="no-margin" onClick={() => this.applyManager(manager.id)}>
            <button className="big-blue-button">
              APPLY NOW
            </button>
          </div>,
        invite: <Link to={"/invite-manager/" + manager.id} className="no-margin">
            <button className="big-blue-button">
              INVITE NOW
            </button>
          </Link>,
        chat: <Link to={"/chat/" + manager.user} className="no-margin">
            <button className="big-blue-button">
              Chat
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
              filter={row => row.name.value.toLowerCase().includes(this.state.searchName.toLowerCase())}
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
