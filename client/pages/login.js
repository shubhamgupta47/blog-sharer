import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import Router from "next/router";

// Relative imports
import Layout from "../components/Layout";
import { showErrorMessage, showSuccessMessage } from "../helpers/alerts";
import { API } from "../config";
import { authenticate, getUserInfo } from "../helpers/auth";

const redirectTo = () => {
  const isAuth = getUserInfo();
  if (isAuth) {
    return isAuth.role === "admin"
      ? Router.push("/admin")
      : Router.push("/user");
  }
  return;
};

const Login = () => {
  const [state, setState] = useState({
    email: "",
    password: "qwertyuiop",
    error: "",
    success: "",
    buttonText: "Login",
  });

  useEffect(() => {
    redirectTo();
  }, []);

  const isAuth = getUserInfo();

  const { email, password, error, success, buttonText } = state;

  const handleChange = () => (e) => {
    const { target } = e;
    setState({
      ...state,
      [target.name]: target.value,
      error: "",
      success: "",
      buttonText: "Login",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setState({ ...state, buttonText: "Logging in..." });
    axios
      .post(`${API}/login`, {
        email,
        password,
      })
      .then((res) => {
        authenticate(res, () => {
          redirectTo();
        });
      })
      .catch((err) => {
        setState({
          ...state,
          error: err.response.data.error,
          buttonText: "Login",
        });
      });
    //
  };

  const loginForm = () => (
    <form onSubmit={handleSubmit}>
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
      <hr />
      <div className="form-group">
        <button className="btn btn-outline-primary">{buttonText}</button>
      </div>
    </form>
  );

  return (
    <Layout>
      {process.browser && !isAuth && (
        <div className="col-md-6 offset-md-3">
          <h1>Login</h1>
          <br />
          {success && showSuccessMessage(success)}
          {error && showErrorMessage(error)}
          {loginForm()}
        </div>
      )}
    </Layout>
  );
};

export default Login;
