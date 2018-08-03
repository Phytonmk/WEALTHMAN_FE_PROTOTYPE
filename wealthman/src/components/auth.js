
import { setReduxState, store } from '../redux/index'

import { api, getCookie, setCookie, setPage } from './helpers'

const authEvent = new Event('auth completed')

const auth = (callback=()=>{}) => {
  if (getCookie('accessToken')) {
    api.post('getme', {accessToken: getCookie('accessToken')})
      .then(res => {
        if (/[0-9]+/.test(res.data.usertype))
          setReduxState({user: res.data.usertype, userData: res.data.userData || {}})
        console.log(true)
        callback(true)
        window.dispatchEvent(authEvent)
      })
      .catch((e) => {
        if (e.response && e.response.status === 401) {
          if (confirm('Seems like you haven\'t confirmed you email\nLog out?')) {
            setCookie('accessToken', '')
            setCookie('usertype', '')
            setPage('')
          }
        }
        if (e.response && e.response.status === 403) {
          setCookie('accessToken', '')
          setCookie('usertype', '')
          setPage('')
        } else {
          callback(false)
          console.log(e)
        }
        callback(false)
        window.dispatchEvent(authEvent)
      })
  } else {
    console.log('logout')
    setReduxState({user: -1})
    callback(false)
    window.dispatchEvent(authEvent)
  }
}

export default auth