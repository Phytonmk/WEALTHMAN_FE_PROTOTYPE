import React, { Component } from 'react';

import { api } from '../../helpers';

import MyDate from '../../myDate';

export default class Message extends Component {
  render() {
    let msg = '';
    switch(this.props.from) {
      case 'system':
        msg =
          <a href={this.props.link} target="_blank" className="chats-message system-message">
              {this.props.text}
          </a>
      break;
      case 'companion':
        msg =
          <div className="chats-message user-message">
            <div className="chat-pic chats-message-pic-column">
              {this.props.noPicDisplay ? '' : <img src={api.imgUrl(this.props.pic)} />}
            </div>
            <div className="chats-message-wrapper">
              <div className="chats-message-text">
                {this.props.text}
              </div>
              {this.props.noDataDisplay ? '' : <div title={new MyDate(this.props.date).dateTime()} className="chats-message-date">
                {new MyDate(this.props.date).niceTime()} {this.props.specialStatus}
              </div>}
            </div>
          </div>
      break;
      case 'you':
        msg =
          <div className="chats-message user-message chats-message-from-you">
            <div className="chats-message-wrapper">
              <div className="chats-message-text">
                {this.props.text}
              </div>
              {this.props.noDataDisplay ? '' : <div title={new MyDate(this.props.date).dateTime()} className="chats-message-date">
                {new MyDate(this.props.date).niceTime()} {this.props.specialStatus}
              </div>}
            </div>
            <div className="chat-pic chats-message-pic-column">
              {this.props.noPicDisplay ? '' : <img src={api.imgUrl(this.props.pic)} />}
            </div>
          </div>
      break;
    }
    return  <div className="chats-message-container" key={this.props.keyValue}>{msg}</div>
  }
}