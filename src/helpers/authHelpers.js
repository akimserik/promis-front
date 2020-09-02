import store from '@/store/index';
import jwt from 'jsonwebtoken';
import { mapGetters } from 'vuex';

export const authComputed = {
  ...mapGetters('authUser', ['loggedIn', 'currentUser', 'tokenExpired']),
};

export function setAuthToken() {
  const userString = localStorage.getItem('user');
  if (userString) {
    const userData = JSON.parse(userString);
    store.commit('authUser/SET_USER_DATA', userData);
  }
}

export function isAuthenticated() {
  const userString = localStorage.getItem('user');

  if (userString) {
    const userObj = JSON.parse(userString);
    const { exp } = jwt.decode(userObj.token);
    if (exp > (new Date().getTime() + 1) / 1000) {
      return true;
    }
  }
  return false;
}
