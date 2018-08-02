import React, { Component } from 'react';

import Subheader from './../Subheader.jsx';

import MozillaLogo from './../../img/SupportedBrowsers/firefox-logo.png';
import MozillaDesc from './../../img/SupportedBrowsers/firefox.png';
import EdgeLogo from './../../img/SupportedBrowsers/edge-logo.png';
import EdgeDesc from './../../img/SupportedBrowsers/edge.png';
import ChromeLogo from './../../img/SupportedBrowsers/chrome-logo.svg';
import ChromeDesc from './../../img/SupportedBrowsers/chrome.png';

class SupportedBrowsersPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  renderMozilla() {
    return (
      <div className="mozilla">
        <h1>Mozilla Firefox</h1>
        <img
          src={MozillaLogo}
          className="browser-logo"
        />
        <span>
          To check what version of Firefox you are using, click on the Firefox menu button in the top right corner.
        </span>
        <span>
          Then click on the question mark at the bottom then click on <i><b>About</b></i>.
        </span>
        <img
          src={MozillaDesc}
          className="img1"
        />
        <a href="https://support.mozilla.org/kb/update-firefox-latest-version" target="_blank">
          <button className="big-green-button">
            Update firefox now
          </button>
        </a>
      </div>
    );
  }
  renderEdge() {
    return (
      <div className="edge">
        <h1>Microsoft Edge</h1>
        <img
          src={EdgeLogo}
          className="browser-logo"
        />
        <span>
          To check what version of Edge you are using, click on the three dots  in the top right corner and then go to settings.  Scroll to the bottom of the menu bar and you will see an your version number in the <i><b>About this App</b></i> section.
        </span>
        <img
          src={EdgeDesc}
          className="img1"
        />
        <a href="https://www.microsoft.com/en-us/windows/microsoft-edge" target="_blank">
          <button className="big-red-button">
            Update edge now
          </button>
        </a>
      </div>
    );
  }
  renderChrome() {
    return (
      <div className="chrome">
        <h1>Google Chrome</h1>
        <img
          src={ChromeLogo}
          className="browser-logo"
        />
        <span>
          To check what version of Google Chrome you are using, click on the <i><b>Chrome</b></i> menu button in the top right corner and click on <i><b>Help</b></i> then select <i><b>About Google Chrome</b></i>.
        </span>
        <img
          src={ChromeDesc}
          className="img1"
        />
        <a href="https://www.google.com/chrome/" target="_blank">
          <button className="big-blue-button">
            Update Chrome now
          </button>
        </a>
      </div>
    );
  }

  render() {
    return (
      <div id="supported-browsers-page">
        <div className="container">
          <h1>Supported Browsers</h1>
          <span>
            <div>
              As part of our continual improvement process and our commitment to security, inStream stays up to date with the latest browser versions of Firefox version 43.0+,Microsoft Edge 38+, and Google Chrome version 56.0+.
            </div>
            <div>
              We don’t officially support Safari, but our users have not reported any issues using this browser.
            </div>
            <div>
              If you are using older versions of these browsers, including Internet Explorer, you may experience some rendering and navigation issues. To ensure the best user experience, please update to the latest version of your browser of choice.
            </div>
          </span>
        </div>
        <Subheader data={[
          {
            header: "Firefox",
            content: this.renderMozilla(),
          },
          {
            header: "Microsoft Edge",
            content: this.renderEdge(),
          },
          {
            header: "Google Chrome",
            content: this.renderChrome(),
          },
        ]} />
      </div>
    );
  }
}

export default SupportedBrowsersPage;
