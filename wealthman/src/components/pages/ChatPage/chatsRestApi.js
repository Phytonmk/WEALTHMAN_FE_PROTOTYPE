import axios from 'axios'

const apiUrl = 'http://localhost:1234/chats-api/';

import { getCookie } from '../../helpers';

const api = {};


api.post = (url, data, options) => axios.post(apiUrl + url, data, Object.assign(options, {headers: {accessToken: getCookie('accessToken')}}));
api.get = (url, data, options) => axios.post(apiUrl + url, Object.assign(options, {params: data, headers: {accessToken: getCookie('accessToken')}}));

export default api;