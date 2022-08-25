<template>
  <div class="flex flex-wrap items-center mt-4">
    <div
      v-for="item in items"
      :key="item.label"
      class="flex items-center mr-8 mt-4 md:mt-0"
    >
      <img :src="item.icon" alt="" />
      <p class="whitespace-nowrap">{{ t(`main_footer.${item.label}`) }}</p>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import pinIdle from "../../assets/icons/map/pins/pin-idle.svg";
import pinBridge from "../../assets/icons/map/pins/bridge.png";
import pinOverspeed from "../../assets/icons/map/pins/pin-overspeed.svg";
import pinRunning from "../../assets/icons/map/pins/pin-running.svg";
import PinStopped from "../../assets/icons/map/pins/pin-stopped.svg";
import { useTranslation } from "../../composables/lang";

export default {
  setup() {
    const { t, locale } = useTranslation();
    const items = ref([
      {
        label: "Stopped",
        icon: PinStopped,
      },
      {
        label: "Idle",
        icon: pinIdle,
      },

      {
        label: "Running",
        icon: pinRunning,
      },
    ]);

    return { items, t, locale };
  },
};
</script>

<style lang="scss" scoped>
img {
  height: 28px;

  @apply mr-2;
}
</style>