import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class AboutPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  render() {
    return (
      <div id="about-page">
        <div className="new-long-header" />
        <div className="container">
          <article className="top-text">
            <h1>About us</h1>
            <span>
              Wealthman is a decentralized platform for development, execution and marketing
              of wealth management service. The platform is embedded with strong antifraud features
              allowing autonomous robo-advisors and human-driven digital asset management services
              to be secure for investors. Marketplace of wealth management service with efficiency
              metrics. Investment portfolio is being rebalanced by chosen wealth manager through
              Wealthman DApp. Managed assets could be observed and accessed by private key
              at any time.
            </span>
          </article>
          <article className="our-vision">
            <h1>Our vision</h1>
            <span>
              In our long-term vision WealthMan is the most intelligent, safest and fastest platform for wealth
              management that gains accepted industry-wide. It is our belief that decentralized autonomous
              robo-advisors based on smart contracts will dislodge centralized robo-advisors and human-driven
              wealth management service. Registers of global assets will be decentralized. Thus, the
              decentralized robo-advisors will dominate the market of wealth management services.
            </span>
          </article>
          <article className="facts">
            <div className="card-1">
              <span>Founded in</span>
              <h1>2014</h1>
            </div>
            <div className="card-2">
              <span>Tracked spend</span>
              <h1>$3 Billions</h1>
            </div>
            <div className="card-3">
              <span>Integration partners</span>
              <h1>2000+</h1>
            </div>
          </article>
          <div className="vertical-line" />
          <article className="regular">
            <h1>High competency</h1>
            <span>
              Wealthman evaluates the degree to which the robo-advisors and wealth managers meet
              objectives set by investors. Ranking based on such findings makes service effectiveness
              transparent and motivates the demand for quality. Competition lead to the benefit of the quality
              of wealth management service.
            </span>
          </article>
          <article className="regular">
            <h1>Assets security</h1>
            <span>
              Wealthman embedded with strong antifraud desing, that protects against deception.
              Decentralized service execution and assets storage eliminate capital risks caused by errors/
              vulnerability of central party.
            </span>
          </article>
          <article className="regular">
            <h1>Trustless</h1>
            <span>
              Being decentralized, Wealthman wins in situations where there is lack of trust of investor in
              wealth manager’s competency, honesty, and infrastructure reliability.
            </span>
          </article>
        </div>
      </div>
    );
  }
}

export default AboutPage;
