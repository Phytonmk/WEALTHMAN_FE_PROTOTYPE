
import axios from 'axios';
import React from 'react';
import { store, setReduxState } from '../redux';

const apiUrl = 'http://159.89.17.248:8080/api/';
// const apiUrl = 'http://localhost:8080/api/';

const api = {
  post: (url, data={}, options) => new Promise((resolve, reject) => {
    axios.post(
      apiUrl + url,
      Object.assign(data, getCookie('accessToken') ? {accessToken: getCookie('accessToken')} : {}),
      options
     ).then(resolve)
      .catch(err => {
        if (err.response === undefined)
          console.log('Connection error. Maybe server is down');
        reject(err);
      })
  }),
  get: (url, options={}) => new Promise((resolve, reject) => {
    if (options.headers === undefined)
      options.headers = getCookie('accessToken') ? {accessToken: getCookie('accessToken')} : {}
    else
      options.headers = Object.assign(options.headers, getCookie('accessToken') ? {accessToken: getCookie('accessToken')} : {})
    axios.get(
      apiUrl + url,
      options
     ).then(resolve)
      .catch(err => {
        if (err.response === undefined)
          console.log('Connection error. Maybe server is down');
        reject(err);
      })
  }),
  upload: (url, file) => new Promise((resolve, reject) => {
    const uploadUrl = apiUrl + 'photo/' + url;
    const formData = new FormData();
    formData.append('file', file)
    const config = {
      headers: {
        'content-type': 'multipart/form-data',
        'accessToken': getCookie('accessToken')
      }
    }
    axios.post(uploadUrl, formData, config)
      .then((res) => resolve(res.data))
      .catch(reject);
  }),
  imgUrl: (file) => apiUrl + 'img/' + file
};

const setCookie = (name, value, options) => {
  options = options || {};

  var expires = options.expires;

  if (typeof expires == "number" && expires) {
    var d = new Date();
    d.setTime(d.getTime() + expires * 1000);
    expires = options.expires = d;
  }
  if (expires && expires.toUTCString) {
    options.expires = expires.toUTCString();
  }

  value = encodeURIComponent(value);

  var updatedCookie = name + "=" + value;

  for (var propName in options) {
    updatedCookie += "; " + propName;
    var propValue = options[propName];
    if (propValue !== true) {
      updatedCookie += "=" + propValue;
    }
  }

  document.cookie = updatedCookie;
}

const getCookie = (name) => {
  const matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

const tryLogin = (login, password) => {
  if (typeof login === "undefined") {
    login = this.props.login;
    password = this.props.password;
  }
  axios.post(apiUrl + 'investor/login', {login, password})
    .then((res) =>{
      setCookie('accessToken', res.data.accessToken);
      setCookie('usertype', res.data.usertype);
      if (res.data.usertype == 0)
        setReduxState({
          user: 0,
          currentPage: "portfolios"
        });
      else if (res.data.usertype == 1)
        setReduxState({
          user: 1,
          currentPage: "requests"
        });
      else if (res.data.usertype == 2)
        setReduxState({
          user: 2,
          currentPage: "managers"
        });
      document.location.href = '#/' + this.props.currentPage;
    })
    .catch(console.log);
}

const setPage = (page, id) => {
  var previousPages = store.getState().previousPages.slice();
  // previousPages.push(store.getState().currentPage);
  previousPages.push(document.location.hash.substr(2)); // substr(2) to remove #/ in begining
  if (typeof id !== "undefined")
    switch (page) {
      case "manager":
        setReduxState({currentManager: id})
        break;
      case "algorythm":
        setReduxState({currentAlgorythm: id})
        break;
      case "portfolio":
        setReduxState({currentPortfolio: id})
        break;
      case "request":
        setReduxState({currentRequest: id})
        break;
    }

  setReduxState({
    currentPage: page,
    previousPages: previousPages,
    currentAccountPage: "personal",
    currentPortfoliosPage: "active",
  });
  const url = '#/' + page + (id ? '/' + id : '');
  console.log(`Moving to page ${url}`);
  document.location.href = url;
}

const newLines = (string) => {
  const paragraphs = [];
  let prevI = 0;

  for (let i = 0; i < string.length; i++) {
    if (string[i] === '\n') {
      paragraphs.push(string.slice(prevI, i));
      prevI = i;
    }
  }
  paragraphs.push(string.slice(prevI));
  const style = {color: "inherit", fontFamily: "inherit"};

  return <div style={style}>{paragraphs.map((paragraph, i) => <p style={style} key={i}>{paragraph}</p>)}</div>;
}

// const setCurrency = (event) => {
//   setReduxState({
//     currentCurrency: event.target.value,
//   });
// }
const setCurrency = (name) => {
  setReduxState({
    currentCurrency: name,
  });
}

const previousPage = () => {
  var previousPages = store.getState().previousPages.slice();
  console.log(previousPages);
  if (previousPages.length == 0)
    return;
  var currentPage = previousPages.pop();

  setReduxState({
    currentPage: currentPage,
    previousPages: previousPages
  })
  const url = '#/' + currentPage;
  console.log(`Moving to page ${url}`);
  document.location.href = url;
}

const niceNumber = (number) => {
  if (number < 10 ** 3)
    return number
  else if (number < 10 ** 9)
    return Math.round((number / (10 ** 3)) * 100) / 100 + ' Th'
  else if (number < 10 ** 12)
    return Math.round((number / (10 ** 6)) * 100) / 100 + ' Ml'
  else if (number < 10 ** 15)
    return Math.round((number / (10 ** 12)) * 100) / 100 + ' Bl'
  else if (number < 10 ** 18)
    return Math.round((number / (10 ** 15)) * 100) / 100 + ' Tr'
  else if (number < 10 ** 21)
    return Math.round((number / (10 ** 18)) * 100) / 100 + ' Qd'
  else if (number < 10 ** 24)
    return Math.round((number / (10 ** 21)) * 100) / 100 + ' Qn'
  else if (number < 10 ** 27)
    return Math.round((number / (10 ** 24)) * 100) / 100 + ' Sx'
  else
    return '∞'
}

const camelize = (string) => {
  return string
  .split(" ")
  .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
  .reduce((a, b) => a + b);
}


export { api, setCookie, getCookie, tryLogin, setPage, newLines, setCurrency, previousPage, niceNumber };
