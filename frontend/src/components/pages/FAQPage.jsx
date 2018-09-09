import React, { Component } from 'react';
import { setReduxState } from './../../redux/index';
import { Link } from 'react-router-dom';

import Accordion from './../Accordion';

class FAQPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  render() {
    let accordions = [
      {
        header: "What is the future of WealthMan?",
        content: newLines("WealthMan is a state-of-the-art wealth management platform with fast and secure transaction algorithms. Decentralized autonomous robo-advisors based on smart contracts will dislodge centralized robo-advisors and human-conducted wealth management service. Global asset registers will become digital, accounts decentralized. Thus, decentralized robo-advisors will soon dominate the market of wealth management services.")
      },
      {
        header: "What is the WealthMan DAO?",
        content: newLines("It is a smart contract, in which all functions run on top of Ethereum. WealthMan DAO is used to: - manage of platform settings (remuneration, the level of the data provider's pledge, etc.); - maintain list of accepted series of data; - mint AWM tokens during token generation event; - burn AWM tokens; - store funds and tokens and transmits them based on the code (e.g. lock AWM tokens of Data Provider).")
      },
      {
        header: "What is the WealthMan?",
        content: newLines("WealthMan is a decentralized platform for development and execution of autonomous Wealth Management robo-advisors. In creating the platform, we are placing particular emphasis on situations where there is no trust of investor in wealth manager’s competency and honesty, infrastructure security, and where low costs and speed of high-tech wealth management service deployment are important.  So, Wealthman is a platform that does this by building a decentralized application on top of blockchain protocol that capable to execute algorithms written on Wealthman’s proprietary built-in high-level programming language. The application allows any user to start a secure advisory service or easily develop a decentralized robot-advisor. Such services can be configured with arbitrary rules for calculating the structure of the investment portfolio on the basis of a constantly updated and insured data set, transaction execution rules and remuneration terms.")
      },
      {
        header: "Discretionary investment management",
        content: <div>
          {newLines("Discretionary investment management is a form of wealth management through which investment decisions are made at the discretion of a professional wealth manager. It is essentially a hands-off approach, suitable for investors who lack the time, experience, or desire to actively manage their portfolio and wish to delegate this responsibility to a professional. If you opt for discretionary management services, the first thing the wealth manager will probably do – in order to understand your investment objectives and risk appetite – is to have you answer a questionnaire. Expect to be asked how much investment risk you are willing to take on, the amount of returns you aim to receive by taking that level of risk, and your preferred asset classes and markets.\nYour wealth manager will then formulate a customised investment strategy that fits your preferences and risk profile, and you will have the opportunity to review this. After you sign off on this plan, your wealth manager will be responsible for all the investment decisions relating to your portfolio. You will not be required to provide consent for individual transactions. The majority of wealth managers offer discretionary services, and this style of investment management is the most popular choice among private clients.\nIf you lack extensive experience in investing, are time-strapped, or are simply not inclined to get involved in managing their investment portfolio, the discretionary approach is probably the right one for you. By delegating the management of your portfolio to a wealth service professional, you are freed from the burden of making investment decisions on a day-to-day basis.")}
          <Link to="/managers" className="blue-link active" onClick={() => setReduxState({managersFilter: "Discretionary"})}>Try it</Link>
        </div>
      },
      {
        header: "Advisory investment management",
        content: <div>
          {newLines("Advisory investment management – is a hands-on approach, suitable for those investors who possess the necessary expertise and initiative to take an active role in managing their own portfolios. With advisory services, the wealth manager will consult with you and provide investment strategy advice and guidance, but you will make the final buy-and-sell decisions and changes to your portfolio. In order to be able to provide you with personalised investment guidance, your wealth manager will first need to schedule a sit-down session with you to develop an understanding of your investment objectives and risk appetite.\nHaving a say over your investment portfolio is the most compelling reason for choosing the advisory style of asset management. You will always be in the driver’s seat and will have total control over where your money is being invested at any given time.\nHowever advisory portfolio management requires you to be very knowledgeable about investing tools and techniques and highly attuned to market movements. Because you are required to “sign-off” on every deal, you need to remain contactable at all times to approve of any changes made to an order. If your wealth manager is unable to reach you at a particularly crucial moment, it might result in a missed opportunity for a financial gain or even a loss.")}
          <Link to="/managers" className="blue-link active" onClick={() => setReduxState({managersFilter: "Advisory"})}>Try it</Link>
        </div>
      },
      {
        header: "Robo-advisors (robo-advisers)",
        content: <div>
          {newLines("Robo-advisors (robo-advisers) are automated, algorithm-driven financial planning services with no human supervision. A robo-advisor collects information from clients about their financial situation and future goals through an online survey, and then uses the data to automatically invest client assets.\nOther common designations for robo-advisors are “robo-advisory”, “automated investment advisor”, “automated investment management”, “virtual adviser” and “digital advice platforms”.\nAll robo-advisors on the Wealthman platform are controlled by investor’s smart contracts.")}
          <Link to="/managers" className="blue-link active" onClick={() => setReduxState({managersFilter: "Robo-advisor"})}>Try it</Link>
        </div>
      },
    ];
    let accordionsMapped = accordions.map((data, index) =>
      <div>
        <Accordion
          key={data.header}
          header={data.header}
          content={data.content}
        />
        {index < accordions.length - 1 ? <div className="vertical-line" /> : ""}
      </div>
    );

    return (
      <div id="faq-page">
        <div className="container">
          <div className="second-column">
            <div className="box">
              <h3>General questions</h3>
              <span>
                Here you can find answers for common questions about Wealthman Platform
              </span>
            </div>
          </div>
          <div className="main-column right">
            <div className="box">
              <h1>General questions</h1>
              <h3>
                Here you can find answers for common questions about Wealthman Platform
              </h3>
              {accordionsMapped}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function newLines(string) {
  var paragraphs = [];
  var prevI = 0;

  for (var i = 0; i < string.length; i++) {
    if (string[i] === '\n') {
      paragraphs.push(string.slice(prevI, i));
      prevI = i;
    }
  }
  paragraphs.push(string.slice(prevI));

  return <div>
    {
      paragraphs.map((paragraph, i) =>
        <span key={i} style={{display: "block"}}>
          {paragraph}
        </span>
      )
    }
  </div>;
}

export default FAQPage;
