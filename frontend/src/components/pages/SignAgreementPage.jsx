import React, { Component } from 'react';
import { setReduxState } from '../../redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import ProgressBar from '../ProgressBar'

import { api, getCookie, setCookie, newLines, setPage, previousPage } from '../helpers';

class SignAgreementPage extends Component {
  constructor(props) {
    super(props);
  
    this.state = {
      uploadName: '',
      uploaded: false,
      error: false
    };
  }
  componentDidMount() {
    api.post('get-request/' + this.props.match.params.id)
      .then((res) => {
        console.log(res.data)
        if (res.data.request.investor_agreement) {
          this.setState({
            uploaded: true,
            uploadName: res.data.request.investor_agreement
          })
        }
      })  
      .catch(console.log)
  }
  render() {
    return (
      <div>
        <div className="container">
          <div className="box">
            <div className="row-padding">
              <h2>Sign Agreement</h2>
              <p>Please download and fill this form. Then scan and upload it back to the site.</p>
            </div>
            <div className="row-padding document-box-container">
              <div className="document-box">
                <h3 className="text-center">Agreement form</h3>
                <div className="row">
                  <a href="/agreement.pdf" target="_blank">
                    <button className="continue">DOWNLOAD FILE</button>
                  </a>
                </div>
              </div>
              <div className="document-box">
                <h3 className="text-center">Filled Agreement form</h3>
                <div className="row">
                  <div className='file-upload-container' style={this.state.uploaded ? { borderStyle: 'solid' } : (this.state.error ? {borderColor: 'red', backgroundColor: 'rgba(255, 0, 0, .1)'} : {})}>
                    <h2>Drag & Drop or</h2><h2 className='blue'>{this.state.uploadName || 'Browse'}</h2>
                    <input
                      type='file'
                      name='file'
                      onChange={(event) => {
                        this.setState({ uploadName: event.target.files[0].name })
                        api.upload('agreement', event.target.files[0], { request: this.props.match.params.id })
                          .then(() => this.setState({ uploaded: true }))
                          .catch((e) => {
                            console.log(e)
                            this.setState({ error: true })
                          })
                      }} />
                  </div>
                </div>
              </div>
            </div>
            <div className="row-padding">
              <button className="back" onClick={() => previousPage()}>Back</button>
              <Link to={"/money/" + this.props.match.params.id} style={this.state.uploaded ? { transition: '.3s all', opacity: 1, pointerEvents: 'all' } : { transition: '.3s all', opacity: .6, pointerEvents: 'none' }}>
                <button className="continue">Continue</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(a => a)(SignAgreementPage)