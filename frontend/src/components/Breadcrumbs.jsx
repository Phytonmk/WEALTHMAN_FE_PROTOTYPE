import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import '../css/Breadcrumbs.sass';

{/*
  //  //  //              USAGE EXAMPLE              //  //  //

<Breadcrumbs
  //(REQUIRED) array of links and labels
  links={[
    {
      link: "/",
      label: "Marketplace",
    },
    {
      link: "/company/1",
      label: "Moroz&Co",
    },
  ]}
/>
*/}

class Breadcrumbs extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <div className="breadcrumbs">
        {
          this.props.links.map((link, index) =>
            <div className={"left " + (index < this.props.links.length - 1 && "with-arrow")} >
              <Link to={link.link} >
                {link.label}
              </Link>
            </div>
          )
        }
      </div>
    );
  }
}

export default Breadcrumbs;
