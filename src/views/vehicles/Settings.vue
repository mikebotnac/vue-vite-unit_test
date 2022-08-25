<template>
  <div class="mb-4 flex items-center justify-between">
    <TabsContainer :tabs="tabs" :activeTab="activeTab" />
    <!-- USED TO TELEPORT THE RIGHT BUTTON -->
    <div id="settings-btn"></div>
  </div>
  <router-view />
</template>

<script>
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
export default {
  setup() {
    const tabs = [
      {
        id: "one",
        title: "One Vehicle",
        route: "VehiclesSettingsOne",
      },
      {
        id: "multiple",
        title: "Multiple Vehicle",
        route: "VehiclesSettingsMultiples",
      },
    ];

    const settingsDisabled = ref(true);

    const activeTab = ref();

    const route = useRoute();
    const routeName = route.name;
    activeTab.value = tabs.filter((t) => t.route === routeName)[0].id;

    return {
      tabs,
      activeTab,
    };
  },
};
</script>