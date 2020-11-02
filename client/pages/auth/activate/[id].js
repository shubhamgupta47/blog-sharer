import { useEffect, useState } from "react";
import { withRouter } from "next/router";
import jwt from "jsonwebtoken";
import axios from "axios";
import { showErrorMessage, showSuccessMessage } from "../../../helpers/alerts";
import { API } from "../../../config";
import Layout from "../../../components/Layout";

// We need parameters from the route so we have withRouter

const ActivateAccount = ({ router }) => {
  const [state, setState] = useState({
    name: "",
    token: "",
    buttonText: "Activate Account",
    success: "",
    error: "",
  });

  const { name, token, buttonText, success, error } = state;

  useEffect(() => {
    const token = router.query.id;

    if (token) {
      const { name } = jwt.decode(token);
      setState({ ...state, name, token });
    }
  }, [router.query.id]);

  const clickSubmit = async (e) => {
    e.preventDefault();
    setState({ ...state, buttonText: "Activating..." });
    try {
      const response = await axios.post(`${API}/register/activate`, { token });
      setState({
        ...state,
        name: "",
        token: "",
        buttonText: "Activated",
        success: response.data.message,
      });
    } catch (error) {
      console.error("ERROR", error);
      setState({
        ...state,
        buttonText: "Activate Account",
        error: error.response.data.error,
      });
    }
  };

  return (
    <Layout>
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <h1>
            Hi {name}, Please click on the 'Activate Account' button to activate
            the account.
          </h1>
          {success && showSuccessMessage(success)}
          {error && showErrorMessage(error)}
          <button
            className="btn btn-outline-primary btn-block"
            onClick={clickSubmit}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default withRouter(ActivateAccount);
