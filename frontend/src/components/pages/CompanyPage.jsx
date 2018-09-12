import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { LineChart } from 'react-easy-chart';
import { api, setCookie, getCookie } from '../helpers';
import Social from './../Social';
import Seemore from '../Seemore';
import Avatar from '../Avatar';
import Qsign from '../Qsign';
import Breadcrumbs from '../Breadcrumbs';

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

class CompanyPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profitability: '-',
      clients: '-',
      portfolios: '-',
      company: null,
      companyManagers: [],
    }
    this.lastManagerUrl = this.state.managerType + '/' + this.props.match.params.id
  }
  load() {
    api.get('company/' + this.props.match.params.id)
      .then((res) => {
        if (this.props.userData.user === res.data.user)
          setPage('account')
        this.setState({company: res.data});
      })
      .catch(console.log);
    api.get('company-statistics/' + this.props.match.params.id)
      .then((res) => {
        this.setState({
          profitability: res.data.profitability,
          clients: res.data.clients,
          portfolios: res.data.portfolios,
          companyManagers: res.data.managers
        });
      })
      .catch(console.log);
  }
  componentWillMount() {
    this.load()
  }
  apply(filter) {
    const managerType = (this.props.match.path.includes('company') ? 'company' : 'manager')
    setCookie('service', filters[filter].link);
    // setCookie('selectedManager', managerType + '/' + this.props.match.params.id);
    if (getCookie('usertype') === '0') {
      this.props.history.push({
        pathname: 'kyc-questions',
        search: '?manager=' + managerType + '/' + this.props.match.params.id
      })
      // setPage("kyc/" + managerType + '/' + this.props.match.params.id);
    } else {
      window.openSignUp(() => {
        this.props.history.push({
          pathname: 'kyc-questions',
          search: '?manager=' + managerType + '/' + this.props.match.params.id
        })
        // setPage("kyc/" + managerType + '/' + this.props.match.params.id);
      })
    }
    // setPage(this.props.user === -1 ? "reg-or-login/" : "kyc/" + managerType + '/' + this.props.match.params.id);
  }
  render() {
    if ('company/' + this.props.match.params.id !== this.lastManagerUrl) {
      this.lastManagerUrl = 'company/' + this.props.match.params.id
      this.load()
    }
    var company = this.state.company;
    if (company === null)
      return <div>incorrect URL</div>

    return (
      <div id="company-page">
        <div className="new-long-header" />
        <div className="container">
          <Breadcrumbs links={[
            {
              link: "/",
              label: "Marketplace"
            },
            {
              link: "#",
              label: company.company_name
            },
          ]} />
          <div className="heading">
            <div className="column margin30">
              <Avatar src={company.img ? api.imgUrl(company.img) : ""} size="96px" />
            </div>
            <div className="column">
              <div className="company-name row">
                <h1 className="white">{company.company_name}</h1>
                <h3 className="light-grey">Company</h3>
              </div>
              <div className="row">
                {[
                  {
                    label: "Location",
                    data: "United Kingdom, London",
                  },
                  {
                    label: "Total",
                    data: "822 investor",
                  },
                  {
                    label: "Total",
                    data: "820 000$ in AUM",
                  },
                ].map(column =>
                  <div className="column margin60">
                    <h3 className="light-grey">{column.label}</h3>
                    <h3 className="white">{column.data}</h3>
                  </div>
                )}
              </div>
            </div>
            <div className="column right">
              <Link to={"/chat/" + company.user}>
                <button className="big-transparent-button">CONTACT</button>
              </Link>
            </div>
          </div>

          <div className="row">
            <div className="main-column">
              {
                (company.services || []).map(service =>
                  <Seemore>
                    <div className="row">
                      <h2 className="left">{filters[service.type].link} investment management</h2>
                      <Link to="/faq"><Qsign /></Link>
                    </div>
                    <div className="row numbers">
                      {[
                        {number: "99%", desc: "Success score"},
                        {number: service.min + "$", desc: "Account minimum"},
                        {number: service.perfomance_fee + "%", desc: "Fees of AUM"},
                        {number: 1592, desc: "Title"},
                      ].map((info, index) => 
                        <div className="column left margin-right">
                          <div className="row">
                            <h1 className="blue left">{info.number}</h1>
                            {index == 0 && <Link to="/faq"><Qsign className="semitransparent" /></Link>}
                          </div>
                          <small>{info.desc}</small>
                        </div>
                      )}
                      {
                        (getCookie('usertype') != '1' && getCookie('usertype') != '3') &&
                        <button
                          onClick={() => this.apply(i)}
                          className="big-blue-button right"
                        >
                          Invest
                        </button>
                      }
                    </div>
                    <h3>Methodology</h3>
                    {/* <p>{service.methodology}</p> */}
                    <span className="grey">
                      We develop recommendations for you portfolio using a varienty of HSBC
                      and third-party investment vehicles and investment managers, tailoring
                      each choice to your needs.<br />
                      If you have a discretionary portfolio we will review it and may make
                      adjustments based on your objectives and our market outlook. We
                      continually review the investments and managers we use to ensure they
                      suited to your portfolio.
                    </span>
                    <h3>Investment philosophy</h3>
                    {/* <p>{service.philosofy}</p> */}
                    <span className="grey">
                      Ever-changing global economic and market conditions can provide
                      investment opportunities all over the world. Backed by the global reach
                      of HSBC, we can deliver these opportunities to you.
                    </span>
                    <h3>AUM dynamics</h3>
                    <LineChart
                      xTicks={Math.round(370 / 60)}
                      xType={'time'}
                      axes
                      margin={{top: 20, right: 20, bottom: 45, left: 40}}
                      grid
                      verticalGrid
                      interpolate={'basis'}
                      width={370}
                      height={300}
                      data={[]}
                    />
                  </Seemore>
                )
              }
            </div>
            <div className="second-column right">

              <div className="box">
                <h2>Team</h2>
              </div>

              <div className="box">
                <h2>Company details</h2>
                <div className="webpage info-row">
                  <span>Website</span>
                  <a href="https://www.griffoncapital.com" target="_blank">https://www.griffoncapital.com</a>
                </div>
                <div className="headquaters info-row">
                  <span>Headquaters</span>
                  <span className="black">Tehran, Tehran</span>
                </div>
                {[
                  {
                    label: "Year founded",
                    data: "2014",
                  },
                  {
                    label: "Company type",
                    data: "Partnership",
                  },
                  {
                    label: "Company size",
                    data: "11-50 employees",
                  },
                  {
                    label: "Specialties",
                    data: "Iran Asset Management, Iran Corporate Private Equity, Iran Venture Frontier Finance, Iran Investment Banking, Iran Markets, Iran Equity Fund. Tehran Stock Exch metual fund, Iran Capital Markets, Iran Fixed Income, Iran Investment Fund and Iran Portfolio Management",
                  },
                ].map(row => 
                  <div className="info-row">
                    <span>{row.label}</span>
                    <span className="black">{row.data}</span>
                  </div>
                )}
              </div>

              <div className="box">
                <h2>Social networks</h2>
                <Social hoverable={false} links={["https://t.me", "https://facebook.com", "https://linkedin.com"]} />
              </div>

            </div>
          </div>
        </div>
      </div>
    )
  }
}



export default withRouter(connect(a => a)(CompanyPage));
