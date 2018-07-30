import React, { Component } from 'react';

import Dropdown from '../../Dropdown.jsx';
import { api } from '../../helpers'

class RiskProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: "",
      lastName: "",
      nationality: '',

      address: "",
      postalCode: "",
      city: "",
      state: "",
      country: "",
    }
  }
  saveData() {
    api.post('personal-data/save', this.state)
      .then(() => {alert('Saved')})
      .catch(console.log);
  }
  componentDidMount() {
    api.post('personal-data/load')
      .then((res) => {
        const data = res.data.personalData
        delete data._id
        delete data._v
        console.log(data)
        this.setState(data)
      })
      .catch(console.log)
  }
  render() {
    return (
      <div>
        <div className="account-box">
          <small className="blue">1. PERSONAL INFORMATION</small>
          <small>FIRST NAME</small>
          <input
            value={this.state.firstName}
            onChange={event => this.setState({firstName: event.target.value})}
            placeholder="Enter your name"
          />
          <small>LAST NAME</small>
          <input
            value={this.state.lastName}
            onChange={event => this.setState({lastName: event.target.value})}
            placeholder="Enter last name"
          />
          <small>NATIONALITY</small>
          <Dropdown
            value={this.state.nationality}
            options={["England", "USA", "Germany", "Japan", "Italy"]}
            setValue={(value) => this.setState({nationality: value})}
            width="320px"
          />
          <button onClick={() => this.saveData()} className="big-blue-button save">
            Save changes
          </button>
        </div>

        <div className="account-box">
          <small className="blue">2. ADDRESS INFORMATION</small>
          <small>STREET ADDRESS</small>
          <input
            value={this.state.address}
            onChange={event => this.setState({address: event.target.value})}
            placeholder="Enter your address"
          />
          <small>POSTAL CODE</small>
          <input
            value={this.state.postalCode}
            onChange={event => this.setState({postalCode: event.target.value})}
          />
          <small>CITY</small>
          <Dropdown
            value={this.state.city}
            options={["England", "USA", "Germany", "Japan", "Italy"]}
            setValue={(value) => this.setState({city: value})}
            width="320px"
          />
          <small>STATE</small>
          <Dropdown
            value={this.state.state}
            options={["England", "USA", "Germany", "Japan", "Italy"]}
            setValue={(value) => this.setState({state: value})}
            width="320px"
          />
          <small>COUNTRY</small>
          <Dropdown
            value={this.state.country}
            options={["England", "USA", "Germany", "Japan", "Italy"]}
            setValue={(value) => this.setState({country: value})}
            width="320px"
          />
          <button onClick={() => this.saveData()} className="big-blue-button save">
            Save changes
          </button>
        </div>

        <div className="account-box">
          <small className="blue">3. ID OR PASSWORD</small>
          <h2>Drag & Drop or</h2><h2 className="blue">Browse</h2>
          <span>
            <div>Please upload a photo or a scan of the following</div>
            <div>We support JPG and PNG files. Make sure that files is no more than 500 kb.</div>
          </span>
          <button className="big-blue-button">
            Upload document
          </button>
        </div>

        <div className="account-box">
          <small className="blue">4. SELFIE HOLDING ID OR PASSWORD</small>
          <h2>Drag & Drop or</h2><h2 className="blue">Browse</h2>
          <span>
            <div>Please upload a photo or a scan of the following</div>
            <div>We support JPG and PNG files. Make sure that files is no more than 500 kb.</div>
          </span>
          <button className="big-blue-button">
            Upload document
          </button>
        </div>
      </div>
    );
  }
}

export default RiskProfile;
