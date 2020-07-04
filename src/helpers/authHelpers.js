import { mapGetters } from 'vuex';

export const authComputed = {
  ...mapGetters('authUser', ['loggedIn', 'currentUser']),
};
