<template>
  <router-view></router-view>
</template>

<script>
import { ref, computed } from "vue";
import { useRoute } from "vue-router";

export default {
  setup() {
    const sidebarOpen = ref(false);
    const route = useRoute();
    const routeName = computed(() => route.name);
    return {
      sidebarOpen,
      routeName,
    };
  },
};
</script>
