import React, { Component } from 'react';
import { setReduxState } from '../../redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Sortable2 from '../Sortable2.jsx';
import Select from '../Select.jsx';
import Search from '../Search.jsx';
import myDate from '../myDate.jsx';
import { api, setPage, setCurrency, previousPage } from '../helpers';

const requests = [{}]

class RequestsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      requests,
      managers: [],
      investors: [],
      companies: [],
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
              component.setState({investors});
            })
            .catch(console.log);
          api.get('company/' + request.company)
            .then((res) => {
              const companies = [...component.state.companies];
              companies.push(res.data);
              component.setState({companies});
            })
            .catch(console.log);
        }
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
        width: "90px",
      },
      {
        property: "date",
        title: "Date",
        width: "100px",
      },
      {
        property: "status",
        title: <div>
          <span className="left margin">Status: </span>
          <Select
            value={this.state.status}
            options={["All", "Declined", "Accepted", "Cancelled", "Pending"]}
            setValue={(value) => this.setState({status: value})}
            width="135px"
          />
        </div>,
        width: "150px",
        type: "unsortable"
      },
      {
        property: 'value',
        title: 'value',
        width: '50px'
      },
      {
        property: 'service',
        title: 'service',
        width: '100px'
      },
      // {
      //   property: 'percent_change',
      //   title: 'percent_change',
      //   width: '50px'
      // },
      {
        property: "chat",
        title: "",
        width: "100px",
        type: "unsortable",
      },
      {
        property: "details",
        title: "",
        width: "120px",
        type: "unsortable",
      },
    ];
    let sortableRequests = this.state.requests.map(request => {
      let user = {};
      if (request.type === 'portfolio') {
        if (this.props.user === 0)
          user = request.company ?
          this.state.companies.find(i => i.id == request.company) || {} :
          this.state.managers.find(i => i.id == request.manager) || {}
        else if (this.props.user === 1)
          user = request.company ?
          this.state.companies.find(i => i.id == request.company) || {} :
          this.state.investors.find(i => i.id == request.investor) || {}
        else if (this.props.user === 3)
          user = this.state.investors.find(i => i.id == request.investor) || {}
      } else if (request.type === 'inviting') {
        if (this.props.user === 1)
          user = this.state.companies.find(i => i.id == request.company) || {}
        else if (this.props.user === 3)
          user = this.state.managers.find(i => i.id == request.manager) || {};
      }
      let date = new myDate(request.date);
      const value = Math.ceil(Math.random() * 100);
      const percent_change = Math.ceil(Math.random() * 20);
      return {
        id: request.id,
        img: <div className="in-sortable-img-container"><img src={user.img ? api.imgUrl(user.img) : 'manager/user.svg'} className="user-icon" /></div>,
        name: {
          render: <Link to={(this.props.user == 1 ? "/investor/" : "/manager/") + user.id} className="no-margin no-link-style">
            {user.name || user.company_name || '' + " " + user.surname || ''}
          </Link>,
          value: user.name || '' + " " + user.surname || ''
        },
        date: {
          render: date.niceTime(),
          value: date.getTime(),
        },
        value: {
          render: value + '$',
          value: value
        },
        service: request.service || 'undefined',
        percent_change: {
          render: percent_change + '%',
          value: percent_change
        },
        status: {
          render: <span className={request.status}>
            {request.status}
          </span>,
          value: request.status
        },
        chat: <button className="big-blue-button chat">
          CHAT
        </button>,
        details:
        <Link to={"request/" + request.id}>
          <button className="big-blue-button chat">
            DETAILS
          </button>
        </Link>
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
            <div className="searcharea">
              <Search value={this.state.searchName} setValue={(value) => this.setState({searchName: value})} />
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
