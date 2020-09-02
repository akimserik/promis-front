<template>
  <div>
    <NotificationBar
      v-for="notification in notifications"
      :key="notification.id"
      :notification="notification"
    />
  </div>
</template>

<script>
import NotificationBar from '@/components/NotificationBar.vue';
import { mapState } from 'vuex';

export default {
  components: {
    NotificationBar,
  },
  data() {
    return {};
  },
  computed: mapState('notification', ['notifications']),
};
</script>
