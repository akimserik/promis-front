import Vue from 'vue';
import VueRouter from 'vue-router';
import Dashboard from '@/views/Dashboard.vue';
import Login from '@/views/LoginUser.vue';
import Projects from '@/views/Projects.vue';
import EmployeeList from '@/views/EmployeeList.vue';
import TimesheetList from '@/views/TimesheetList.vue';
import EmployeeCard from '@/views/EmployeeCard.vue';
import store from '@/store/index';
import NotFound from '@/views/NotFound.vue';
import NetworkIssue from '@/views/NetworkIssues.vue';
import { setAuthToken } from '@/helpers/authHelpers.js';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/projects',
    name: 'Projects',
    component: Projects,
  },
  {
    path: '/employees',
    name: 'Employees',
    component: EmployeeList,
  },
  {
    path: '/timesheet',
    name: 'Timesheet',
    component: TimesheetList,
  },
  {
    path: '/employees/:id',
    name: 'EmployeeEdit',
    component: EmployeeCard,
    props: true,
    beforeEnter(routeTo, routeFrom, next) {
      setAuthToken();
      store
        .dispatch('employees/fetchEmployee', routeTo.params.id)
        .then(() => {
          next();
        })
        .catch((error) => {
          if (error.response && error.response.status == 404) {
            next({ name: '404' });
          } else {
            next({ name: 'Error' });
          }
        });
    },
  },
  {
    path: '/employees/create',
    name: 'EmployeeCreate',
    component: EmployeeCard,
    props: {
      mode: 'CreateNew',
    },
  },
  {
    path: '/404',
    name: '404',
    component: NotFound,
    props: true,
  },
  {
    path: '/network-issue',
    name: 'Error',
    component: NetworkIssue,
  },
  {
    path: '*',
    redirect: { name: '404' },
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
