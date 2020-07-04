const axios = require('axios');

const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api/v1',
  withCredentials: false,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  timeout: 5000,
});

export default {
  getProjects() {
    return apiClient.get('/projects');
  },
  createNewProject(project) {
    return apiClient.post('/projects', project);
  },
  updateProject(project) {
    return apiClient.patch(`/projects/${project.id}`, project);
  },
  getEmployees() {
    return apiClient.get('/users');
  },
  setUserToken(token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  },
};
