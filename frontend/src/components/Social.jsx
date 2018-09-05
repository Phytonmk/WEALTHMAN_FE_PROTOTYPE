import React, { Component } from 'react';

import '../css/social.sass';

const availableIcons = [["telegram", "t.me"], ["bitcointalk"], ["facebook"], ["instagram"], ["medium"], ["reddit"], ["twitter"], ["linkedin"], ["youtube"]];

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
            let returned = "";

            availableIcons.forEach(icon => icon.forEach(variation => {
              if (link.includes(variation))
                returned = <a
                  className={"icon " + (index < this.props.links.length - 1 ? "margin" : "")}
                  key={link}
                  href={link}
                  target="_blank"
                >
                  <div className={icon[0] + " default"} />
                  <div className={icon[0] + " hover"} />
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
