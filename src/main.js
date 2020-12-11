import 'core-js/stable';
import '@babel/polyfill';
import Vue from 'vue';
import App from './App';
import router from './router';
import CoreuiVue from '@coreui/vue';
import { iconsSet as icons } from './assets/icons/icons.js';
import store from './store';
import VueToast from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';
import vSelect from 'vue-select';
import 'vue-select/dist/vue-select.css';
import axios from 'axios';
import { logout } from './../src/helpers/logout';


Vue.config.performance = true;
Vue.use(CoreuiVue);
Vue.use(VueToast, {
  position: 'top-right'
});
Vue.component('v-select', vSelect);
Vue.prototype.$log = console.log.bind(console);

// Register request interceptor for adding authorization token
axios.interceptors.request.use(function (config) {
  config.headers.Authorization = 'Bearer ' + store.state.token;
  return config;
});

// Register response interceptor for checking if its unauthorized and redirect to login
axios.interceptors.response.use(function (response) {
  return response;
}, function (error) {
  if (error.response && error.response.status == 401) {
    if (router.history.current.name !== 'Login') {
      logout();
      router.push({name: 'Login'})
    }
  }

  return Promise.reject(error);
});

new Vue({
  el: '#app',
  router,
  store,
  icons,
  template: '<App/>',
  components: {
    App
  }
})
