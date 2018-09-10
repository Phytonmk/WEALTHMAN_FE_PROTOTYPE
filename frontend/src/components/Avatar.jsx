import React, { Component } from 'react';

import '../css/Avatar.sass';

{/*
  //  //  //              USAGE EXAMPLE              //  //  //

<Avatar
  //(OPTIONAL) img src
  src="/img/avatar.jpg"
  //(OPTIONAL) width and height of the Avatar (default 40 px)
  size="100px"
  //(OPTIONAL) avatar icon for "user"/"company"/"admin" (default "user")
  type="company"
/>
*/}

class Avatar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageLoaded: false,
      orientation: "landscape",
      transform: 'translateX(0%) translateY(0%)'
    };
  }

  componentWillMount() {
    this.handleImageLoad(this.props.src);
  }

  componentWillReceiveProps(nextProps) {
    this.handleImageLoad(nextProps.src);
  }

  handleImageLoad(src) {
    let image = new Image();

    image.src = " ";
    image.onload = () => {
      const landscape = image.width > image.height
      this.setState({
        imageLoaded: true,
        orientation: landscape ? "landscape" : "portrait",
        transform: `translate${landscape ? 'X' : 'Y'}(-${(landscape ? (image.width / image.height) : (image.height / image.width)) * 10}%)`
      });
    };
    image.src = src;
  }

  render() {
    let defaultAvatar;
    switch(this.props.type) {
      case "company":
        defaultAvatar = <div className="default-avatar-company" />;
        break;
      case "admin":
        defaultAvatar = <div className="default-avatar-admin" />;
        break;
      default:
        defaultAvatar = <div className="default-avatar-user" />;
        break;
    }

    return (
      <div
        className="avatar"
        style={{
          width: this.props.size ? this.props.size : "40px",
          height: this.props.size ? this.props.size : "40px",
          borderRadius: this.props.size ? this.props.size : "40px",
        }}
      >
        {defaultAvatar}
        {
          this.props.src &&
            <img
              style={{transform: this.state.transform}}
              src={this.props.src}
              className={this.state.imageLoaded ? ("loaded " + this.state.orientation) : ""}
            />
        }
      </div>
    );
  }
}

export default Avatar;
