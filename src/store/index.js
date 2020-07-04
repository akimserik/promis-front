import Vue from 'vue';
import Vuex from 'vuex';
import * as projects from '@/store/modules/ProjectStore.js';
import * as authUser from '@/store/modules/AuthStore.js';
import * as employees from '@/store/modules/EmployeesStore.js';
import * as notification from '@/store/modules/NotificationStore.js';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: { projects, authUser, employees, notification },
});
