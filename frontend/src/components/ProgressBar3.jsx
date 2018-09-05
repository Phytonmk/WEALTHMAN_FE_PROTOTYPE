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
  pages={[
    {
      //(REQUIRED) link for this page
      link: "page1",
      //(OPTIONAL) while allowContinue is false, user can't continue to the next page
      allowContinue: page1.value != "",
      //(REQUIRED) component to render on this page
      component: <Page1 />,
    },
    {
      link: "page2",
      allowContinue: page2.value != "",
      component: <Page2 />,
    },
  ]}
  //(OPTIONAL) approximate number of pages
  approxLength={8}
/>
*/}

const subtitles = [
  'Great progress, keep going',
  'Great progress, keep going',
  'Very good',
  'Ok',
  'Keep going',
]


class ProgressBar3 extends Component {
  constructor(props) {
    super(props);
    let totalLength = props.approxLength && props.approxLength >= props.pages.length ? props.approxLength : props.pages.length + 5;
    this.state = {
      pagesLength: Array(totalLength).fill(100 / totalLength),
      subtitle: '',
      lastPageIndex: 0
    }
  }
  componentDidMount() {
    window.onbeforeunload = () => 'Data will not be stored, continue?'
  }
  componentWillUnmount() {
    window.onbeforeunload = null
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
    const newState = {
      pagesLength: [
        ...unaffectedLengthsArray,
        ...Array(totalLength - currentPageIndex)
          .fill((100 - unaffectedLength) / (totalLength - currentPageIndex))
        ]
    }
    if (currentPageIndex != this.state.lastPageIndex) {
      newState.lastPageIndex = currentPageIndex;
      newState.subtitle = subtitles[Math.floor(subtitles.length * Math.random())];
    }
    this.setState(newState);
  }

  render() {
    let link = this.props.match.url.slice(this.props.match.url.lastIndexOf("/") + 1);

    let currentPageIndex = this.props.pages.findIndex(page => {
      let pageLink = page.link
      if (pageLink.includes('?'))
        pageLink = pageLink.substr(0, pageLink.indexOf('?'))
      return pageLink == link
    });
    if (currentPageIndex == -1)
      if (link == "first-question")
        currentPageIndex = 0
      else if (this.props.pages.length === 1)
        currentPageIndex = 0
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
        } onClick={currentPageIndex + 1 == this.props.pages.length && this.props.onComplete ? () => this.props.onComplete() : () => {}}>
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
              <span className="grey left">{width > 0 ? this.state.subtitle : ''}</span>
              <span className="grey right">{Math.floor(width)}%</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ProgressBar3;
