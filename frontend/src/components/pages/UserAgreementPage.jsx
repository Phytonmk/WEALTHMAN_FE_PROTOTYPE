import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { setPage } from '../helpers';

class UserAgreementPage extends Component {
  constructor(props) {
    super(props);
  }
  completeForm() {
    if (this.props.history.location.search && this.props.history.location.search.includes('apply')) {
      const managerLink = this.props.history.location.search.replace('?apply=', '')
      this.props.history.push({
        pathname: 'kyc-questions',
        search: '?manager=' + managerLink
      })
      setPage(`kyc/${managerLink}`)
    } else {
      setPage('account')
    }
  }
  render() {
    return (
      <div id="user-agreement-page">
        <div className="container">
          <h1>User Agreement</h1>
          <p>
            <span>
              Wealthfront Inc. is an SEC registered investment advisor.<br />
              By using this website, you accept our Terms of Use and Privacy Policy. Past performance is no guarantee of future results. Any historical returns, expected returns, or probability projections may not reflect actual future performance. All securities involve risk and may result in loss. Our financial planning services were designed to aid our clients in preparing for their financial futures and allow them to personalize their assumptions for their portfolios. We do not intend to represent that our financial planning guidance is based on or meant to replace a comprehensive evaluation of a client's entire personal portfolio. While the data Wealthfront uses from third parties is believed to be reliable, Wealthfront cannot ensure the accuracy or completeness of data provided by clients or third parties.<br />
              Wealthfront does not provide tax advice and does not represent in any manner that the outcomes described herein will result in any particular tax consequence. Prospective investors should confer with their personal tax advisors regarding the tax consequences based on their particular circumstances. Wealthfront assumes no responsibility for the tax consequences for any investor of any transaction.<br />
              The Wealthfront Risk Parity Fund is managed by WFAS LLC, an SEC registered investment adviser and a wholly owned subsidiary of Wealthfront Inc. WFAS LLC receives an annual management fee equal to 0.50% of the Fund's average daily net assets. Northern Lights Distributors, LLC, a member of FINRA / SIPC, serves as the principal distributor for the Fund.<br />
              Before investing in the Wealthfront Risk Parity Fund, you should carefully consider the Fund's investment objectives, risks, fees and expenses. This and other information can be found in the Fund's prospectus. Please read the fund prospectus or summary prospectus carefully before investing. In order to add the Wealthfront Risk Parity Fund, we must rebalance your portfolio. As part of this process, if we sell positions at a gain, and you do not have sufficient harvested losses to offset those gains, you'll pay taxes on the net gain.<br />
              All investing is subject to risk, including the possible loss of the money you invest. In addition, an investment in the Wealthfront Risk Parity Fund (the "Fund") would also subject you to the following principal risks, among others: The Fund's principal investment strategy requires the use of derivative instruments, such as investments in total return swaps, forward and futures contracts.<br />
              In general, a derivative instrument typically involves leverage, providing exposure to potential gain or loss from a change in market price of the underlying security or commodity in a notional amount that exceeds the amount of cash or assets required to establish or maintain the derivative instrument. Adverse changes in the value of the underlying asset or index, can result in a loss to the Fund substantially greater than the amount invested in the derivative itself. These derivative instruments provide the economic effect of financial leverage by creating additional investment exposure to the underlying instrument. Financial leverage will magnify, sometimes significantly, the Fund's exposure to any increase or decrease in prices associated with a particular reference asset resulting in increased volatility in the value of the Fund's portfolio. While such financial leverage has the potential to produce greater gains, it also may result in greater losses, which in some cases may cause the Fund to liquidate other portfolio investments at a loss to comply with limits on leverage and asset segregation requirements imposed by the 1940 Act or to meet redemption requests. If the Fund uses leverage through the purchase of derivative instruments, the Fund has the risk that losses may exceed the net assets of the Fund.<br />
              The net asset value of the Fund while employing leverage will be more volatile and sensitive to market movements. Investments in total return swap agreements also involves the risk that the party with whom the Fund has entered into the total return swap agreements will default on its obligation to pay the Fund. The Fund's use of derivatives may cause the Fund to realize higher amounts of short-term capital gains than if the Fund had not used such instruments. The Fund may also be subject to overall equity market risk, including volatility, which may affect the value of individual instruments in which the Fund invests. Factors such as domestic and foreign economic growth and market conditions, interest rate levels, and political events affect the securities markets. Markets also tend to move in cycles, with periods of rising and falling prices. If there is a general decline in the securities and other markets, your investment in the Fund may lose value, regardless of the individual results of the securities and other instruments in which the Fund invests. When the value of the Fund's investments goes down, your investment in the Fund decreases in value and you could lose money. As a new fund, there can be no assurance that the Fund will grow to or maintain an economically viable size, in which case it could ultimately liquidate. The Fund is non-diversified under the 1940 Act and may be more susceptible than a diversified fund to being adversely affected by any single corporate, economic, political or regulatory occurrence. For more information regarding the risks of investing in the Fund, please see Principal Investment Risks section of the Fund's prospectus. Past performance is no guarantee of future results.
            </span>
          </p>
          <p>
              <button className="big-blue-button" onClick={() => this.completeForm()}>
                Agree
              </button> 
          </p>
        </div>
      </div>
    );
  }
}

export default withRouter(UserAgreementPage);
