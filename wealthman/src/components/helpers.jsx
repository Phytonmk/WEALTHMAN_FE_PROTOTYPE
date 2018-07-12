
import axios from 'axios';
import React from 'react';
import { store, setReduxState } from '../redux';

const apiUrl = 'http://localhost:8080/api/';

const api = {
  post: (url, data={}, options) => axios.post(apiUrl + url, Object.assign(data, getCookie('accessToken') ? {accessToken: getCookie('accessToken')} : {}), options),
  get: (url, data={}, options) => axios.get(apiUrl + url, Object.assign(data, getCookie('accessToken') ? {accessToken: getCookie('accessToken')} : {}), options),
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
      .then((res) => resolve(apiUrl + 'img/' + res.data))
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
  axios.post('http:\/\/localhost:8080/api/investor/login', {login, password})
    .then((res) =>{
      setCookie('accessToken', res.data.accessToken);
      setCookie('usertype', res.data.usertype);
      console.log(res.data);
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
  var prevousPages = store.getState().prevousPages.slice();
  prevousPages.push(store.getState().currentPage);
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
    prevousPages: prevousPages,
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

const setCurrency = (event) => {
  setReduxState({
    currentCurrency: event.target.value,
  });
}

const prevousPage = () => {
  var prevousPages = store.getState().prevousPages.slice();
  if (prevousPages.length == 0)
    return;
  var currentPage = prevousPages.pop();

  setReduxState({
    currentPage: currentPage,
    prevousPages: prevousPages
  })
}

export { api, setCookie, getCookie, tryLogin, setPage, newLines, setCurrency, prevousPage};