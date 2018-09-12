import React, { Component } from 'react';
import '../css/social.sass';

{/*
  //  //  //              USAGE EXAMPLE              //  //  //

<Social
  //(OPTIONAL) links to social network in order of required appearance
  links={["https://facebook.com/user", "https://telegram.com/user3"]}
  //(OPTIONAL) if true links are grey and colored on hover; if false, links are always in color (default true)
  hoverable=true
/>
*/}

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
                  <div className={icon[0] + " hover" +
                    (this.props.hoverable || typeof this.props.hoverable == "undefined" ? " hoverable" : "")}
                  />
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
