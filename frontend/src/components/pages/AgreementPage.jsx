import React, { Component } from 'react';
import { setReduxState } from '../../redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import ProgressBar from '../ProgressBar'

import { api, getCookie, setCookie, newLines, setPage } from '../helpers';


class AgreementPage extends Component {
  constructor(props) {
    super(props);
  }
  agree () {
    api.post('investor/agree')
      .then(() =>{
        setCookie('usertype', '0');
        setPage("static form");
      })
      .catch(console.log);
  }
  render() {
    return (
      <div>
        {/* {this.renderBackButton()} */}
        <ProgressBar  currentPage={this.props.currentPage} />
        <div className="container">
          <div className="box">
            <h1 className="text-center">Agreement</h1>
            {newLines(agreementText)}
            <div className="row-padding">
              <Link to={"/email"}>
                <button className="back" onClick={() => this.previousPage()}>Back</button>
              </Link>
              <Link to={"/static form"}>
                <button className="continue" onClick={() => this.agree()}>Agree</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(a => a)(AgreementPage)

const agreementText = 
`Terms and Conditions for the Wealthman.
Wealthman Ltd.

These terms and conditions create a legally-binding agreement between you and us relating to the operation of your Profile. Please read them carefully because we will rely on them in all our dealings with you. If there is anything you do not understand, you should contact us for help. 

By registering on Wealthman web-site Client has entered into an agreement with an independent wealth Manager identified therein (“Manager”) and Wealthman Ltd. (“Wealthman”) relating to the services that will be provided to Client by Manager and Wealthman. Client participates in the Wealthman service (the “Service”) offered by Wealthman. Client understands that Wealthman and Manager are not affiliated other than through jointly providing services. Wealthman operates the technology platform on which the Service functions and the Manager renders investment advice to Client, including recommending an appropriate asset allocation for Client and specific investment managers or investment products. Client wishes to participate in the Service with respect to certain of Client’s assets (the “Service Assets”).
In connection with the Service Assets, Wealthman is providing only administrative services to Manager. Wealthman will not have discretion over Service Assets managed pursuant to the Manager and is not providing investment Management services to Client. Manager will select the specific investment choices, and reconcile all activities with the records of the relevant broker-dealers.
In connection with Investment Models Service Assets using a robo-advisor developed by a Manager, Wealthman is providing overlay management of the investment models by performing administrative services. Wealthman is not responsible for the selection of the specific investment choices made with respect to such Investment Models Service Assets. Client agrees and acknowledges that Wealthman shall have no liability relating to specific investment selections.

1. Client Profile. Client has completed the required investment profile questionnaire provided to Client. Client certifies to Manager and Wealthman that Client has completely and accurately provided information regarding Client’s financial condition and investment. Client acknowledges and agrees that Manager and Wealthman base their recommendations and decisions for Client on information that Client has provided and that Manager, Wealthman and any third parties retained by Wealthman may rely on such information. Client further agrees to notify Manager immediately if Client’s financial condition and/or investment objectives change. Client understands that Client’s failure to provide Manager with current, accurate information could adversely affect Manager’s and/or Wealthman’s ability to effectively allocate Client’s assets within the Service.
2. Appointment as Investment Manager.
Wealthman and/or Manager will recommend an appropriate asset allocation among the investment options in the Service and recommend investment vehicles within that service for Client’s Accounts. In selecting investment vehicles for the Accounts, Manager and/or Wealthman will consider factors it deems relevant, including but not limited to, the investment goals and objectives of Client, and any reasonable restrictions imposed by Client on management of the Accounts including the designation of particular securities or types of securities that should not be purchased for the Accounts, or that should be sold if held in the Accounts. Client understands and is willing and able to accept the risk involved in the selection of investments and further understands that there is no assurance that Client’s investment objective will be achieved.
3. Service Fee.
For services provided under this Agreement, Client will pay a Service Fee 
The Service Fee does not cover certain charges associated with transactions in Clients’ accounts. Client also may be subject to taxes. Accordingly, Clients should consult with their financial Manager and tax consultant before transferring assets into a Service.
4. Communications with Client.
(a) Client agrees that all communications from Manager and/or Wealthman may be by electronic means. As soon as possible, but in no event later than 45 days, after the end of each calendar quarter, Manager or Wealthman will provide Client via electronic means a statement containing a description of all activity in Client’s Accounts during the previous period.
The statement will also include a statement to the effect that Client should contact the Manager if there have been any changes in Client’s financial situation or investment objectives, if Client wishes to impose reasonable restrictions on the management of Client’s account, or if Client wishes to reasonably modify existing restrictions and such statement will explain to Client the means by which contact with Manager may be made.
(c) Manager will contact Client at least annually to determine whether there have been any changes in Client’s financial situation or investment objectives, and whether Client wishes to impose any reasonable restrictions, or reasonably modify existing restrictions on the management of Client’s Accounts.
5. Representations.
(a) Each of Manager and Wealthman has made all notice filings and paid all fees, if any, under applicable federal or state securities laws that its current activities require it to make or pay. Each of Manager and Wealthman will obtain and maintain all such registrations, file all such notices and pay all such fees, if any, for so long as required under applicable law.
(b) By executing this Agreement, Client represents that it has the requisite legal capacity and authority to execute, deliver and perform its obligations under this Agreement. This Agreement has been duly authorized, executed and delivered by Client and is the legal, valid and binding agreement of Client, enforceable against Client in accordance with its terms. Client’s execution of this Agreement and the performance of its obligations hereunder does not conflict with or violate any provisions of the governing documents of Client or any obligations by which Client is bound, whether arising by contract, operation of law or otherwise. Client will deliver to Manager evidence of Client’s authority and compliance with its governing documents on Manager’s request.
6. Confidentiality of Information.
(a) Except as may be required by law or as otherwise provided in this Agreement, Manager and Client shall treat all information, recommendations and advice regarding the Service Assets as confidential; provided, however, that Manager may provide any confidential information concerning Client or its Accounts to Wealthman, Managers and outside service providers, provided that such parties are subject to substantially similar confidentiality provisions as those in this Agreement.
(b) The rights and obligations of Manager and Client pursuant to this section shall survive any termination of the Agreement.
7. Limitation of Liability
Neither Manager nor Wealthman shall be liable to Client for any investment or recommendation made, or any investment advice given, or any other investment action taken or omitted, except to the extent such loss is caused by gross negligence, a breach of fiduciary duty, or an illegal or wrongful act by Manager, as applicable. Notwithstanding the foregoing, federal and state laws impose liabilities under certain circumstances on persons who act in good faith, and nothing herein shall constitute a waiver or limitation of any rights which Client may have under any federal or state laws. Client acknowledges that neither Manager nor Wealthman make any guarantee of profit or offer any protection against loss on any Service Assets managed by Manager, Wealthman or on any Service Assets invested in mutual funds or alternative investment products that Manager or Wealthman recommend and that all purchases and sales of mutual funds, alternative investment products or other assets shall be solely for the account and risk of Client.
8. Third Party Beneficiaries.
Client acknowledges and agrees that any parties appointed by Manager and/or Wealthman and retained by Wealthman are intended third party beneficiaries of this Agreement. Such Managers are not liable to Client for any investment or recommendation made, or any investment advice given, or any other investment action taken or omitted, except to the extent such loss is caused by gross negligence, a breach of fiduciary duty, or an intentionally illegal or wrongful act by such Manager. Notwithstanding the foregoing, federal and state laws impose liabilities under certain circumstances on persons who act in good faith, and so nothing herein shall constitute a waiver or limitation of any rights which Client may have under any federal or state laws.
9. Termination.
This Agreement is effective upon acceptance by Manager and Wealthman. Client has the right to cancel this Agreement within five (5) business days of the later of Manager’s or Wealthman’s acceptance by giving written notice of such cancellation to Manager. In such event, any Service Fees paid by Client shall not be refunded to Client, but Client shall be responsible for any transactions executed prior to Manager’s receipt of the written cancellation notice.
This Agreement may be terminated by either party upon thirty (30) days prior written notice to the other party, subject to the above cancellation provisions of this Section Termination of this Agreement will not affect liabilities or obligations arising from performance or transactions initiated prior to such termination.
10. Notices.
All notices hereunder shall be in writing, sent by e-mail to the receiving party, at the respective address 5 Percy st., London, W1T 1DG, UK, or at such other address as such party shall have specified to the other party by notice similarly given. If no address is specified below for Client, then at the address set forth in the records of Manager for notices to Client by Manager, respectively.
This Agreement is not assignable by any party without the consent of the other parties, except that Manager and/or Wealthman may assign this Agreement by using a “negative consent” process whereby Client has no less than 30 days to respond to a notice of intended assignment. However, Manager and Service Manager have the power and authority in their sole discretion to delegate discretionary management of Service Assets to Sub-Managers. 
11. Governing Law.
This Agreement and the interpretation and application of the provisions hereof shall be governed and construed in accordance with the laws of the England and Wales, without giving effect to its choice of law provisions.
12. Arbitration.
The parties agree that any controversy, claim or dispute concerning this or any other agreement between the parties, or arising out of or relating to this Agreement or the breach thereof shall be settled by arbitration in accordance with the applicable law. Any arbitration award shall be final, and judgment upon the award rendered may be entered in any court, having jurisdiction. In the event of any legal action taken to resolve a dispute between the parties, the prevailing party shall be entitled to recover reasonable legal fees and costs.
13. Counterparts.
This agreement may be executed in one or more counterparts and all counterparts together may constitute a single agreement among the parties or conclude it any other way.
14. Web Site Terms and Conditions.
The Terms and Conditions of Use governing use of the Service via the Wealthman web site are posted on the Wealthman web site (http://www.wealthman.io) and are incorporated by reference in this Agreement. Manager and Client agree that each of them and their authorized users shall abide by all terms and conditions described in the Terms and Conditions of Use which may be accessed by clicking on the link labeled Terms&Conditions on the website noted above.
15. Users and Security.
Where Client on-line access is permitted, Client agrees that Client is responsible for (1) authorizing, monitoring, controlling access to and maintaining the strict confidentiality of the userIDs, passwords and codes (collectively, “IDs”) assigned by Wealthman to Clients, (2) not allowing unauthorized persons to use their IDs, (3) any charges or damages that may be incurred as a result of Client’s failure to maintain the strict confidentiality of their IDs, and (4) promptly informing Wealthman of any need to deactivate an ID due to security concerns. Neither Platform Manage nor Manager are not liable for any harm related to the theft of IDs assigned to Client, Client’s disclosure of such IDs, or Client allowing another person or entity to access and use such IDs.
16. Entire Agreement; Amendment.
This Agreement constitutes the entire understanding between the parties relating to the subject matter contained herein and merges and supersedes all prior discussions and writings between them. No party shall be bound by any condition, warrant, or representation other than as expressly stated in the Agreement except that Manager and/or Wealthman may amend this Agreement by using a “negative consent” process whereby Client has no less than 30 days to respond to a notice of intended amendment.`