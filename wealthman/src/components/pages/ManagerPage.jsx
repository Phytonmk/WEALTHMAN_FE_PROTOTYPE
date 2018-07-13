import React, { Component } from 'react';
import { setReduxState } from '../../redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
// import Sortable from '../Sortable.jsx';
import { api, setPage, setCurrency } from '../helpers';

class ManagerPage extends Component {
  constructor(props) {
    super(props);
  }
  componentWillMount() {
    api.get('manager/' + this.props.match.params.id)
      .then((res) => {
        console.log('res.data');
        setReduxState({managers: [res.data]});
      })
      .catch(console.log);
  }
  apply() {
    const algorythm = this.props.algorythms.find(algorythm => algorythm.creator === this.props.match.params.id);
    setReduxState({
      currentManager: this.props.match.params.id,
      currentAlgorythm: algorythm ? algorythm.id : -1
    });
    console.log(`currentAlgorythm set as ${this.props.currentAlgorythm}`);
  }
  render() {
    var manager = this.props.managers.find(manager => manager.id == this.props.match.params.id);
    console.log(this.props.managers);
    if (manager === undefined)
      return <div></div>
    var company = this.props.companies.find(company => company.id == manager.company);

    var companies;
    var algs = this.props.algorythms.filter(alg => {
      return alg.creator == manager.id;
    });
    // }).map(alg =>
    //   <div className="manager-listing" onClick={() => this.setPage("algorythm", alg.id)}>
    //     <h4>{alg.name}</h4>
    //     <p className="grey">rating {alg.rating}/10</p>
    //   </div>
    // );


    return (
      <div>
        <div className="new-long-header" />
        <div className="manager-container">
          <div className="top-row">
            <img src={"/manager/" + manager.img} className="avatar"/>

            <div className="main-info">
              <div className="name-row">
                <h1>{manager.name} {manager.surname}</h1>
                <h3>Age {manager.age}</h3>
              </div>
              <div className="fees-row">
                <h3>Fees</h3>
                <h3>1,5% of AUM, monthly paid</h3>
              </div>
            </div>

            <div className="column right">
              <div className="row">
                <Link to={"/contact"} onClick={() => this.setPage("contact")}>
                  <button className="big-transparent-button right">CONTACT</button>
                </Link>
                <Link to={this.props.user === -1 ? "/register" : "/kyc"} onClick={() => this.apply()}>
                  <button className="big-blue-button right">Apply now</button>
                </Link>
              </div>
              <div className="social">
                <span>Social networks</span>
                <div className="row">
                  <a href="https://t.me/wealthman_global" target="_blank">
                    <img src="telegram.svg" className="social-icon" />
                  </a>
                  <a href="https://www.facebook.com/WealthMan.io/" target="_blank">
                    <img src="facebook.svg" className="social-icon" />
                  </a>
                  <a href="https://www.instagram.com/wealthman.io/" target="_blank">
                    <img src="instagram.svg" className="social-icon" />
                  </a>
                  <a href="https://bitcointalk.org/index.php?topic=2006205" target="_blank">
                    <img src="linkedin.svg" className="social-icon" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="main-column">
            <div className="box">
              <h2>Biography</h2>
              <h3>KEF HOLDINGS, Business Analyst. DIFC, Dubai, UAE.</h3>
              <h3>September 2016 – August 2017</h3>
              <ul>
                <li>Engaged in financial modeling, transaction due diligence, and investment portfolio performance tracking</li>
                <li>Conducted detailed due diligence on the country, market, competitive environment and financial issues</li>
                <li>Conducted regular financial research to stay apprised about global economy and global financial markets</li>
                <li>Represented the firm's commercial interests while leading sales, tender contract negotiations, and business development</li>
                <li>Worked on projects covering strategy formulation, new project investments, and growth opportunities for KEF Infra GO GOODSCOUT, Executive Insurance Broker. New York, NY, USA</li>
              </ul>
              <h3>April 2015 – November 2015</h3>
              <ul>
                <li>Managed all aspects of business development from initial strategic and fiscal planning to final testing and delivery</li>
                <li>Established strategic business partnerships with over 40 global program senior officials at universities in NYC</li>
                <li>Obtained NY Life & Health and Property & Casualty insurance producer licenses INFLOT WORLDWIDE, Supervising Port Agent. St. Petersburg, Russia</li>
              </ul>
              <h3>May 2009 – July 2009</h3>
              <ul>
                <li>Coordinated over 100 clearance procedures for international passenger cruise ships calling to the port of SPb</li>
                <li>Liaised with port authorities, procured supplies, and arranged customs, immigration and quarantine clearance procedures</li>
                <li>Organized documentation filing including submission of crew lists, cargo manifest and trading certificates</li>
                <li>Arranged vessel mooring and handling, as well as husbandry services for various types of vessels E</li>
              </ul>
            </div>

          </div>
          <div className="second-column">
            <div className="box">
              <div className="company-info">
                <Link to={"/company/0"}>
                  <div className="company-icon" />
                </Link>
                <div className="column left">
                  <h3>Company</h3>
                  <h1>Moroz&Co</h1>
                </div>
              </div>
              <div className="webpage">
                <div className="row">
                  <span>Webpage:</span>
                </div>
                <a href="https://en.wikipedia.org/wiki/Ponzi_scheme" target="_blank">https://en.wikipedia.org/wiki/Ponzi_scheme</a>
              </div>
              <div className="networks">
                <div className="row">
                  <span>Social networks:</span>
                </div>
                <div className="row">
                  <a href="http://www.facebook.com/ponzi" target="_blank">http://www.facebook.com/ponzi</a>
                </div>
                <div className="row">
                  <a href="http://www.twitter.com/ponzi" target="_blank">http://www.twitter.com/ponzi</a>
                </div>
                <div className="row">
                  <a href="http://www.linkedin.com/in/ponzi" target="_blank">http://www.linkedin.com/in/ponzi</a>
                </div>
              </div>
            </div>

            <div className="box">
              <h3>Statistics</h3>
              <h1 className="green">3361.60%</h1>
              <small>Profitability (all time)</small>
              <h1>77</h1>
              <small>Quantity clients</small>
              <h1>59</h1>
              <small>Cases in management</small>
            </div>

            <div className="box">
              <h3>Methodology</h3>
              <span>VAR method</span>
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
