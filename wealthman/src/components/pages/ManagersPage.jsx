import React, { Component } from 'react';
import { setReduxState } from '../../redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
// import Sortable from '../Sortable.jsx';
import Sortable from '../Sortable.jsx';
import Sortable2 from '../Sortable2.jsx';
import { api, setPage, setCurrency } from '../helpers';

const RANDOM = (range=100) => Math.ceil(Math.random() * range);

class ManagersPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchName: "",
      gotData: false,
    }
  }
  applyManager(managerID) {
    setReduxState({
      currentManager: managerID,
    });
  }
  componentWillMount() {
    api.get('managers')
      .then((res) => {
        console.log(this.props.managers);
        console.log(res.data);
        setReduxState({managers: res.data.map(manager => {
          let newManager = Object.assign({}, manager);
          newManager.rating = RANDOM();
          newManager.annual = RANDOM();
          newManager.aum = RANDOM();
          newManager.profit = RANDOM();
          newManager.clients = RANDOM();
          return newManager;
        })});
        this.setState({gotData: true})
      })
      .catch(console.log);
  }
  render() {
    if (!this.state.gotData)
      return <div className="box loading"><p>Loading</p></div>
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
    let sortableManagers = this.props.managers.map(manager => {
      return {
        id: manager.id,
        img: <img src={manager.img ? api.imgUrl(manager.img) : 'manager/user.svg'} className="user-icon" />,
        name: <Link to={"/manager/" + manager.id} className="no-margin no-link-style">
          {manager.name + " " + manager.surname}
        </Link>,
        rating: {
          render: <div className="rating">{manager.rating}</div>,
          sortBy: manager.rating
        },
        //rename this variable everywhere !!!
        min: manager.annual,
        aum: {
          render: manager.aum + "$",
          sortBy: manager.aum
        },
        //rename this variable everywhere !!!
        perfomance: manager.profit,
        clients: manager.clients,
        aum6: <img src="graph.png" className="graph" />,
        apply: <Link to={this.props.user === -1 ? "/reg-or-login" : "/kyc"} className="no-margin" onClick={() => this.applyManager(manager.id)}>
            <button className="big-blue-button">
              APPLY NOW
            </button>
          </Link>
      };
    });

    var filters = [
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
      }
    ];
    // var filtersMapped = filters.map((filter, i) =>
    //   <button key={i} className={"blue-link left" + (this.props.managersFilter == filter.link ? " active" : "")} onClick={() => setReduxState({managersFilter: filter.link})}>
    //     {filter.link}
    //   </button>
    // );
    let filtersMapped = filters.map(filter =>
      <button key={filter.link} className={"blue-link left" + (this.props.managersFilter == filter.link ? " active" : "")} onClick={() => setReduxState({managersFilter: filter.link})}>
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
                <h4>3$</h4>
              </div>
              <div className="card-2">
                <div className="img" />
                <span>Total managers</span>
                <h4>15</h4>
              </div>
              <div className="card-1">
                <div className="img" />
                <span>Total investors</span>
                <h4>8</h4>
              </div>
            </div>
            <Sortable2
              filter={row => row.name.props.children.toLowerCase().includes(this.state.searchName.toLowerCase())}
              columns={sortableHeader}
              data={sortableManagers}
            />
        </div>
      </div>
    );
  }
}



export default connect(a => a)(ManagersPage);
