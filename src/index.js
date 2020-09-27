import React, { useRef, useMemo, Component } from 'react'
import propTypes from "prop-types"
import Joi from "joi-browser";

const useFormHandler = (schema, data, translator = x => x) => {
  const prevData = useRef({});
  const prevErrors = useRef({});

  const handleError = (name) => {
    const current = { [name]: data[name] };
    const correct = { [name]: schema[name] };

    const { error } = Joi.validate(current, correct);
    return error ? translator(error.details[0].message) : null;
  };

  const errors = useMemo(() => {
    for (const name in data) {
      if (data[name] !== prevData.current[name]) {
        const error = handleError(name);
        prevErrors.current[name] = error;
      } else
        prevErrors.current[name] = prevErrors.current[name];
    }
    prevData.current = data;
    return prevErrors.current;
  }, [...Object.values(data)]);

  const checkErrors = () => {
    for (const error of Object.values(errors))
      if (error) return true;
    return false;
  }

  const Error = (props) => {
    const style = props.withStyle ? {
      position: "relative",
      padding: ".75rem 1.25rem",
      marginBottom: "1rem",
      border: "1px solid transparent",
      borderRadius: ".25rem",
      color: "#721c24",
      backgroundColor: "#f8d7da",
      borderColor: "#f5c6cb",
      marginTop: ".5rem",
      ...props.style
    } : props.style;

    if (errors[props.name]) {
      return (
        <div className={props.className} style={style} role="alert">
          {errors[props.name]}
        </div>
      );
    }
    return null;
  }
  Error.propTypes = {
    name: propTypes.string.isRequired,
    withStyle: propTypes.string,
    style: propTypes.string,
    className: propTypes.string
  };

  return { errors, checkErrors, Error };
}


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
    name: propTypes.string.isRequired,
    withStyle: propTypes.string,
    style: propTypes.string,
    className: propTypes.string
  };

  state = {
    error: null
  };

  style = this.props.withStyle ? {
    position: "relative",
    padding: ".75rem 1.25rem",
    marginBottom: "1rem",
    border: "1px solid transparent",
    borderRadius: ".25rem",
    color: "#721c24",
    backgroundColor: "#f8d7da",
    borderColor: "#f5c6cb",
    marginTop: ".5rem",
    ...this.props.style
  } : this.props.style;

  constructor(props) {
    super(props);
    listeners[this.props.name] = (text) => this.setState({ error: text });
  }

  render() {
    if (this.state.error)
      return (
        <div className={this.props.className} style={this.style} role="alert">
          {this.state.error}
        </div>
      );
    else return null;
  }
}


export { Joi, FormHandler, Error, useFormHandler };