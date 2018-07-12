
import { setReduxState, store } from '../redux/index';
import { api, getCookie, setCookie, setPage } from './helpers';


const auth = () => {
  if (getCookie('accessToken')) {
    api.post('getme', {accessToken: getCookie('accessToken')})
      .then(res => {
        if (/[0-9]+/.test(res.data.usertype))
          setReduxState({user: res.data.usertype});
      })
      .catch((e) => {
        if (e.response.status === 403) {
          setCookie('accessToken', '');
          document.location.href = '#';
        } else {
          console.log(e);
        }
      });
  } else {
    console.log('logout');
    setReduxState({user: -1});
  }
}

export default auth;