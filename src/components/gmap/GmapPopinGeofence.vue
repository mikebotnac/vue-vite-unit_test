<template>
  <div class="bg-gray px-4 py-2">
    <span>
      Unit:
      <span class="font-bold">{{ data.raw_data.unit_name }}</span>
    </span>
  </div>
  <div class="p-4">{{ data.raw_data.details }}</div>
  <div class="p-4 pt-2 border-t-1 border-[#ebf5ff]">
    <router-link
      :to="link"
      class="flex items-center text-blue font-bold cursor-pointer"
    >
      <span>See details</span>
      <ArrowNarrowRightIcon class="ml-2 h-4" />
    </router-link>
  </div>
</template>

<script setup>
import { computed, nextTick } from "vue";
import { useRouter } from "vue-router";
import { useGeofence } from "../../stores/geofences";
import { ArrowNarrowRightIcon } from "@heroicons/vue/solid";
import { getUnixTime } from "date-fns";

const geofenceStore = useGeofence();
const router = useRouter();

const props = defineProps({
  data: {
    type: Object,
    requiered: true,
  },
});
const data = computed(() => props.data);

const link = computed(() => {
  return {
    name: "AnalyticsBridgeReport",
    query: {
      unit_name: props.data.unit_name,
      unit_uuid: props.data.unit_uuid,
      time: getUnixTime(new Date(props.data.time)),
    },
  };
});

const showOnReport = () => {
  geofenceStore.setSelectedReportGeofence(data.value.raw_data);
  nextTick(() => {
    router.push({
      name: "AnalyticsBridgeReport",
    });
  });
};
</script>