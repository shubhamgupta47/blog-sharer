import { useState } from "react";
import Layout from "../components/Layout";

const Register = () => {
  const [state, setState] = useState({
    name: "",
    email: "",
    password: "",
    error: "",
    success: "",
    buttonText: "Register",
  });

  const { name, email, password, error, success, buttonText } = state;

  const handleChange = () => (e) => {
    const { target } = e;
    setState({
      ...state,
      [target.name]: target.value,
      error: "",
      success: "",
      buttonText: "Register",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.table(state);
    //
  };

  const registrationForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <input
          value={name}
          onChange={handleChange()}
          type="text"
          name="name"
          className="form-control"
          placeholder="Type your name"
        />
      </div>
      <div className="form-group">
        <input
          value={email}
          onChange={handleChange()}
          type="email"
          name="email"
          className="form-control"
          placeholder="Type Email"
        />
      </div>
      <div className="form-group">
        <input
          value={password}
          onChange={handleChange()}
          type="password"
          name="password"
          className="form-control"
          placeholder="Enter password here"
        />
      </div>
      <div className="form-group">
        <button className="btn btn-outline-dark">{buttonText}</button>
      </div>
    </form>
  );

  return (
    <Layout>
      <div className="col-md-6 offset-md-3">
        <h1>Register</h1>
        <br />
        {registrationForm()}
        <hr />
        {JSON.stringify(state)}
      </div>
    </Layout>
  );
};

export default Register;
