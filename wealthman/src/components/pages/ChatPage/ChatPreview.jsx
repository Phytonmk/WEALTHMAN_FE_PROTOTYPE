import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { api } from '../../helpers';

import MyDate from '../../myDate';

export default class ChatPreview extends Component {
  render() {
    return  <Link key={this.props.keyValue} to={"/chat/" + this.props.companionId} style={this.props.display ? {display: 'block'} : {display: 'none'}}>
              <div className={this.props.currentChat ? 'chat-preview current-chat-preview' : 'chat-preview'}>
                <div className="chat-pic">
                  <img src={api.imgUrl(this.props.companionPic)} />
                </div>
                {this.props.unread > 0 ? <div className="chat-preview chat-unreads">{this.props.unread <= 99 ? this.props.unread : '99'}</div> : ''}
                <div className="chat-preview-data">
                  <div className="chat-preview-row">
                    <div className="chat-preview-username">
                      {this.props.companionName}
                    </div>
                    <div className="chat-preview-date">
                      {new MyDate(this.props.date).niceTime()}
                    </div>
                  </div>
                  <div className="chat-preview-row chat-preview-text">
                    {this.props.lastMessageFromYou ? <b>You:</b> : ''}{this.props.lastMessage}
                  </div>
                </div>
              </div>
            </Link>
  }
}