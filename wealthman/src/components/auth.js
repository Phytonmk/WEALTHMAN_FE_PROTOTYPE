
import { setReduxState, store } from '../redux/index';
import { api, getCookie, setCookie, setPage } from './helpers';


const auth = (callback=()=>{}) => {
  if (getCookie('accessToken')) {
    api.post('getme', {accessToken: getCookie('accessToken')})
      .then(res => {
        if (/[0-9]+/.test(res.data.usertype))
          setReduxState({user: res.data.usertype});
        callback();
      })
      .catch((e) => {
        if (e.response.status === 403) {
          setCookie('accessToken', '');
          setPage('')
        } else {
          console.log(e);
        }
        callback();
      });
  } else {
    console.log('logout');
    setReduxState({user: -1});
    callback();
  }
}

export default auth;