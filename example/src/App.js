import React, { Component } from 'react'
import { Joi, FormHandler, Error } from 'react-form-error'

class App extends Component {
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

  render() {
    return (
      <div className="container col-md-8 col-lg-4 text-center" style={{ marginTop: 120 }}>
        <div className="form-group">
          <input onChange={this.handleChange} type="email" className="form-control" placeholder="Enter email" />
          <Error name="email" />
        </div>
        <div className="form-group">
          <input onChange={this.handleChange} type="password" className="form-control" placeholder="Password" />
          <Error name="password" />
        </div>
        <button onClick={this.handleSubmit} className="btn btn-primary">Submit</button>

        <FormHandler schema={this.schema} data={{ email: this.state.email, password: this.state.password }} translator={this.translator} />
      </div>
    );
  }
}

export default App
