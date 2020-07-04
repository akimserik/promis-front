<template>
  <v-alert dismissible dense :type="notificationTypeClass">
    <p>{{ notification.message }}</p>
  </v-alert>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  props: {
    notification: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      timeout: null,
    };
  },
  mounted() {
    this.timeout = setTimeout(() => this.remove(this.notification), 5000);
  },
  beforeDestroy() {
    clearTimeout(this.timeout);
  },
  computed: {
    notificationTypeClass() {
      return this.notification.type;
    },
  },
  methods: mapActions('notification', ['remove']),
};
</script>
