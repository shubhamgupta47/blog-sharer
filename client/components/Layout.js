import Head from "next/head";
import Link from "next/link";
import Router from "next/router";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { getUserInfo, logout } from "../helpers/auth";

Router.onRouteChangeStart = (url) => NProgress.start();
Router.onRouteChangeComplete = (url) => NProgress.done();
Router.onRouteChangeError = (url) => NProgress.done();

const Layout = ({ children }) => {
  const loggedInUserInfo = getUserInfo();
  const head = () => (
    <Head>
      <link
        rel="stylesheet"
        href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
        integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm"
        crossOrigin="anonymous"
      />
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/nprogress/0.2.0/nprogress.min.css"
        integrity="sha512-42kB9yDlYiCEfx2xVwq0q7hT4uf26FUgSIZBK8uiaEnTdShXjwr8Ip1V4xGJMg3mHkUt9nNuTDxunHF0/EgxLQ=="
        crossOrigin="anonymous"
      />
      <link href="/static/css/styles.css" rel="stylesheet" />
    </Head>
  );

  const nav = () => (
    <ul className="nav nav-tabs bg-primary">
      <li className="nav-item">
        <Link href="/">
          <a className="nav-link text-white">Home</a>
        </Link>
      </li>
      {!loggedInUserInfo && (
        <>
          <li className="nav-item ml-auto">
            <Link href="/login">
              <a className="nav-link text-white">Login</a>
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/register">
              <a className="nav-link text-white">Register</a>
            </Link>
          </li>
        </>
      )}
      {loggedInUserInfo && loggedInUserInfo.role === "admin" && (
        <li suppressHydrationWarning={true} className="nav-item ml-auto">
          <Link href="/admin">
            <a suppressHydrationWarning={true} className="nav-link text-white">
              {loggedInUserInfo.name}
            </a>
          </Link>
        </li>
      )}
      {loggedInUserInfo && loggedInUserInfo.role === "subscriber" && (
        <li suppressHydrationWarning={true} className="nav-item ml-auto">
          <Link href="/user">
            <a suppressHydrationWarning={true} className="nav-link text-white">
              {loggedInUserInfo.name}
            </a>
          </Link>
        </li>
      )}
      {loggedInUserInfo && (
        <li className="nav-item">
          <a
            onClick={logout}
            href="#"
            className="nav-link text-white"
            suppressHydrationWarning={true}
          >
            Logout
          </a>
        </li>
      )}
    </ul>
  );

  return (
    <React.Fragment>
      {head()}
      {nav()}
      <div suppressHydrationWarning={true} className="container pt-5 pb-5">
        {children}
      </div>
    </React.Fragment>
  );
};

export default Layout;
