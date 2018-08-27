import React, { Component } from 'react';

import Dropdown from '../../Dropdown';
import Input from '../../Input';
import { api } from '../../helpers'

class RiskProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: "",
      lastName: "",
      citizenship: '',

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
          <Input
            value={this.state.firstName}
            setValue={value => this.setState({firstName: value})}
            placeholder="Enter your name"
          />
          <small>LAST NAME</small>
          <Input
            value={this.state.lastName}
            setValue={value => this.setState({lastName: value})}
            placeholder="Enter last name"
          />
          <small>Citizenship</small>
          <Dropdown
            value={this.state.citizenship}
            options={["England", "USA", "Germany", "Japan", "Italy"]}
            setValue={(value) => this.setState({citizenship: value})}
            width="320px"
          />
          {/*<button onClick={() => this.saveData()} className="big-blue-button save">
            Save changes
          </button>*/}
        </div>

        <div className="account-box">
          <small className="blue">2. ADDRESS INFORMATION</small>
          <small>STREET ADDRESS</small>
          <Input
            value={this.state.address}
            setValue={value => this.setState({address: value})}
            placeholder="Enter your address"
          />
          <small>POSTAL CODE</small>
          <Input
            value={this.state.postalCode}
            setValue={value => this.setState({postalCode: value})}
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
          {/*<button onClick={() => this.saveData()} className="big-blue-button save">
            Save changes
          </button>*/}
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
        <div className="account-box">
          <small className="blue">I hereby certify that the information above is true and accurate.</small>
           <button onClick={() => this.saveData()} className="big-blue-button save">
            Save & submit data
          </button>
        </div>

      </div>
    );
  }
}

export default RiskProfile;
