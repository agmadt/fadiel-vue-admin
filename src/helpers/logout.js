import store from '../store';
import { baseURL } from './../helpers/url';

const logout = function() {
  window.localStorage.setItem('fadiel', JSON.stringify({
    authenticated: false,
    user: {},
    token: null,
    baseURL: baseURL
  }));

  store.commit('set', ['authenticated', false])
  store.commit('set', ['user', {}])
  store.commit('set', ['token', null])
  store.commit('set', ['copiedFromLocalStorage', true])
}

export { logout }