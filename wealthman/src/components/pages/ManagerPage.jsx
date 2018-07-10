import React, { Component } from 'react';
import { setReduxState } from '../../redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Sortable from '../Sortable.jsx';
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
        {/* {this.renderBackButton()} */}
        <div className="container">
          <div className="first-tab">
            <div className="manager-box">
              <div className="cover"></div>
              <div className="info">
                <div className="circle">
                  <img src={"manager/" + manager.img} className="avatar" />
                </div>
                <h2 className="text-center">{manager.name} {manager.surname}</h2>
                <h4 className="text-center">Age {manager.age}</h4>
                <div className="row-padding">
                  <div className="column center">
                    {/* {this.props.user !== -1 ? (<button className="back">Contact</button>) : ""} */}
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
                {/* <p>Manager will ask you to agree with</p>
                <ul>
                  <li>Condition 1</li>
                  <li>Condition 2</li>
                  <li>Condition 3</li>
                  <li>Condition 4</li>
                </ul>
                <p>and also</p>
                <ul>
                  <li>Condition 1</li>
                  <li>Condition 2</li>
                  <li>Condition 3</li>
                  <li>Condition 4</li>
                </ul> */}
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
              {/* <div className="half-box">
                <div className="circle left">
                  <img src={"companies/" + company.img} className="avatar" />
                </div>
                <div className="half">
                  <p className="blue">Company</p>
                  <h3>{company.name}</h3>
                  <a>{company.site}</a>
                </div>
                <div className="row">
                  <p className="blue">Social networks:</p>
                  <button className="facebook"></button>
                  <button className="twitter"></button>
                  <button className="linkedin"></button>
                </div>
              </div>            */}

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
          </div> : ''}
        </div>
      </div>
    )
  }
}



export default connect(a => a)(ManagerPage);