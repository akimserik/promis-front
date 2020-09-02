<template>
  <v-app id="inspire">
    <v-main>
      <app-nav />
      <NotificationContainer />
      <router-view class="page" />
    </v-main>
  </v-app>
</template>

<script>
// import axios from 'axios';
import AppNav from '@/components/AppNav';
import NotificationContainer from '@/components/NotificationContainer.vue';
import { authComputed } from '@/helpers/authHelpers.js';
import { mapState } from 'vuex';

export default {
  components: { AppNav, NotificationContainer },
  computed: {
    ...authComputed,
    ...mapState(['authUser', 'authUser']),
  },
  created() {
    if (!this.loggedIn) {
      this.$router.push({ name: 'Login' });
    }
  },
};
</script>
