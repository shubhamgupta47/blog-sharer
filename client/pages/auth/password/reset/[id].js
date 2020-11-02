import { useEffect, useState } from "react";
import { withRouter } from "next/router";
import axios from "axios";
import jwt from "jsonwebtoken";
import {
  showErrorMessage,
  showSuccessMessage,
} from "../../../../helpers/alerts";
import { API } from "../../../../config";
import Layout from "../../../../components/Layout";

const ResetPassword = ({ router }) => {
  const [state, setState] = useState({
    name: "",
    token: "",
    newPassword: "",
    buttonText: "Reset Password",
    success: "",
    error: "",
  });

  const { newPassword, name, token, buttonText, success, error } = state;

  useEffect(() => {
    const token = router.query.id;
    const decoded = jwt.decode(router.query.id);
    if (decoded) {
      setState({ ...state, name: decoded.name, token });
    }
  }, [router]);

  const handleChange = (e) => {
    setState({ ...state, newPassword: e.target.value, success: "", error: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setState({
      ...state,
      buttonText: "Updating...",
    });
    try {
      const response = await axios.put(`${API}/reset-password`, {
        resetPasswordLink: token,
        newPassword,
      });
      console.log("RESPONSE", response);
      setState({
        ...state,
        newPassword: "",
        success: response.data.message,
        error: "",
        buttonText: "Done",
      });
    } catch (error) {
      error.response &&
        setState({
          ...state,
          newPassword: "",
          buttonText: "Reset Password",
          error: error.response.data.error,
        });
      console.error("ERROR:", error.response);
    }
  };

  const resetPasswordForm = () => {
    return (
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="password"
            className="form-control"
            onChange={handleChange}
            value={newPassword}
            placeholder="Type your new password..."
            required
          />
        </div>
        <div>
          <button className="btn btn-outline-primary">{buttonText}</button>
        </div>
      </form>
    );
  };

  return (
    <Layout>
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <h1>{name && `${name},`} Reset Password</h1>
          {success && showSuccessMessage(success)}
          {error && showErrorMessage(error)}
          {resetPasswordForm()}
        </div>
      </div>
    </Layout>
  );
};

export default withRouter(ResetPassword);
