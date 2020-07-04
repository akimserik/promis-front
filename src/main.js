import Vue from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import router from './router';
import store from './store';
import axios from 'axios';
import Vuelidate from 'vuelidate';
import amountFilter from '@/filters/amount';

Vue.use(Vuelidate);

Vue.filter('amount', amountFilter);

Vue.config.productionTip = false;

new Vue({
  router,
  vuetify,
  store,
  created() {
    const userString = localStorage.getItem('user');

    if (userString) {
      const userData = JSON.parse(userString);
      this.$store.commit('authUser/SET_USER_DATA', userData);
    }
    axios.interceptors.response.use(
      (response) => response,
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
