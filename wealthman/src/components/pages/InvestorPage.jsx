import React, { Component } from 'react';
import { setReduxState } from '../../redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
// import Sortable from '../Sortable.jsx';
import { api, setPage, setCurrency, setCookie } from '../helpers';
import Social from './../Social';
import Avatar from '../Avatar.jsx';

class InvestorPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      investor: null,
    }
  }
  load() {
    api.get('investor/' + this.props.match.params.id)
      .then((res) => {
        this.setState({investor: res.data});
      })
      .catch(console.log);
  }
  componentWillMount() {
    this.load()
  }
  render() {
    var investor = this.state.investor;
    if (investor === null)
      return <div>...</div>

    let offerBtn = '';

    if (this.props.user === 1)
      offerBtn = <Link to={"/special-offer/" + investor._id}>
                    <button className="big-blue-button right">Special offer</button>
                  </Link>
    return (
      <div id="manager-page">
        <div className="new-long-header" />
        <div className="container">
          <div className="top-row">
            <Avatar src={investor.img ? api.imgUrl(investor.img) : ""} size="96px" />
            <div className="main-info">
              <div className="name-row">
                <small>Investor</small>
                <h1>{(investor.name || '') + ' ' + (investor.surname || '')}</h1>
                <h3>{investor.age ? `Age ${investor.age}` : 'Age not specified'}</h3>
              </div>
              
            </div>

            <div className="column right">
              <div className="row">
                <Link to={"/chat/" + investor.user} onClick={() => this.setPage("chat")}>
                  <button className="big-transparent-button right">CONTACT</button>
                </Link>
                {offerBtn}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}



export default connect(a => a)(InvestorPage);
