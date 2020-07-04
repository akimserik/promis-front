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
};

export const mutations = {
  SET_PROJECTS(state, projects) {
    state.projects = projects;
  },
  UPDATE_PROJECT(state, project) {
    state.projects.data.data.splice(project._id, 1, project);
  },
  ADD_PROJECT(state, project) {
    state.projects.data.data.push(project);
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
        const notification = {
          type: 'error',
          message: err.response.data.message,
        };
        dispatch('notification/add', notification, { root: true });
      });
  },
  updateProject({ commit, dispatch }, project) {
    return apiService
      .updateProject(project)
      .then(() => {
        commit('UPDATE_PROJECT', project);
        const notification = {
          type: 'success',
          message: `Project ${project.engagementCode} was updated!`,
        };
        dispatch('notification/add', notification, { root: true });
      })
      .catch((err) => {
        console.log(err.response.data.message);
      });
  },
  createProject({ commit, dispatch }, project) {
    return apiService
      .createNewProject(project)
      .then(() => {
        commit('ADD_PROJECT', project);
        const notification = {
          type: 'success',
          message: 'New project has been created!',
        };
        dispatch('notification/add', notification, { root: true });
      })
      .catch((err) => {
        const notification = {
          type: 'error',
          message: err.response.data.message,
        };
        dispatch('notification/add', notification, { root: true });
        throw err;
      });
  },
};
