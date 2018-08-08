import React, { Component } from 'react';

import Social from './../Social';
import Input from './../Input';

class ContactPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      message: "",
    }
  }

  render() {
    return (
      <div id="contact-page">
        <div className="new-long-header" />
        <div className="container">
          <div className="top-row">
            <h1>Have some questions?</h1>
            <div className="main-column">
              <h3>
                If you have any questions regarding the Wealthman project do not hesitate to contact us using the contact form! We will be glad to answer any questions about our project.
              </h3>
            </div>
            <div className="second-column">
              <h3>Follow us</h3>
              <Social links={[
                "https://t.me/wealthman_global",
                "https://bitcointalk.org/index.php?topic=2006205",
                "https://www.facebook.com/WealthMan.io/",
                "https://www.instagram.com/wealthman.io/",
                "https://medium.com/@Wealthman",
                "https://www.reddit.com/r/Wealthman/",
                "https://twitter.com/wealthman_io",
                "https://www.linkedin.com/company/wealthman-io",
                "https://www.youtube.com/c/wealthman",
              ]} />
            </div>
          </div>
          <div className="row">
            <div className="main-column">
              <div className="box">
                <h2><b>Get in touch with the Wealthman team</b></h2>
                <small>NAME</small>
                <Input
                  value={this.state.name}
                  onChange={event => this.setState({name: event.target.value})}
                  placeholder="Your full name"
                />
                <small>EMAIL ADDRESS</small>
                <Input
                  value={this.state.email}
                  onChange={event => this.setState({email: event.target.value})}
                  placeholder="username@email.com"
                />
                <small>MESSAGE</small>
                <Input
                  type="textarea"
                  value={this.state.message}
                  onChange={event => this.setState({message: event.target.value})}
                  placeholder="Tell us something"
                />
                <button className="big-blue-button">Send</button>
              </div>
            </div>
            <div className="second-column">
              <div className="box">
                {
                  [
                    {
                      title: "General questions",
                      email: "info@wealthman.io",
                    },
                    {
                      title: "ICO, Media\PR inquiries",
                      email: "office@wealthman.io",
                    },
                  ].map(email =>
                    <div className="email-row">
                      <span className="title">{email.title}</span>
                      <a href={"mailto:" + email.email}>
                        <span className="email">{email.email}</span>
                      </a>
                    </div>
                  )
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ContactPage;
