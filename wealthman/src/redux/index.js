import { createStore } from 'redux'

const setReduxState = (action) => {
  action = Object.assign({type: 'some-action'}, action)
  return store.dispatch(action)
};
import defaultState from './default-state';
const reducer = (state=defaultState, action) => Object.assign(state, action);
const store = createStore(reducer);

export {setReduxState, store};