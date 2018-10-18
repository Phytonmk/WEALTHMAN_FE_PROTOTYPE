import React, { Component } from 'react';

import Dropdown from '../../inputs/Dropdown';
import Input from '../../inputs/Input';
import { api } from '../../helpers'

class RiskProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      citizenship: '',
      address: '',
      postalCode: '',
      city: '',
      state: '',
      country: '',
      id: '',
      selfy: ''   
    }
  }
  saveData() {
    api.post('kyc-blank', {
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      citizenship: this.state.citizenship,
      address: this.state.address,
      postalCode: this.state.postalCode,
      city: this.state.city,
      state: this.state.state,
      country: this.state.country,
    })
      .then(() => {this.props.savedToast && this.props.savedToast()})
      .catch(console.log);
  }
  componentDidMount() {
    api.get('kyc-blank')
      .then((res) => {
        const newState = res.data.data
        console.log(res.data)
        newState.id = !res.data.id ? '' : res.data.id.split('/')[res.data.id.split('/').length - 1]
        newState.selfy = !res.data.selfy ? '' : res.data.selfy.split('/')[res.data.selfy.split('/').length - 1]
        console.log(newState)
        this.setState(newState)
        this.props.savedToast && this.props.savedToast()
      })
      .catch(console.log)
  }
  sendPhoto(docType) {
    const photo = this[`${docType}ForUpload`]
    api.upload(`doc/${docType}`, photo)
      .then(() => alert('Photo uploaded'))
      .catch(console.log)
  }
  render() {
    return (
      <div>
        <div className='account-box'>
          <small className='blue'>1. PERSONAL INFORMATION</small>
          <small>FIRST NAME</small>
          <Input
            value={this.state.firstName}
            setValue={value => this.setState({firstName: value})}
            placeholder='Enter your name'
          />
          <small>LAST NAME</small>
          <Input
            value={this.state.lastName}
            setValue={value => this.setState({lastName: value})}
            placeholder='Enter last name'
          />
          <small>Citizenship</small>
          <Dropdown
            value={this.state.citizenship}
            options={['England', 'USA', 'Germany', 'Japan', 'Italy']}
            setValue={(value) => this.setState({citizenship: value})}
            width='320px'
          />
          {/*<button onClick={() => this.saveData()} className='big-blue-button save'>
            Save changes
          </button>*/}
        </div>

        <div className='account-box'>
          <small className='blue'>2. ADDRESS INFORMATION</small>
          <small>STREET ADDRESS</small>
          <Input
            value={this.state.address}
            setValue={value => this.setState({address: value})}
            placeholder='Enter your address'
          />
          <small>POSTAL CODE</small>
          <Input
            value={this.state.postalCode}
            setValue={value => this.setState({postalCode: value})}
          />
          <small>CITY</small>
          <Dropdown
            value={this.state.city}
            options={['England', 'USA', 'Germany', 'Japan', 'Italy']}
            setValue={(value) => this.setState({city: value})}
            width='320px'
          />
          <small>STATE</small>
          <Dropdown
            value={this.state.state}
            options={['England', 'USA', 'Germany', 'Japan', 'Italy']}
            setValue={(value) => this.setState({state: value})}
            width='320px'
          />
          <small>COUNTRY</small>
          <Dropdown
            value={this.state.country}
            options={['England', 'USA', 'Germany', 'Japan', 'Italy']}
            setValue={(value) => this.setState({country: value})}
            width='320px'
          />
          {/*<button onClick={() => this.saveData()} className='big-blue-button save'>
            Save changes
          </button>*/}
        </div>

        <div className='account-box'>
          <small className='blue'>3. ID OR PASSPORT</small>
          <div className='file-upload-container'>
            {this.state.id === '' ? <React.Fragment><h2>Drag & Drop or</h2><h2 className='blue'>Browse</h2></React.Fragment> : <h2>{this.state.id}</h2>}
            <input
              type='file'
              name='file'
              onChange={(event) => {
                this.setState({id: event.target.files[0].name})
                this.idForUpload = event.target.files[0]
              }}/>
          </div>
          <span>
            <div>Please upload a photo or a scan of the following</div>
            <div>We support JPG and PNG files. Make sure that files is no more than 500 kb.</div>
          </span>
          <button className='big-blue-button' onClick={() => this.sendPhoto('id')}>
            Upload document
          </button>
        </div>

        <div className='account-box'>
          <small className='blue'>4. SELFIE HOLDING ID OR PASSPORT</small>
          <div className='file-upload-container'>
            {this.state.selfy === '' ? <React.Fragment><h2>Drag & Drop or</h2><h2 className='blue'>Browse</h2></React.Fragment> : <h2>{this.state.selfy}</h2>}
            <input
              type='file'
              name='file'
              onChange={(event) => {
                this.setState({selfy: event.target.files[0].name})
                this.selfyForUpload = event.target.files[0]
              }}/>
          </div>
          <span>
            <div>Please upload a photo or a scan of the following</div>
            <div>We support JPG and PNG files. Make sure that files is no more than 500 kb.</div>
          </span>
          <button className='big-blue-button' onClick={() => this.sendPhoto('selfy')}>
            Upload document
          </button>
        </div>
        <div className='account-box'>
          <small className='blue'>I hereby certify that the information above is true and accurate.</small>
           <button onClick={() => this.saveData()} className='big-blue-button save'>
            Save & submit data
          </button>
        </div>

      </div>
    );
  }
}

export default RiskProfile;
