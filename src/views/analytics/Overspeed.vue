<template>
  <div class="flex flex-col h-full">
    <div class="flex justify-between items-center mb-4">
      <TabsContainer :tabs="tabs" :activeTab="activeTab" />
      <div id="overspeed-button"></div>
    </div>

    <div class="flex-1">
      <router-view />
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { useRoute } from "vue-router";
const tabs = [
  {
    id: "report",
    title: "Report",
    route: "AnalyticsOverspeedReport",
  },
  {
    id: "stats",
    title: "Stats",
    route: "AnalyticsOverspeedStats",
  },
  {
    id: "map",
    title: "Map",
    route: "AnalyticsOverspeedMap",
  },
];
const activeTab = ref();
const route = useRoute();
const routeName = route.name;
activeTab.value = tabs.filter((t) => t.route === routeName)[0].id;
</script>