import React, { Component } from 'react';
import { setReduxState } from '../../redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Sortable2 from '../Sortable2.jsx';
import Select from '../Select.jsx';
import Search from '../Search.jsx';
import Avatar from '../Avatar.jsx';
import LevDate from '../LevDate.jsx';
import { api, setPage, setCurrency, previousPage } from '../helpers';

const requests = []

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
          let loadProfileOf = 'investor';
          switch(this.props.user) {
            case 0:
              if (request.company)
                loadProfileOf = 'company';
              else
                loadProfileOf = 'manager';
            break;
            case 1:
              if (request.company)
                loadProfileOf = 'company';
              else
                loadProfileOf = 'investor';
            break;
            case 3:
              if (request.type === 'portfolio')
                loadProfileOf = 'investor';
              else
                loadProfileOf = 'manager';
            break;
          }
          api.get(loadProfileOf + '/' + request[loadProfileOf])
            .then((res) => {
              let many = 'investors';
              if (loadProfileOf === 'manager')
                many = 'managers';
              else if (loadProfileOf === 'company')
                many = 'companies'
              const tmp = [...component.state[many]];
              tmp.push(res.data);
              component.setState({[many]: tmp});
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
        property: "person",
        title: "",
        width: "156px",
      },
      {
        property: "name",
        title: "Request name",
        width: "106px",
      },
      {
        property: "date",
        title: "Date",
        width: "100px",
      },
      {
        property: "inout",
        title: "In/Out",
        width: "60px",
      },
      {
        property: "status",
        title: <div>
          <span className="left margin">Status</span>
          {/*<Select
            value={this.state.status}
            options={["All", "Declined", "Accepted", "Cancelled", "Pending"]}
            setValue={(value) => this.setState({status: value})}
          />*/}
        </div>,
        width: "130px",
        type: "unsortable"
      },
      {
        property: 'value',
        title: 'value',
        width: '70px'
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
      // {
      //   property: "profile",
      //   title: "",
      //   width: "130px",
      //   type: "unsortable",
      // },
      // {
      //   property: "details",
      //   title: "",
      //   width: "130px",
      //   type: "unsortable",
      // },
    ];
    let sortableRequests = this.state.requests.map(request => {
      let user = {};
      if (request.type === 'portfolio') {
        if (this.props.user === 0)
          user = request.company ?
          this.state.companies.find(i => i._id == request.company) || {} :
          this.state.managers.find(i => i._id == request.manager) || {}
        else if (this.props.user === 1)
          user = request.company ?
          this.state.companies.find(i => i._id == request.company) || {} :
          this.state.investors.find(i => i._id == request.investor) || {}
        else if (this.props.user === 3)
          user = this.state.investors.find(i => i._id == request.investor) || {}
      } else if (request.type === 'inviting') {
        if (this.props.user === 1)
          user = this.state.companies.find(i => i._id == request.company) || {}
        else if (this.props.user === 3)
          user = this.state.managers.find(i => i._id == request.manager) || {};
      }
      let date = new LevDate(request.date);
      let value = {render: '', value: 0};
      if (request.value)
        value = {
          render: request.value + ' ETH',
          value: request.value
        }
      let actionStatus = 'System msg'
      const percent_change = Math.ceil(Math.random() * 20)
      let outgoing = false
      if (request.initiatedByManager) {
        if (this.props.user == 1)
          outgoing = true
      } else {
        if (this.props.user != 1)
          outgoing = true
      }
      let userLink = '/investor/';
      switch(this.props.user) {
        case 0:
          if (!outgoing && ['pending', 'waiting for withdraw'].includes(request.status.toLowerCase())) {
            actionStatus = 'Response needed'
          }
          if (request.company)
            userLink = '/company/';
          else
            userLink = '/manager/';
        break;
        case 1:
          if (!outgoing && ['pending', 'in work'].includes(request.status.toLowerCase()))
            actionStatus = 'Response needed'
          if (request.company)
            userLink = '/company/';
          else
            userLink = '/investor/';
        break;
        case 3:
          if (!outgoing && ['pending'].includes(request.status.toLowerCase())) {
            actionStatus = 'Response needed'
          }
          if (request.type === 'portfolio')
            userLink = '/investor/';
          else
            userLink = '/manager/';
        break;
      }
      if (['deploying', 'buying tokens', 'waiting for deposit', 'recalculation', 'selling tokens', 'getting ethereum'].includes(request.status.toLowerCase()))
        actionStatus = 'Protfolio configuration'
      return {
        id: request._id,
        img: <Avatar src={user.img ? api.imgUrl(user.img) : ""} size="40px" />,
        person: {
          render: <Link to={userLink + user._id} className="no-margin no-link-style">
            {(user.name || user.company_name || '') + " " + (user.surname || '')}
          </Link>,
          value: (user.name || user.company_name || '') + " " + (user.surname || '')
        },
        date: {
          render: date.niceTime(),
          value: date.getTime(),
        },
        inout: outgoing ? 'outgoing' : 'ingoing',
        value,
        service: request.type === 'inviting' ? 'inviting' : (request.service || 'undefined'),
        percent_change: {
          render: percent_change + '%',
          value: percent_change
        },
        name: {
          render: <span className={request.status}>
            {request.status}
          </span>,
          value: request.status
        },
        status: actionStatus,
        profile:
        <Link to={userLink + user._id}>
          <button className="big-blue-button">
            PROFILE
          </button>
        </Link>,
        // details:
        // <Link to={"request/" + request._id}>
        //   <button className="big-blue-button">
        //     DETAILS
        //   </button>
        // </Link>
        detailsLink: "request/" + request._id
      };
    });

    return (
      <div id="requests-page">
        <div className="container">
          <div className="my-requests">
            <div className="column fourth">
              <h2>Events log</h2>
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
            initialSortBy={'date'}
            linkProperty={"detailsLink"}
          />
        </div>
      </div>
    );
  }
}

export default connect(a => a)(RequestsPage);
