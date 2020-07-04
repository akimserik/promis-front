<template>
  <div>
    <v-app-bar app color="indigo" dark>
      <v-app-bar-nav-icon v-if="loggedIn" @click.stop="drawer = !drawer" />
      <v-toolbar-title>{{ $route.name }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn v-if="loggedIn" text small class="button">
        {{
        currentUser.user.name
        }}
      </v-btn>
      <v-btn v-if="loggedIn" text small class="button" @click="logout">Logout</v-btn>
      <v-btn v-else to="/login" text small class="button">Login</v-btn>
    </v-app-bar>

    <v-navigation-drawer v-if="loggedIn" v-model="drawer" app>
      <v-list dense>
        <v-list-item>
          <v-img class="mx-2" src="@/assets/logo.svg" max-width="150"></v-img>
        </v-list-item>
        <v-list-item>
          <v-divider></v-divider>
        </v-list-item>
        <v-list-item link to="/">
          <v-list-item-action>
            <v-icon>mdi-home</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Dashboard</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item link to="/projects">
          <v-list-item-action>
            <v-icon>mdi-contacts</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Projects</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item link to="/employees">
          <v-list-item-action>
            <v-icon>mdi-teach</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Employees</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item link to="/timesheet">
          <v-list-item-action>
            <v-icon>mdi-mail</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Timesheet</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
import { authComputed } from '@/helpers/authHelpers.js';

export default {
  components: {},
  props: {
    source: String,
  },
  data: () => ({
    drawer: null,
  }),
  computed: {
    ...authComputed,
  },
  methods: {
    logout() {
      this.$store.dispatch('authUser/logout');
    },
  },
};
</script>
