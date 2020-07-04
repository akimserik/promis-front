import apiService from '@/services/apiService.js';

export const namespaced = true;

export const state = {
  employees: {
    data: {
      data: [],
    },
    requestedAt: Date,
    results: 0,
    status: '',
  },
};

export const mutations = {
  SET_EMPLOYEES(state, employees) {
    state.employees = employees;
  },
};

export const actions = {
  fetchEmployees({ commit }) {
    return apiService
      .getEmployees()
      .then((response) => {
        commit('SET_EMPLOYEES', response.data);
      })
      .catch((err) => {
        console.log(err.response.data.message);
      });
  },
};
