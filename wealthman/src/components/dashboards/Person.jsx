import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { api, getCookie } from '../helpers'
import LevDate from '../LevDate'
import Avatar from '../Avatar'

export default class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      subtitle: ''
    }
  }
  loadCompany(companyId) {
    api.get('company/' + companyId)
      .then((res) => {
        this.setState({
          subtitle: res.data.company_name
        })
      })
      .catch(console.log)
  } 
  render() {
    const person = getAnotherPerson(this.props.requestData.investor, this.props.requestData.manager, this.props.requestData.company)
    if (/^(comapny\-)[0-9]+$/.test(person.subtitle)) {
      this.loadCompany(person.subtitle.replace(/[^0-9]/g));
      person.subtitle = '';
    }
    return (
        <div className="person-details">
          <Avatar size="67px" src={person.img ? api.imgUrl(person.img) : 'user-icon.svg'} />
          <div className="person-details-name">
            <h4>{person.name}</h4>
            <p>{this.state.subtitle !== '' ? this.state.subtitle : person.subtitle}</p>
          </div>
          <div className="person-details-numbers">
            <div>
              <h4>2</h4>
              <p>Portfolies</p>
            </div>
            <div>
              <h4>2 month</h4>
              <p>On platform</p>
            </div>
          </div>
          <Link to={"/chat/" + person.user}>
            <button className="chat-btn" onClick={() => this.setPage("chat")}>Start chat</button>
          </Link>
        </div>)
  }
}


const getAnotherPerson = (investor, manager, company) => {
  let anotherPersonData = {};
  let subtitle = '';
  switch (getCookie('usertype') * 1) {
    case 0:
      if (manager !== null) {
        anotherPersonData = manager;
        subtitle = manager.company === null ? 'lonely manager' : 'comapny-' + manager.comapny
      } else if (company !== null) {
        anotherPersonData = company;
        subtitle = 'comapny';
      }
      break;
    case 1:
      if (investor !== null) {
        anotherPersonData = investor;
        subtitle = 'investor';
      } else if (company !== null) {
        anotherPersonData = company;
        subtitle = 'company';
      }
      break;
    case 3:
      if (investor !== null) {
        subtitle = 'investor';
        anotherPersonData = investor;
      } else if (manager !== null) {
        anotherPersonData = manager;
        subtitle = manager.company === null ? 'lonely manager' : 'comapny-' + manager.comapny
      }
      break;
  }
  return {
    _id: anotherPersonData._id,
    user: anotherPersonData.user,
    name: anotherPersonData.company_name || ((anotherPersonData.name || '') + ' ' + (anotherPersonData.surname || '')),
    img: anotherPersonData.img ? anotherPersonData.img : 'manager/user.svg',
    subtitle
  }
}