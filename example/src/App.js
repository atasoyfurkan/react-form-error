import React, { Component } from 'react'
import { Joi, FormHandler, Error } from 'react-form-error'

export default class App extends Component {
  state = {
    email: "",
    password: ""
  };

  schema = {
    email: Joi.string()
      .required()
      .email(),
    password: Joi.string()
      .required()
      .min(5)
  };

  handleChange = (event) => {
    this.setState({ [event.target.type]: event.target.value });
  }

  handleSubmit = () => {
    const isError = FormHandler.checkError();

    if (!isError)
      alert("Successful auth");
  };

  translator = (error) => {
    if (error === '"password" is not allowed to be empty')
      return "Don't leave it blank"
    if (error === '"email" must be a valid email')
      return "Put a valid email!"

    return error;
  }

  render() {
    return (
      <div className="container col-md-8 col-lg-4 text-center" style={{ marginTop: 120 }}>
        <div className="form-group">
          <input onChange={this.handleChange} type="email" className="form-control" placeholder="Enter email" />
          <Error name="email" withStyle />
        </div>
        <div className="form-group">
          <input onChange={this.handleChange} type="password" className="form-control" placeholder="Password" />
          <Error name="password" withStyle />
        </div>
        <button onClick={this.handleSubmit} className="btn btn-primary">Submit</button>

        <FormHandler schema={this.schema} data={{ email: this.state.email, password: this.state.password }} translator={this.translator} />
      </div>
    );
  }
}

