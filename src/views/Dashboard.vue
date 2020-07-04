<template>
  <v-container v-if="loggedIn">
    <v-row>
      <v-col v-for="sale in sales" :key="`${sale.title}`">
        <SalesGraph :sale="sale" />
      </v-col>
    </v-row>

    <v-row>
      <v-col v-for="statistic in statistics" :key="`${statistic.title}`">
        <StatisticCard :statistic="statistic" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { authComputed } from '@/helpers/authHelpers.js';

import SalesGraph from '../components/SalesGraph';
import StatisticCard from '../components/StatisticCard';

import salesData from '../data/sales.json';
import statisticsData from '../data/statistics.json';

export default {
  name: 'DashboardPage',
  components: {
    SalesGraph,
    StatisticCard,
  },
  data() {
    return {
      sales: salesData,
      statistics: statisticsData,
    };
  },
  computed: {
    ...authComputed,
  },
};
</script>
