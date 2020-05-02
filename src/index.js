import React, { Component } from 'react'
import propTypes from "prop-types"
import "bootstrap/dist/css/bootstrap.min.css";

let openNotification;

export const notify = ({ text = "", variant = "primary" }) => {
  if (!openNotification) throw new Error("Can't use notify before declaration");

  openNotification(text, variant);
}

export class FormHandler extends Component {
  static propTypes = {
    options: propTypes.shape({
      animation: propTypes.bool,
      delay: propTypes.number,
      autohide: propTypes.bool
    })
  };

  state = {
    show: false,
    variant: variants["primary"],
    text: ""
  };

  componentWillMount() {
    openNotification = this.open;
  }

  open = (text = "", variant = "primary") => {
    this.setState({ show: true, text: text, variant: variants[variant] });
  }

  onClose = () => {
    this.setState({ show: false });
  }

  render() {
    const { options } = this.props;
    const { show, variant, text } = this.state;

    let animation = false, delay = 4000, autohide = true;
    if (options) {
      animation = options.animation || false;
      delay = options.delay || 4000;
      autohide = options.autohide || true;
    }

    return (
      <div className="d-flex justify-content-center">
        <Toast
          style={{
            background: variant,
            position: "fixed",
            bottom: 20,
            zIndex: 999
          }}
          onClose={this.onClose}
          show={show}
          animation={animation}
          delay={delay}
          autohide={autohide}
        >
          <Toast.Header>
            <strong className="mr-auto">{text}</strong>
          </Toast.Header>
        </Toast>
      </div>
    );
  }
}