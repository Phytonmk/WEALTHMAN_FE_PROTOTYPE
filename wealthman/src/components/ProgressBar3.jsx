import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import '../css/ProgressBar3.sass';

{/*
  //  //  //              USAGE EXAMPLE              //  //  //

<ProgressBar3
  //(REQUIRED) prop passed from React Router
  match = {this.props.match}
  //(REQUIRED) page that will be shown after progress bar reaches 100%
  finishLink = "/agreement"
  //(REQUIRED) pages to show (ProgressBar3 notices, when number of pages change and renders progress bar correctly)
  pages={questionsToPages}
  //(OPTIONAL) approximate number of pages
  approxLength={8}
/>
*/}

class ProgressBar3 extends Component {
  constructor(props) {
    super(props);
    let totalLength = props.approxLength && props.approxLength >= props.pages.length ? props.approxLength : props.pages.length + 5;
    this.state = {
      pagesLength: Array(totalLength).fill(100 / totalLength),
    }
  }

  componentWillReceiveProps(nextProps) {
    let link = nextProps.match.url.slice(nextProps.match.url.lastIndexOf("/") + 1);
    let currentPageIndex = nextProps.pages.findIndex(page => page.link == link);

    let totalLength = nextProps.approxLength && nextProps.approxLength >= nextProps.pages.length ? nextProps.approxLength : nextProps.pages.length + 5;

    let unaffectedLengthsArray = this.state.pagesLength.length > 0 ?
      this.state.pagesLength.slice(0, currentPageIndex)
      :
      Array(currentPageIndex).fill(100 / totalLength);
    let unaffectedLength = currentPageIndex == 0 ?
      0
      :
      unaffectedLengthsArray.reduce((a, b) => a + b);

    this.setState({
      pagesLength: [
        ...unaffectedLengthsArray,
        ...Array(totalLength - currentPageIndex)
          .fill((100 - unaffectedLength) / (totalLength - currentPageIndex))
        ]
    });
  }

  render() {
    let link = this.props.match.url.slice(this.props.match.url.lastIndexOf("/") + 1);

    let currentPageIndex = this.props.pages.findIndex(page => page.link == link);
    if (currentPageIndex == -1)
      if (link == "first-question")
        currentPageIndex = 0;
      else
        return <div className="progress-bar-3">
          <div className="container">
            ProgressBar3: incorrect link
          </div>
        </div>;

    let currentPage = this.props.pages[currentPageIndex];
    let width = currentPageIndex == 0 ?
      0
      :
      this.state.pagesLength
        .slice(0, currentPageIndex)
        .reduce((a, b) => a + b);

    let continueButton = currentPage.allowContinue ?
      <Link to={
        currentPageIndex + 1 == this.props.pages.length ?
          this.props.finishLink
          :
          this.props.pages[currentPageIndex + 1].link
        }>
        <button className="big-blue-button">
          {currentPageIndex + 1 == this.props.pages.length ? "Finish" : "Continue"}
        </button>
      </Link>
      :
      <button className="big-grey-button">
        {currentPageIndex + 1 == this.props.pages.length ? "Finish" : "Continue"}
      </button>;

    return (
      <div className="progress-bar-3">
        <div className="container">
          <div className="content-column">
            <div className="row">
              {currentPage.component}
            </div>
            {continueButton}
          </div>
          <div className="bar-column">
            <div className="grey-bar">
              <div
                className="green-bar"
                style={{width: width + "%"}}
              />
            </div>
            <div className="row">
              <span className="grey left">Great progress, keep going</span>
              <span className="grey right">{Math.floor(width)}%</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ProgressBar3;
