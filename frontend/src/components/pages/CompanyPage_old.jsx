import React, { Component } from 'react';
import { setReduxState } from '../../redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { api, setPage, setCurrency } from '../helpers';
import Seemore from '../Seemore'

class CompanyPage extends Component {
  constructor(props) {
    super(props);
  }
  // componentWillMount() {
  //   api.get('manager/' + this.props.match.params.id)
  //     .then((res) => {
  //       console.log('res.data');
  //       setReduxState({managers: [res.data]});
  //     })
  //     .catch(console.log);
  // }
  // apply() {
  //   const algorythm = this.props.algorythms.find(algorythm => algorythm.creator === this.props.match.params.id);
  //   setReduxState({
  //     currentManager: this.props.match.params.id,
  //     currentAlgorythm: algorythm ? algorythm.id : -1
  //   });
  //   console.log(`currentAlgorythm set as ${this.props.currentAlgorythm}`);
  // }
  render() {
    // var company = this.props.companies.find(company => company.id == this.props.match.params.id);
    // if (company === undefined)
    //   return <div></div>

    return (
      <div id="company-page">
        <div className="new-long-header" />
        <div className="manager-container">
          <div className="top-row">
            {/* <img src={"/manager/companies/" + company.img} className="avatar"/> */}
            {/* <img src={"/manager/companies/" + "bitconnect.jpg"} className="avatar"/> */}
            <Avatar src={"/manager/companies/" + "bitconnect.jpg"} size="96px" />
            <div className="main-info">
              <div className="name-row">
                {/* <h1>{company.name}</h1> */}
                <h1>Moroz&Co</h1>
                <h3>Company</h3>
              </div>
              <div className="fees-row">
                <h3>Location</h3>
                <h3>United Kingdom, London</h3>
              </div>
            </div>

            <div className="column right">
              <div className="row">
                <Link to={"/contact"} onClick={() => this.setPage("contact")}>
                  <button className="big-transparent-button right">CONTACT</button>
                </Link>
              </div>
            </div>
          </div>

          <div className="main-column">
            <Seemore>
              <h2>Advisory investment management</h2>
              <div className="row">
                {/* <Link to={this.props.user === -1 ? "/register" : "/kyc"}}> */}
                  <button className="big-blue-button right">Invest</button>
                {/* </Link> */}
              </div>
              <h3>Methodology</h3>
              <span>We develop recommendations for you portfolio using a varienty of HSBC and third-party investment vehicles and investment managers, tailoring each choice to your needs.</span>
            </Seemore>

            <div className="box">
              <h2>Discretionary investment management</h2>
              <h3>Methodology</h3>
              <span>We develop recommendations for you portfolio using a varienty of HSBC and third-party investment vehicles and investment managers, tailoring each choice to your needs. If you have a discretionary portfolio we will review it and may make adjustments based on your objectives and our market outlook. We continually review the investments and managers we use to ensure they suited to your portfolio.</span>
              <h3>Investment philosophy</h3>
              <span>Ever-changing global economic and market conditions can provide investment opportunities all over the world. Backed by the global reach of HSBC, we can deliver these opportunities to you.</span>
            </div>
          </div>

          <div className="second-column">
            <div className="box">
              <div className="webpage">
                <div className="row">
                  <span>Webpage:</span>
                </div>
                <a href="https://www.griffoncapital.com" target="_blank">https://en.wikipedia.org/wiki/Ponzi_scheme</a>
              </div>

            </div>

            <div className="box">
              <h3>Team</h3>
              <div className="company-info">
                <Link to={"/manager/5"}>
                  <div className="company-icon" />
                </Link>
                <div className="column left">
                  <h1>Andrey Morozov</h1>
                  <h3>CEO</h3>
                </div>
              </div>
              <div className="company-info">
                <Link to={"/manager/5"}>
                  <div className="company-icon" />
                </Link>
                <div className="column left">
                  <h1>Andrey Morozov</h1>
                  <h3>CFA</h3>
                </div>
              </div>
            </div>

            <div className="box">
              <h3>Social networks</h3>
              <div className="social">
                <a href="https://t.me/wealthman_global" target="_blank">
                  <img src="telegram-color.svg" className="social-icon" />
                </a>
                <a href="https://www.facebook.com/WealthMan.io/" target="_blank">
                  <img src="facebook-color.svg" className="social-icon" />
                </a>
                <a href="https://bitcointalk.org/index.php?topic=2006205" target="_blank">
                  <img src="linkedin-color.svg" className="social-icon" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}



export default connect(a => a)(CompanyPage);
