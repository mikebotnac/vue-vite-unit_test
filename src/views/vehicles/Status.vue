<template>
  <div class="hidden md:block">
    <TabsContainer :tabs="tabs" :activeTab="activeTab" />
    <div class="mt-4">
      <router-view />
    </div>
  </div>
  <BreakpointNotice class="md:hidden" />
</template>

<script setup>
import { ref, computed } from "vue";
import { useRoute } from "vue-router";

const tabs = [
  {
    id: "report",
    title: "Report",
    route: "VehiclesStatusReport",
  },
  {
    id: "stats",
    title: "Stats",
    route: "VehiclesStatusStats",
  },
];

const activeTab = ref();
const route = useRoute();
const routeName = computed(() => {
  return route.name;
});

activeTab.value = tabs.filter((t) => t.route === routeName.value)[0].id;
</script>