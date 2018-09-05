import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Sortable2 from '../../Sortable2.jsx';
import LevDate from '../../LevDate.jsx';

import { api, setPage } from '../../helpers';

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
    property: "chat",
    width: "135px",
    type: "unsortable",
  },
  {
    property: "relay",
    width: "305px",
    type: "unsortable",
  },
];
class ManagersList extends Component {
  constructor(props) {
    super(props);
    this.state = {managers: []};
  }
  relay(manager) {
    if (confirm('Are you sure?'))
      api.post('requests/relay-to-manager', {
        manager,
        request: this.props.request
      })
        .then(() => setPage('requests'))
        .catch(console.log);
  }
  componentWillMount() {
    api.get('marketplace/-1?only-from-company=' + this.props.company)
      .then(res => {
        this.setState({managers: res.data.offers});
      }).catch(console.log);
  }
  render() {
    let sortableManagers = this.state.managers.map((manager, i) => {
      const name = manager.name  || '' + " " + manager.surname || '';
      return {
        id: manager._id,
        img: <img src={manager.img ? api.imgUrl(manager.img) : 'manager/user.svg'} className="user-icon" />,
        name: {
          render: <Link to={"/manager/" + manager._id} className="no-margin no-link-style">
            {name}
          </Link>,
          value: name
        },
        services: (manager.services || []).length === 0 ? <div>-</div> :
        <ul className="services-in-table-list">{manager.services.map((service, i) => <li key={i}>
          {filters[service.type].link}
        </li>)}</ul>,
        perfomance: (manager.services || []).length === 0 ? <div>-</div> :
        <ul className="services-in-table-list">{manager.services.map((service, i) => <li key={i}>
          {manager.services[i].fee}%
        </li>)}</ul>,
        relay:
            <button onClick={() => this.relay(manager._id)} className="big-blue-button">
              RELAY REQUEST
            </button>,
        chat: <Link to={"/chat/" + manager.user} className="no-margin">
            <button className="big-blue-button">
              Chat
            </button>
          </Link>
      };
    });
    return (
      <div className="box">
        {sortableManagers.length > 0 ? <Sortable2
            filter={row => true}
            columns={sortableHeader}
            data={sortableManagers}
            navigation={true}
            maxShown={5}
          /> : ''}
        </div>)
  }
}

export default ManagersList;