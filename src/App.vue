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
import AppNav from '@/components/AppNav';
import NotificationContainer from '@/components/NotificationContainer.vue';
import { authComputed } from '@/helpers/authHelpers.js';

export default {
  components: { AppNav, NotificationContainer },
  computed: {
    ...authComputed,
  },
  created() {
    if (!this.loggedIn && !(this.$route.name === 'Login'))
      this.$router.push({ name: 'Login' });
  },
};
</script>
