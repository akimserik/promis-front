// import axios from 'axios';
import apiService from '@/services/apiService.js';
import jwt from 'jsonwebtoken';

export const namespaced = true;

export const state = {
  user: null,
};

export const mutations = {
  SET_USER_DATA(state, userData) {
    state.user = userData;
    localStorage.setItem('user', JSON.stringify(userData));
    // axios.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
    apiService.setUserToken(userData.token);
  },
  CLEAR_USER_DATA() {
    if (localStorage.getItem('user')) {
      localStorage.removeItem('user');
      location.reload();
      apiService.clearAuthHeader();
      // delete axios.defaults.headers.common['Authorization'];
    }
  },
};

export const actions = {
  login({ commit }, credentials) {
    return apiService.login(credentials).then(({ data }) => {
      commit('SET_USER_DATA', data);
    });
  },
  logout({ commit }) {
    commit('CLEAR_USER_DATA');
  },
};

export const getters = {
  loggedIn(state) {
    return !!state.user;
  },
  currentUser(state) {
    if (state.user) {
      return state.user.data;
    }
    return state.user;
  },
  tokenExpired(state) {
    if (state.user) {
      const { exp } = jwt.decode(state.user.token);
      if (exp < (new Date().getTime() + 1) / 1000) {
        return true;
      }
    }
    return false;
  },
};
