import React, { Component } from 'react'
import { Joi, FormHandler, checkErrors, takeErrors } from 'react-form-error'

export default class App extends Component {
  state = {
    name: "",
    nameError: false
  };

  schema = {
    name: Joi.string().required()
  };

  handleChange = async (event) => {
    await this.setState({ name: event.target.value });

    const errors = takeErrors();
    this.setState({ nameError: errors["name"] });
  }

  handleSubmit = () => {
    const isError = checkErrors();

    if (!isError)
      alert("Successful form operation");
  };

  render() {
    return (
      <React.Fragment>
        <div className="form-group">
          <input onChange={this.handleChange} type="name" className="form-control" placeholder="Enter your name" />
          <span className={`${this.state.nameError ? "d-block" : "d-none"}`}>Error!!!</span>
        </div>
        <button onClick={this.handleSubmit} className="btn btn-primary">Submit</button>

        <FormHandler schema={this.schema} data={{ name: this.state.name }} />
      </React.Fragment>
    );
  }
}