import cookie from "js-cookie";
import Router from "next/router";

// save in cookie
export const setCookie = (key, value) => {
  if (process.browser) {
    // this is in next.js, to detect if it runs in browser
    // we have process.server also
    // process.browser == window
    cookie.set(key, value, {
      expires: 1,
    });
  }
};

// remove from cookie
export const removeCookie = (key) => {
  if (process.browser) {
    cookie.remove(key);
  }
};

// get from cookie such as stored token
// needed while sending requests with auth tokens
export const getCookie = (key) => {
  if (process.browser) {
    return cookie.get(key);
  }
};

// save in localStorage
export const setLocalStorage = (key, value) => {
  if (process.browser) {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

// remove from localStorage
export const removeLocalStorage = (key) => {
  if (process.browser) {
    localStorage.removeItem(key);
  }
};

// authenticate user by passing data to cookie and localStorage during signin
export const authenticate = (response, next) => {
  setCookie("token", response.data.token);
  setLocalStorage("user", response.data.user);
  next();
};

// access user info from localStorage
export const getUserInfo = () => {
  if (process.browser) {
    const cookieChecked = getCookie("token");
    if (cookieChecked) {
      if (localStorage.getItem("user")) {
        return JSON.parse(localStorage.getItem("user"));
      }
    }
  }
};

// logout
export const logout = (e) => {
  e.preventDefault();
  removeCookie("token");
  removeLocalStorage("user");
  Router.push("/login");
};
