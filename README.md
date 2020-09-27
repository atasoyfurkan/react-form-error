# react-form-error

> Simple React error handler hook and class component for validation of form operations 


[![NPM](https://img.shields.io/npm/v/react-form-error.svg)](https://www.npmjs.com/package/react-form-error) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

![NPM](https://raw.githubusercontent.com/atasoyfurkan/react-form-error/master/demo.gif)

> react-form-error allow you to use joi and bootstrap alert and handle form errors in your app with ease.

## Install

```bash
npm install --save react-form-error
```

## Usage

## HOOK

### Example 1
``` jsx

import React, { useState } from "react";
import { useFormHandler, Joi } from "react-form-error"

const schema = {
  email: Joi.string().email().required(),
};

const App = () => {
  const [email, setEmail] = useState("");

  const { errors, Error, checkErrors } = useFormHandler(schema, { email });

  const handleSubmit = () => {
    const isError = checkErrors();

    if (!isError) alert("Successfull Auth");
  }

  return (
    <>
      <div className="form-group">
        <input onChange={(e) => setEmail(e.target.value)} type="email" className="form-control" placeholder="Enter your email" />
        <Error name="email" withStyle />
      </div>
      <button onClick={handleSubmit} className="btn btn-primary">Submit</button>
    </>
  );
}
export default App;
```

### Example 2
```jsx
import React, { useState } from "react";
import { useFormHandler, Joi } from "react-form-error"

const schema = {
  email: Joi.string().email().required(),
  password: Joi.string().required().min(2)
};

const translator = (error) => {
  if (error === '"password" is not allowed to be empty')
    return "Don't leave it blank"
  if (error === '"email" must be a valid email')
    return "Put a valid email!"

  return error;
}

const App = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { errors, Error, checkErrors } = useFormHandler(schema, { email, password }, translator);

  console.log(errors);

  const handleSubmit = () => {
    const isError = checkErrors();

    if (!isError) alert("Successfull Auth");
  }

  return (
    <>
      <div className="form-group">
        <input onChange={(e) => setEmail(e.target.value)} type="email" className="form-control" placeholder="Enter your email" />
        <Error name="email" withStyle />
        <input onChange={(e) => setPassword(e.target.value)} type="password" className="form-control" placeholder="Enter your password" />
        <Error name="password" withStyle />
      </div>
      <button onClick={handleSubmit} className="btn btn-primary">Submit</button>
    </>
  );
}
export default App;
```

## CLASS COMPONENT

### Example 1
```jsx
import React, { Component } from 'react'
import { Joi, FormHandler, Error } from 'react-form-error'

export default class App extends Component {
  state = {
    name: "",
  };

  schema = {
    name: Joi.string().required()
  };

  handleChange = (event) => {
    this.setState({ name: event.target.value });
  }

  handleSubmit = () => {
    const isError = FormHandler.checkError();

    if (!isError)
      alert("Successful form operation");
  };

  render() {
    return (
      <React.Fragment>
        <div className="form-group">
          <input onChange={this.handleChange} type="name" className="form-control" placeholder="Enter your name" />
          <Error name="name" withStyle />
        </div>
        <button onClick={this.handleSubmit} className="btn btn-primary">Submit</button>

        <FormHandler schema={this.schema} data={{ name: this.state.name }} />
      </React.Fragment>
    );
  }
}
```

### Example 2
```jsx
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
```

### Take errors manually with class copmonent
If you want to customize error component or don't want to render at all. You can take errors manually.

### Example Code
```jsx
import React, { Component } from 'react'
import { Joi, FormHandler } from 'react-form-error'

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

    const errors = FormHandler.takeErrors();
    this.setState({ nameError: errors["name"] });
  }

  handleSubmit = () => {
    const isError = FormHandler.checkError();

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
```

## Demo
[Demo](https://atasoyfurkan.github.io/react-form-error/)


## Example Code
[example-github](https://github.com/atasoyfurkan/react-form-error/tree/master/example)


## API
### Form Handler
<table>
  <tr>
    <th>Props</th>
    <th>Type</th>
    <th>Default</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>schema</td>
    <td>object</td>
    <td>-</td>
    <td>Joi schema for describing input data</td>    
  </tr>
  <tr>
    <td>data</td>
    <td>object</td>
    <td>-</td>
    <td>Input data</td>
  </tr>
  <tr>
    <td>translator</td>
    <td>function</td>
    <td>-</td>
    <td>A pipe function to translate Joi default error to whatever you like</td>
  </tr>
</table>

### Error
<table>
  <tr>
    <th>Props</th>
    <th>Type</th>
    <th>Default</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>name</td>
    <td>string</td>
    <td>-</td>
    <td>A data name to indicate that which error of input data will shown in the alert box</td>    
  </tr>
    <tr>
    <td>className</td>
    <td>string</td>
    <td>-</td>
    <td>Add CSS classes</td>    
  </tr>
    <tr>
    <td>style</td>
    <td>string</td>
    <td>-</td>
    <td>Add style</td>    
  </tr>
      <tr>
    <td>withStyle</td>
    <td>boolean</td>
    <td>false</td>
    <td>Add bootstrap alert style to error component</td>    
  </tr>
</table>

className and style properties can be used like a regular html tag.

### JOI
For more information about validation and schema options go to [joi-browser page](https://www.npmjs.com/package/joi-browser) 

## License

MIT © [github.com/atasoyfurkan](https://github.com/github.com/atasoyfurkan)
