<template>
  <div id="gmap-popin" v-if="marker">
    <div id="gmap-popin__header">
      <div>
        <span>
          {{ formatedDate() }} <br />
          <i id="gmap-popin__header__timezone"
            >{{ t(`timezone`) }}: {{ data?.timezone || marker?.timezone }}</i
          >
        </span>
      </div>
      <div @click="close()" class="h-4 w-4">
        <XIcon />
      </div>
    </div>
    <div id="gmap-popin__content">
      <GmapPopinRunning
        v-if="['stopped', 'running', 'idle'].includes(type)"
        :isKmh="data?.isKmh"
        :vehicle_speed="data?.vehicle_speed"
        :posted_speed_limit="data?.posted_speed_limit"
        :allowed_speed="data?.allowed_speed"
        :unit_name="data?.unit_name"
        :isActive="data?.isActive"
      />
      <GmapPopinOverspeed
        v-if="type === 'overspeed'"
        :data="marker"
        @close="close()"
      />
      <GmapPopinGeofence v-if="type === 'bridge'" :data="data" />
    </div>
  </div>
</template>

<script setup>
import { computed, toRef } from "vue";
import { format } from "date-fns";
import { XIcon } from "@heroicons/vue/solid";
import { useTranslation } from "../../composables/lang";
const { t } = useTranslation();

const props = defineProps({
  marker: {
    type: Object,
    required: true,
  },
});
const emit = defineEmits(["close"]);
const type = computed(() => {
  return props.marker.type;
});
const marker = toRef(props, "marker");
const data = computed(() => {
  return props.marker?.data;
});

const formatedDate = () => {
  try {
    const date = new Date(marker.value.local_time);
    return `${format(date, "PP")} at ${format(date, "p")}`;
  } catch {
    return "Invalid Date";
  }
};

const close = () => {
  emit("close");
};
</script>

<style lang="scss">
* {
  @apply font-sans;
}
</style>

<style lang="scss" scoped>
#gmap-popin {
  width: 256px;
  position: relative;
  overflow: hidden;

  @apply flex flex-col rounded shadow-2xl;

  &__header {
    @apply bg-black md:bg-darkgray flex items-center justify-between px-4 py-3;

    p {
      @apply text-white font-bold text-xs;
    }

    div {
      font-size: 20px;

      @apply text-white font-bold cursor-pointer;
    }

    &__timezone {
      font-size: 11px;
    }
  }

  &__content {
    @apply flex-1 overflow-y-auto w-full overflow-x-hidden rounded bg-white;
  }
}
</style>