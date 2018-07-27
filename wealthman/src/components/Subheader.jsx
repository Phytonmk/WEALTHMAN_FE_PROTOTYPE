import React, { Component } from 'react';

import '../css/Subheader.sass';

{/*
  //  //  //              USAGE EXAMPLE              //  //  //

<Subheader
  //(REQUIRED) data objects must include 2 props: header, content
  data={[
    {
      header: "hi",
      content: <Component />
    },
  ]}
  //(OPTIONAL) number of the tab, that will be opened, when Subheader renders for the first time
  initialTab={0}
  //(OPTIONAL) tab changing event
  onChange={function(currentTab) {}}
/>
*/}

class Subheader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTab: 0,
      canRenderUnderline: false,
      error: "",
    }
  }

  componentWillMount() {
    if (typeof this.props.data == "undefined" || this.props.data.length == 0)
      this.setState({error: this.state.error + "you must define 'data' prop; "});
    if (typeof this.props.initialTab != "undefined" && typeof this.props.data != "undefined" && this.props.data.length <= this.props.initialTab)
      this.setState({error: this.state.error + "initialTab overflows data array; "});

    if (typeof this.props.initialTab != "undefined")
      this.setState({currentTab: this.props.initialTab});
  }

  componentDidMount() {
    this.setState({canRenderUnderline: true});
  }

  renderUnderline() {
    let selectedTab = document.getElementById("subheaderTab" + this.state.currentTab).getBoundingClientRect();
    let container = document.getElementById("subheaderTabs").getBoundingClientRect();
    let underlineLeft = selectedTab.left - container.left;
    let underlineWidth = selectedTab.right - selectedTab.left;

    return (
      <div
        className="underline"
        style={{
          left: underlineLeft,
          width: underlineWidth
        }}
      />
    );
  }

  render() {
    if (this.state.error != "")
      return this.state.error;

    let currentData = this.props.data[this.state.currentTab];

    return (
      <div className="subheader">
        <div className="container shown-in-account">
          <div className="header-preview">
            <h1>{currentData.header}</h1>
            <span>It takes you a few minutes</span>
          </div>
        </div>
        <div className="tabs">
          <div className="container relative" id="subheaderTabs">
            {
              this.props.data.map((tab, index) =>
                <div
                  className={"tab " + (this.state.currentTab == index ? "selected" : "")}
                  onClick={() => {
                    if (typeof this.props.onChange === 'function')
                      this.props.onChange(index);
                    this.setState({currentTab: index})
                  }}
                  id={"subheaderTab" + index}
                  key={index}
                >
                  {tab.header}
                </div>
              )
            }
            {this.state.canRenderUnderline ? this.renderUnderline() : ""}
          </div>
        </div>
        <div className="container">
          {currentData.content}
        </div>
      </div>
    );
  }
}

export default Subheader;
