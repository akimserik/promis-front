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
  employee: {},
};

export const mutations = {
  SET_EMPLOYEES(state, employees) {
    state.employees = employees;
  },
  SET_EMPLOYEE(state, employee) {
    state.employee = employee.data;
  },
  CLEAR_EMPLOYEE(state) {
    state.employee = {};
  },
  UPDATE_EMPLOYEE(state, employee) {
    state.employees.data.data.splice(
      state.employees.data.data.findIndex(
        (el) => String(el.id) == String(employee.id)
      ),
      1,
      employee
    );
  },
  ADD_EMPLOYEE(state, employee) {
    state.employees.data.data.push(employee);
  },
};

export const actions = {
  fetchEmployees({ commit, dispatch }) {
    return apiService
      .getEmployees()
      .then((response) => {
        commit('SET_EMPLOYEES', response.data);
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
  fetchEmployee({ commit, dispatch }, employee) {
    return apiService
      .getOneEmployee(employee)
      .then((response) => {
        commit('SET_EMPLOYEE', response.data);
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
  clearCurrentEmployee({ commit }) {
    commit('CLEAR_EMPLOYEE');
  },
  updateEmployee({ commit, dispatch }, employee) {
    return apiService
      .updateEmployee(employee)
      .then(() => {
        commit('UPDATE_EMPLOYEE', employee);
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
  createEmployee({ commit, dispatch }, employee) {
    return apiService
      .createNewEmployee(employee)
      .then(() => {
        commit('ADD_EMPLOYEE', employee);
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
