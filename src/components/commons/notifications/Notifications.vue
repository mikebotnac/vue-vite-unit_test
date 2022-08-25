<template>
  <div
    aria-live="assertive"
    class="
      fixed
      inset-0
      flex
      items-end
      p-4
      pointer-events-none
      z-[200]
      sm:items-start
    "
  >
    <div class="w-full flex flex-col items-center space-y-4 sm:items-end">
      <Notification
        v-for="(notification, index) in notifications"
        :key="index"
        :notification="notification"
      />
    </div>
  </div>
</template>

<script>
import { computed, inject } from "vue-demi";
export default {
  setup() {
    const notificationsStore = inject("notificationsStore");
    const notifications = computed(() => {
      return notificationsStore.state.notifications;
    });
    return { notifications };
  },
};
</script>