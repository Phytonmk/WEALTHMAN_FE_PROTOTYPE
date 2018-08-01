import React, { Component } from 'react';
import { setReduxState } from '../../redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
// import Sortable from '../Sortable.jsx';
import { api, setPage, setCurrency, setCookie } from '../helpers';
import Social from './../Social';
import Avatar from '../Avatar.jsx';

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

class ManagerPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profitability: '-',
      clients: '-',
      portfolios: '-',
      manager: null,
      managerType: this.props.match.path.includes('company') ? 'company' : 'manager'
    }
  }
  componentWillMount() {
    api.get(this.state.managerType + '/' + this.props.match.params.id)
      .then((res) => {
        console.log('res.data');
        this.setState({manager: res.data});
      })
      .catch(console.log);
    api.get(this.state.managerType + '-statistics/' + this.props.match.params.id)
      .then((res) => {
        console.log(res.data);
        this.setState({
          profitability: res.data.profitability,
          clients: res.data.clients,
          portfolios: res.data.portfolios,
        });
      })
      .catch(console.log);
  }
  apply(filter) {
    setCookie('service', filters[filter].link);
    setCookie('selectedManager', this.state.managerType + '/' + this.props.match.params.id);
    setPage(this.props.user === -1 ? "reg-or-login/" : "kyc/" + this.state.managerType + '/' + this.props.match.params.id);
  }
  render() {
    var manager = this.state.manager;
    if (manager === null)
      return <div>...</div>

    let inviteBtn = '';

    if (this.props.user === 3 && manager.company_name === undefined && (manager.company === -1 || manager.company === null))
      inviteBtn = <Link to={"/participating/" + manager._id}>
                    <button className="big-blue-button right">Invite now</button>
                  </Link>
    else if (this.props.user === 1 && manager.company_name !== undefined && (this.props.userData.company === -1 || this.props.userData.company === null))
      inviteBtn = <Link to={"/participating/" + manager._id}>
                    <button className="big-blue-button right">Apply to be in</button>
                  </Link>
    return (
      <div id="manager-page">
        <div className="new-long-header" />
        <div className="container">
          <div className="top-row">
            <Avatar src={manager.img ? api.imgUrl(manager.img) : ""} size="96px" />
            {/* <div className="circle left">
              <img src={manager.img ? api.imgUrl(manager.img) : 'manager/user.svg'} className="avatar"/>
            </div> */}
            <div className="main-info">
              <div className="name-row">
                <h1>{(manager.name || manager.company_name || '') + (manager.surname || '')}</h1>
                <h3>{manager.age ? `Age ${manager.age}` : 'Age not specified'}</h3>
              </div>
              
            </div>

            <div className="column right">
              <div className="row">
                <Link to={"/chat/" + manager.user} onClick={() => this.setPage("chat")}>
                  <button className="big-transparent-button right">CONTACT</button>
                </Link>
                {inviteBtn}
              </div>
              {/*<div className="social-links">
                <span>Social networks</span>
                <Social links={manager.social} />
              </div>*/}
            </div>
          </div>

          <div className="row">
            <div className="main-column">
              {(manager.services || []).map((service, i) => <div className="box" key={i}>
                <h2>
                  {filters[service.type].link}
                  {this.props.user === 0 ?
                    <button
                      onClick={() => this.apply(i)}
                      className="big-blue-button right"
                    >Invest now</button> : ''}
                </h2>
                <p>{filters[service.type].description}</p>
                <div className="row">
                  <b>Exit fee:</b> {service.exit_fee} %
                </div>
                <div className="row">
                  <b>Managment fee:</b> {service.managment_fee} %
                </div>
                <div className="row">
                  <b>Perfomance fee:</b> {service.perfomance_fee} %
                </div>
                <div className="row">
                  <b>Font fee:</b> {service.front_fee} %
                </div>
                <div className="row">
                  <b>Recalculation:</b> {service.recalculation}
                </div>
                <div className="row">
                  <b>Minimal investment:</b> {service.min} $
                </div>
                <div className="row">
                  <b>Metodology:</b> {service.metodology}
                </div>
                <div className="row">
                  <b>Philosofy:</b> {service.philosofy}
                </div>
              </div>)}
            </div>
            <div className="second-column right">
              <div className="box">
                {manager.company_name ?
                <div className="row">
                  Company
                </div>
                :
                <div className="row">
                  Lonely manager
                </div>}
              </div>

              <div className="box">
                <h3>Statistics</h3>
                <h1 className="green">{this.state.profitability}%</h1>
                <small>Profitability (all time)</small>
                <h1>{this.state.clients}</h1>
                <small>Quantity clients</small>
                <h1>{this.state.portfolios}</h1>
                <small>Portfolios in management</small>
              </div>

              <div className="box">
                <h3>Methodology</h3>
                <span>VAR method</span>
              </div>
            </div>
          </div>

          {/* <div className="first-tab">
            <div className="manager-box">
              <div className="cover"></div>
              <div className="info">
                <div className="circle">
                  <img src={manager.img ? api.imgUrl(manager.img) : ''} className="avatar" />
                </div>
                <h2 className="text-center">{manager.name} {manager.surname}</h2>
                <h4 className="text-center">Age {manager.age}</h4>
                <div className="row-padding">
                  <div className="column center">
                    <Link to={"/contact"} onClick={() => this.setPage("contact")}>
                      <button className="back">Contact</button>
                    </Link>
                    <Link to={this.props.user === -1 ? "/register" : "/kyc"} onClick={() => this.apply()}>
                      <button className="continue">Apply now</button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

              <div className="box">
                <h4>Fees</h4>
                {manager.terms}
              </div>

              <div className="box margin-right row">
                <div className="third">
                  <p className="blue">Social networks:</p>
                  <button className="facebook"></button>
                  <button className="twitter"></button>
                  <button className="linkedin"></button>
                </div>
                <div className="two-third">
                  <p className="blue">Biography:</p><p> {manager.biography}</p>
                </div>
              </div>

          </div>
          { company !== undefined ?
            <div className="second-tab">
            <div className="box">
              <div className="circle left">
                <img src={"manager/companies/" + company.img} className="avatar" />
              </div>
              <div className="row">
                <p className="blue">Company</p>
                <h3>{company.name}</h3>
                <div className="row tridot">
                  <a>{company.site}</a>
                </div>
              </div>
              <div className="row">
                <p className="blue">Social networks:</p>
                <button className="facebook"></button>
                <button className="twitter"></button>
                <button className="linkedin"></button>
              </div>
            </div>
            <div className="box">
              <p className="blue">Methodology:</p><p> {manager.methodology}</p>
            </div>
          </div> : ''} */}
        </div>
      </div>
    )
  }
}



export default connect(a => a)(ManagerPage);
