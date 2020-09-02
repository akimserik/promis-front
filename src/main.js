import Vue from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import router from './router';
import store from './store';
import axios from 'axios';
import Vuelidate from 'vuelidate';
import amountFilter from '@/filters/amount';
import dateShort from '@/filters/dateShort';
import { setAuthToken, isAuthenticated } from '@/helpers/authHelpers.js';
import upperFirst from 'lodash/upperFirst';
import camelCase from 'lodash/camelCase';

Vue.use(Vuelidate);

Vue.filter('amount', amountFilter);
Vue.filter('dateShort', dateShort);

Vue.config.productionTip = false;

const requireComponent = require.context(
  './components',
  false,
  /Base[A-Z]\w+\.(vue|js)$/
);

requireComponent.keys().forEach((fileName) => {
  const componentConfig = requireComponent(fileName);

  const componentName = upperFirst(
    camelCase(fileName.replace(/^\.\/(.*)\.\w+$/, '$1'))
  );

  Vue.component(componentName, componentConfig.default || componentConfig);
});

new Vue({
  router,
  vuetify,
  store,
  created() {
    setAuthToken();
    if (!isAuthenticated()) {
      this.$store.dispatch('authUser/logout');
      delete axios.defaults.headers.common['Authorization'];
    }
    axios.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        if (error.response.status === 401) {
          this.$store.dispatch('authUser/logout');
          delete axios.defaults.headers.common['Authorization'];
        }
        return Promise.reject(error);
      }
    );
  },
  render: (h) => h(App),
}).$mount('#app');
