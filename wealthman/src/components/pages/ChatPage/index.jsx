import React, { Component } from 'react';
// import { setReduxState } from '../../redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { api as helpersApi, getCookie, setCookie, newLines, setPage } from '../../helpers';

import { browserHistory } from 'react-router';

import { default as chatsApi } from './chatsApi'
import ChatPreview from './ChatPreview';
import Message from './Message';
import Avatar from '../../Avatar'

let lastSelectedChat = undefined;
class ChatPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchQuery: '',
      chats: [],
      messages: [],
      currentChat: {},
      typingMsg: '',
    }
  }
  updateStateWithNewMessage(message) {
    const messages = [...this.state.messages];
    if (!message.companionId || message.companionId == this.state.currentChat.companionId)
      messages.push(message);
    const chats = [...this.state.chats];
    const chatOfMsg = chats.find(chat => chat.companionId === this.state.currentChat.companionId);
    if (chatOfMsg === undefined) {
      chats.unshift({
        unread: message.from === 'you' ? 0 : 1,
        companionId: this.state.currentChat.companionId,
        companionName: this.state.currentChat.companionName,
        companionPic: this.state.currentChat.companionPic,
        lastMessageFromYou: message.from === 'you',
        date: Date.now(),
        lastMessage: message.text.substr(0, 100)
      });
    } else {
      chatOfMsg.unread = message.from === 'you' ? 0 : (chatOfMsg.unread + 1),
      chatOfMsg.date = Date.now()
      chatOfMsg.lastMessage = message.text.substr(0, 100)
      chatOfMsg.lastMessageFromYou = message.from === 'you'
    }
    this.setState({chats, messages, typingMsg: ''});
    this.scrollDown();
  }
  scrollDown() {
    setTimeout(() => {
      const msgArea = document.querySelector('#chats-messages-area');
      if (msgArea !== null)
        msgArea.scrollTop = msgArea.scrollHeight;
    }, 0)
  }
  loadMessages(chat, offset) {
    if (/[0-9]+/.test(chat))
      chatsApi.getMessages(chat, offset)
        .then((res) => {
          const chats = [...this.state.chats];
          const thisChat = chats.find(chat => chat.companionId === res.data.chat.userId);
          if (thisChat !== undefined)
            thisChat.unread = 0;
          this.setState({
            chats,
            currentChat: {
              companionId: res.data.chat.userId,
              companionPic: res.data.chat.img,
              companionName: res.data.chat.name,
            },
            messages: this.props.userData.user !== undefined ? res.data.messages.map(message => {
              let from;
              if (message.from === res.data.chat.userId)
                from = 'companion';
              else if (message.from === this.props.userData.user)
                from = 'you';
              else
                from = 'system';
              return {
                from, 
                text: message.text,
                date: message.date,
                link: message.link
              }
            }) : []
          });
          this.scrollDown();
        })
        .catch(console.log);
  }
  loadChats() {
    this.loadMessages(this.props.match.params.chat);
    chatsApi.chatsList()
      .then(res => {
        console.log(res.data);
        this.setState({chats: res.data.map(chat => {
          const companionPostion = chat.users[0] !== this.props.userData.user ? 0 : 1
          return {
            companionId: chat.users[companionPostion],
            companionName: chat.last_message.names[companionPostion],
            companionPic: chat.last_message.pics[companionPostion],
            date: chat.last_message.date,
            lastMessage: chat.last_message.text_preview,
            lastMessageFromYou: chat.last_message.sender_id === chat.users[1 - companionPostion],
            unread: chat.unread || 0
          }
        })})
      })
      .catch(console.log)
  }
  authEventListener() {
    this.loadChats();
  }
  componentDidMount() {
    if (this.props.userData.user === undefined) {
      window.addEventListener('auth completed', this.authEventListener.bind(this));
    } else {
      this.loadChats();
    }
    chatsApi.connect()
      .then((socket) => {
        socket.on('message', msg => {
          if (msg.newMessage) {
            this.updateStateWithNewMessage(msg);
          }
        });
        // chatsApi.sendMessage(0, 'Hello world')
      })
      .catch(console.log)
  }
  componentWillUnmount() {
    window.removeEventListener('auth completed', this.authEventListener);
  }
  checkIfEnter(event) {
    if (event.keyCode === 13)
      this.sendMessage();
  }
  sendMessage() {
    let msgText = this.state.typingMsg;
    let toId = this.props.match.params.chat;
    let toName = this.state.currentChat.name;
    let toPic = this.state.currentChat.pic;
    chatsApi.sendMessage(toId, msgText)
    this.updateStateWithNewMessage({
      from: 'you',
      text: msgText,
      date: Date.now()
    });
  }
  render() {
    if (lastSelectedChat != this.props.match.params.chat) {
      lastSelectedChat = this.props.match.params.chat;
      this.loadMessages(this.props.match.params.chat);
    }
    return (
      <div>
        <div className="container chats-container">
          <div className="chats-left-column">
            <div className="chats-search">
              <input type="text" value={this.state.searchQuery} placeholder="Search" onChange={(event) => this.setState({searchQuery: event.target.value})}/>
            </div>
            <div className="chats-list">
              {this.state.chats.map((chat, i) => <ChatPreview
                display={chat.companionName.toLowerCase().includes(this.state.searchQuery.toLowerCase())}
                currentChat={chat.companionId == this.props.match.params.chat}
                keyValue={i}
                companionId={chat.companionId}
                companionPic={chat.companionPic}
                companionName={chat.companionName}
                date={chat.date}
                lastMessageFromYou={chat.lastMessageFromYou}
                lastMessage={chat.lastMessage}
                unread={chat.unread}
                company={chat.company}
              />)}
            </div>
          </div>
          <div className="chats-right-column">
            <div className="chats-current-compainion">
              {this.props.match.params.chat ? <div><div className="chat-pic">
                <Avatar src={helpersApi.imgUrl(this.state.currentChat.companionPic)} />
              </div>
              <div className="chats-current-compainion-name">
                {this.state.currentChat.companionName}
              </div></div> : 'Select a chat to start messsaging'}
            </div>
            <div id="chats-messages-area" className="chats-messages-area">
              {this.state.messages.map((message, i) => <Message
                keyValue={i}
                pic={message.from === 'companion' ? this.state.currentChat.companionPic : this.props.userData.img}
                noDataDisplay={
                  this.state.messages[i + 1] !== undefined &&
                  this.state.messages[i].from === this.state.messages[i + 1].from &&
                  new Date(this.state.messages[i + 1].date).getTime() - new Date(this.state.messages[i].date).getTime() < 1000 * 60 * 5
                }
                noPicDisplay={
                  this.state.messages[i - 1] !== undefined &&
                  this.state.messages[i].from === this.state.messages[i - 1].from
                }
                from={message.from}
                text={message.text}
                date={message.date}
                link={message.link}
                specialStatus={message.specialStatus}
              />)}
            </div>
            <div className="chats-input">
              <input onKeyDown={(event) => this.checkIfEnter(event)} type="text" value={this.state.typingMsg} placeholder="Type something to send..." onChange={(event) => this.setState({typingMsg: event.target.value})}/>
              <div className="chats-send-btn" onClick={() => this.sendMessage()}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(a => a)(ChatPage);