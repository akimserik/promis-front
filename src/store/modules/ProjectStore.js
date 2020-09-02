import apiService from '@/services/apiService.js';

export const namespaced = true;

export const state = {
  projects: {
    data: {
      data: [],
    },
    requestedAt: Date,
    results: 0,
    status: '',
  },
  myProjects: {
    data: {
      data: [],
    },
    requestedAt: Date,
    results: 0,
    status: '',
  },
};

export const mutations = {
  SET_PROJECTS(state, projects) {
    state.projects = projects;
  },
  UPDATE_PROJECT(state, project) {
    state.projects.data.data.splice(
      state.projects.data.data.findIndex((el) => el.id == project.id),
      1,
      project
    );
  },
  ADD_PROJECT(state, project) {
    state.projects.data.data.push(project);
  },
  SET_MY_PROJECTS(state, projects) {
    state.myProjects = projects;
  },
};

export const actions = {
  fetchProjects({ commit, dispatch }) {
    return apiService
      .getProjects()
      .then((response) => {
        commit('SET_PROJECTS', response.data);
      })
      .catch((err) => {
        const message = err.response ? err.response.data.message : err;
        const notification = {
          type: 'error',
          message: message,
        };
        dispatch('notification/add', notification, { root: true });
        throw err;
      });
  },
  fetchMyProjects({ commit, dispatch }) {
    return apiService
      .getMyProjects()
      .then((response) => {
        commit('SET_MY_PROJECTS', response.data.data);
      })
      .catch((err) => {
        const message = err.response ? err.response.data.message : err;
        const notification = {
          type: 'error',
          message: message,
        };
        dispatch('notification/add', notification, { root: true });
        throw err;
      });
  },
  updateProject({ commit, dispatch }, project) {
    return apiService
      .updateProject(project)
      .then(() => {
        commit('UPDATE_PROJECT', project);
      })
      .catch((err) => {
        const message = err.response ? err.response.data.message : err;
        const notification = {
          type: 'error',
          message: message,
        };
        dispatch('notification/add', notification, { root: true });
        throw err;
      });
  },
  createProject({ commit, dispatch }, project) {
    return apiService
      .createNewProject(project)
      .then(() => {
        commit('ADD_PROJECT', project);
      })
      .catch((err) => {
        const message = err.response ? err.response.data.message : err;
        const notification = {
          type: 'error',
          message: message,
        };
        dispatch('notification/add', notification, { root: true });
        throw err;
      });
  },
};
