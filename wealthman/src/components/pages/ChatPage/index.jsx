import React, { Component } from 'react';
// import { setReduxState } from '../../redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { getCookie, setCookie, newLines, setPage } from '../../helpers';

import api from './chatsRestApi'

class ChatPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchQuery: '',
      chats: [{
        sender_name: 'Louisa Cruz',
        date: Date.now(),
        text_preview: 'Do you have any time to...'
      },
      {
        sender_name: 'Administrator',
        date: Date.now(),
        text_preview: 'Do you have any time to...'
      },
      {
        sender_name: 'Louisa Cruz',
        date: Date.now(),
        text_preview: 'Do you have any time to...'
      }]
    }
  }
  render() {
    return (
      <div>
        <div className="container chats-container">
          <div className="chats-left-column">
            <div className="chats-search">
              <input value={this.state.searchQuery} placeholder="Search" onChange={(event) => this.setState({searchQuery: event.target.value})}/>
            </div>
            <div className="chats-list">

            </div>
          </div>
          <div className="chats-right-column">
          </div>
        </div>
      </div>
    );
  }
}

export default ChatPage;