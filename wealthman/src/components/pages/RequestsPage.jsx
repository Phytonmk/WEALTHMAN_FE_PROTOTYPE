import React, { Component } from 'react';
import { setReduxState } from '../../redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Sortable2 from '../Sortable2.jsx';
import myDate from '../myDate.jsx';
import { api, setPage, setCurrency, previousPage } from '../helpers';

const requests = [
    {
      id: 0,
      investor: 0,
      manager: 6,
      date: "15:16 18-07-2018",
      value: 1,
      currency: "ETH",
      status: "cancelled",
    },
    {
      id: 1,
      investor: 0,
      manager: 6,
      date: "15:16 12-07-2016",
      value: 2,
      currency: "ETC",
      status: "declined",
    },
    {
      id: 2,
      investor: 0,
      manager: 6,
      date: "15:16 12-05-2017",
      value: 4,
      currency: "BTC",
      status: "accepted",
    },
    {
      id: 3,
      investor: 0,
      manager: 6,
      date: "15:16 12-08-2015",
      value: 3,
      currency: "XRP",
      status: "pending",
    },
  ]

class RequestsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      requests,
      managers: [],
      investors: [],
      gotData: true,
      searchName: "",
      status: "All",
    };
  }
  componentWillMount() {
    // console.log('componentWillMount');
    const component = this;
    api.post('requests')
      .then((res) => {
        component.setState({requests: res.data, managers: [], investors: [], gotData: true});
        for (let request of component.state.requests) {
          api.get('manager/' + request.manager)
            .then((res) => {
              const managers = [...component.state.managers];
              managers.push(res.data);
              component.setState({managers});
            })
            .catch(console.log);
          api.get('investor/' + request.investor)
            .then((res) => {
              const investors = [...component.state.investors];
              investors.push(res.data);
              console.log('data');
              component.setState({investors});
            })
            .catch(console.log);
        }
      })
      .catch(console.log);
  }
  render() {
    if (!this.state.gotData)
      return <div className="box loading"><p>Loading</p></div>
    console.log('render');
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
        property: "date",
        title: "Date",
        width: "140px",
        type: "date",
      },
      {
        property: "status",
        title: <div>
          <span className="left">Status</span>
          <select value={this.state.status} onChange={event => this.setState({status: event.target.value})}>
            {
              ["All", "Declined", "Accepted", "Cancelled", "Pending"].map(status =>
                <option key={status} value={status}>
                  {status}
                </option>
              )
            }
          </select>
        </div>,
        width: "200px",
      },
      {
        property: "chat",
        title: "",
        width: "150px",
        type: "unsortable",
      },
    ];
    let sortableRequests = this.state.requests.map(request => {
      let user = (this.props.user == 1 ?
        this.state.investors.find(i => i.id == request.investor)
        :
        this.state.managers.find(i => i.id == request.manager)) || {
          id: 0,
          name: "Hideo",
          surname: "Kojima",
          img: "manager/user.svg",
        };
      let date = new myDate(request.date);

      return {
        id: request.id,
        img: <img src={user.img ? api.imgUrl(user.img) : 'manager/user.svg'} className="user-icon" />,
        name: {
          render: <Link to={(this.props.user == 1 ? "/investor/" : "/manager/") + user.id} className="no-margin no-link-style">
            {user.name + " " + user.surname}
          </Link>,
          value: user.name + " " + user.surname
        },
        date: {
          render: date.niceTime(),
          value: date.getTime(),
        },
        status: {
          render: <span className={request.status}>
            {request.status}
          </span>,
          value: request.status
        },
        chat: <button className="big-blue-button chat">
          START CHAT
        </button>
      };
    });

    return (
      <div>
        <div className="requests-container">
          <div className="my-requests">
            <div className="column fourth">
              <h2>My requests</h2>
              <span>All requests</span>
            </div>
            <div className="searcharea search-field">
              <button className="search" />
              {
                this.state.searchName.length != "" ?
                  <button className="cancel" onClick={() => this.setState({searchName: ""})} />
                  :
                  ""
              }
              <input type="text" value={this.state.searchName} onChange={(event) => this.setState({ searchName: event.target.value })} placeholder="Search..." />
            </div>
          </div>
          <Sortable2
            filter={
              row =>
                row.name.value.toLowerCase().includes(this.state.searchName.toLowerCase())
                &&
                (this.state.status.toLowerCase() == "all" ? true : (row.status.value.toLowerCase() == this.state.status.toLowerCase()))
            }
            columns={sortableHeader}
            data={sortableRequests}
            navigation={true}
            maxShown={4}
          />
        </div>
      </div>
    );
  }
}

export default connect(a => a)(RequestsPage);
