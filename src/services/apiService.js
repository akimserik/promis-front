const axios = require('axios');
import store from '@/store';

const apiClient = axios.create({
  // baseURL: 'http://localhost:3000/api/v1',
  baseURL: 'api/v1',
  withCredentials: false,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  timeout: 5000,
});

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.log(error);
    if (error.response.status === 401) {
      store.dispatch('authUser/logout');
      delete axios.defaults.headers.common['Authorization'];
    }
    return Promise.reject(error);
  }
);

export default {
  login(credentials) {
    return apiClient.post('/users/login', credentials);
  },
  getProjects() {
    return apiClient.get('/projects');
  },
  getMyProjects() {
    return apiClient.get('/projects/my-projects');
  },
  createNewProject(project) {
    return apiClient.post('/projects', project);
  },
  updateProject(project) {
    return apiClient.patch(`/projects/${project._id}`, project);
  },
  getEmployees() {
    return apiClient.get('/users');
  },
  getOneEmployee(employee) {
    return apiClient.get(`/users/${employee}`);
  },
  createNewEmployee(employee) {
    return apiClient.post('/users', employee);
  },
  updateEmployee(employee) {
    return apiClient.patch(`/users/${employee._id}`, employee);
  },
  setUserToken(token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  },
  clearAuthHeader() {
    delete apiClient.defaults.headers.common['Authorization'];
  },
  getTimesheet() {
    return apiClient.get(`/timesheets/my-stats`);
  },
  updateTimesheet(timesheet) {
    return apiClient.patch(`/timesheets/${timesheet.doc_id}`, timesheet);
  },
  createTimesheet(timesheet) {
    return apiClient.post('/timesheets', timesheet);
  },
  deleteTimesheet(timesheet) {
    return apiClient.delete(`/timesheets/${timesheet.doc_id}`);
  },
};
