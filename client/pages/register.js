import { useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import { showErrorMessage, showSuccessMessage } from "../helpers/alerts";

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
    setState({ ...state, buttonText: "Registering" });
    axios
      .post("http://localhost:8000/api/register", {
        name,
        email,
        password,
      })
      .then((res) => {
        setState({
          ...state,
          name: "",
          email: "",
          password: "",
          error: "",
          success: res.data.message,
          buttonText: "Submitted",
        });
      })
      .catch((err) => {
        setState({
          ...state,
          error: err.response.data.error,
          buttonText: "Register",
        });
      });
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
        <button className="btn btn-outline-primary">{buttonText}</button>
      </div>
    </form>
  );

  return (
    <Layout>
      <div className="col-md-6 offset-md-3">
        <h1>Register</h1>
        <br />
        {success && showSuccessMessage(success)}
        {error && showErrorMessage(error)}
        {registrationForm()}
        <hr />
      </div>
    </Layout>
  );
};

export default Register;
