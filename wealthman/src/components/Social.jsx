import React, { Component } from 'react';

import '../css/social.sass';

class Social extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  render() {
    return (
      <div className="social">
        {
          this.props.links === undefined ? '' : this.props.links.map((link, index) => {
            let availableIcons = [["telegram", "t.me"], ["bitcointalk"], ["facebook"], ["instagram"], ["medium"], ["reddit"], ["twitter"], ["linkedin"], ["youtube"]];
            let returned = "";

            availableIcons.forEach(icon => icon.forEach(variation => {
              if (link.includes(variation))
                returned = <a
                  className={"icon " + (index < this.props.links.length - 1 ? "margin" : "")}
                  key={link}
                  href={link}
                  target="_blank"
                >
                  <img className="default" src={"/social/default/" + icon[0] + "-icon.svg"} />
                  <img className="hover" src={"/social/hover/" + icon[0] + "-icon.svg"} />
                </a>;
              }));
            return returned;
          })
        }
      </div>
    );
  }
}

export default Social;
