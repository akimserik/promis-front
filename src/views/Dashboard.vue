<template>
  <v-container fluid v-if="loggedIn">
    <v-row>
      <v-col>
        <v-card>
          <v-card-title>My Info</v-card-title>
          <v-card-text>
            <v-row>
              <v-col>
                <p class="body-2">
                  <span class="font-weight-bold">Name: </span>
                  {{ currentUser.user.firstName }}
                  {{ currentUser.user.lastName }}
                </p>
                <p class="body-2">
                  <span class="font-weight-bold">Position: </span>
                  {{ currentUser.user.position }}
                </p>
                <p class="body-2">
                  <span class="font-weight-bold">Department: </span>
                  {{ currentUser.user.department }}
                </p>
              </v-col>
              <v-col>
                <p class="body-2">
                  <span class="font-weight-bold">Office: </span>
                  {{ currentUser.user.office }}
                </p>
                <p class="body-2">
                  <span class="font-weight-bold">Hired date: </span>
                  {{ hiredDate }}
                </p>
                <p class="body-2">
                  <span class="font-weight-bold">System role: </span>
                  {{ currentUser.user.role }}
                </p>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col v-for="statistic in statistics" :key="`${statistic.title}`">
        <StatisticCard :statistic="statistic" />
      </v-col>
    </v-row>

    <MyProjects :currentUser="currentUser.user"> </MyProjects>

    <!-- <v-row>
      <v-col v-for="sale in sales" :key="`${sale.title}`">
        <SalesGraph :sale="sale" />
      </v-col>
    </v-row> -->
  </v-container>
</template>

<script>
import { mapState } from 'vuex';
import { authComputed } from '@/helpers/authHelpers.js';

//import SalesGraph from '../components/SalesGraph';
import StatisticCard from '../components/StatisticCard';
import MyProjects from '../components/MyProjects';

import salesData from '../data/sales.json';
import statisticsData from '../data/statistics.json';

import { dateToLocalFormat } from '@/plugins/dateConverter.js';

export default {
  name: 'DashboardPage',
  components: {
    //SalesGraph,
    StatisticCard,
    MyProjects,
  },
  data() {
    return {
      sales: salesData,
      statistics: statisticsData,
    };
  },
  created() {
    this.$store.dispatch('employees/fetchEmployees', this.userToken);
  },
  computed: {
    ...mapState(['authUser']),
    ...authComputed,
    userToken() {
      const token = localStorage.getItem('user')
        ? this.authUser.user.token
        : '';
      return token;
    },
    hiredDate() {
      return dateToLocalFormat(this.currentUser.user.hiredDate);
    },
  },
};
</script>
