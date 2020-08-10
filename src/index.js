import React, { Component } from 'react'
import propTypes from "prop-types"
import "bootstrap/dist/css/bootstrap.min.css";
import Joi from "joi-browser";


let data, schema, listeners = {}, translator;

class FormHandler extends Component {
  static propTypes = {
    schema: propTypes.object.isRequired,
    data: propTypes.object.isRequired,
    translator: propTypes.func,
  };

  static checkError() {
    const options = { abortEarly: false };
    const { error } = Joi.validate(data, schema, options);
    if (!error) return false;

    for (let item of error.details)
      if (listeners[item.path[0]])
        listeners[item.path[0]](translator && item.message ? translator(item.message) : item.message);

    return true;
  }

  static takeErrors() {
    if (!data) return;

    let errors = {};
    for (name in data)
      errors[name] = false;

    const options = { abortEarly: false };
    const { error } = Joi.validate(data, schema, options);

    if (error)
      for (let item of error.details)
        errors[item.path[0]] = true;

    return errors;
  }

  componentDidMount() {
    data = this.props.data;
    schema = this.props.schema;
    translator = this.props.translator;
  }

  componentDidUpdate(prevProps) {
    for (let name in this.props.data) {
      if (this.props.data[name] !== prevProps.data[name]) {
        const error = this.handleError(name);

        if (listeners[name])
          listeners[name](this.props.translator && error ? this.props.translator(error) : error);
      }
    }
    data = this.props.data;
  }

  handleError = (name) => {
    const obj = { [name]: this.props.data[name] };
    const schema = { [name]: this.props.schema[name] };

    const { error } = Joi.validate(obj, schema);
    return error ? error.details[0].message : null;
  };

  render() { return null }
}

class Error extends Component {
  static propTypes = {
    name: propTypes.string.isRequired
  };

  state = {};

  componentWillMount() {
    listeners[this.props.name] = (text) => this.setState({ error: text });
  }

  render() {
    if (this.state.error)
      return (
        <div className={"alert alert-danger mt-2 " + this.props.className} style={this.props.style} role="alert">
          {this.state.error}
        </div>
      );
    else return null;
  }
}

export { Joi, FormHandler, Error };