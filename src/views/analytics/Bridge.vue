<template>
  <div class="flex flex-col h-full">
    <div class="flex justify-between items-center mb-4">
      <TabsContainer :tabs="tabs" :activeTab="activeTab" />
      <div id="bcp-button"></div>
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
    route: "AnalyticsBridgeReport",
  },
  {
    id: "map",
    title: "Map",
    route: "AnalyticsBridgeMap",
  },
];
const activeTab = ref();
const route = useRoute();
const routeName = computed(() => {
  return route.name;
});
activeTab.value = tabs.filter((t) => t.route === routeName.value)[0].id;
</script>

<style lang="scss" scoped>
.donut {
  width: 300px;
  height: 300px;
}
</style>