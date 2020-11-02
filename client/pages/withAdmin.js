import axios from "axios";
import { getCookie } from "../helpers/auth";
import { API } from "../config";

const withAdmin = (Page) => {
  const WithAdminUser = (props) => <Page {...props} />;

  WithAdminUser.getInitialProps = async (context) => {
    const token = getCookie("token", context.req);

    let admin = null;
    if (token) {
      try {
        const response = await axios(`${API}/admin`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        admin = response.data;
      } catch (error) {
        if (error.response.status === 401) {
          admin = null;
        }
      }
    }

    if (admin === null) {
      // redirect
      context.res.writeHead(302, {
        Location: "/",
      });
      context.res.end();
    } else {
      return {
        ...(Page.getInitialProps ? await Page.getInitialProps(context) : {}),
        admin,
        token,
      };
    }
  };

  return WithAdminUser;
};

export default withAdmin;
