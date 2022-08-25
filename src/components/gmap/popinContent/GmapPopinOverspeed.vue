<template>
  <div class="bg-lightgray px-4 py-3">
    <span>Unit Name:</span>
    <span class="ml-2 font-bold">{{ props.data.unit_name }}</span>
  </div>
  <div class="text-xs p-4 space-y-4">
    <div class="flex items-center justify-between">
      <p>Vehicle Speed:</p>
      <p class="text-orange font-bold">
        <KmhOrMph :value="props.data.vehicle_speed" />
      </p>
    </div>
    <div class="flex items-center justify-between">
      <p>Posted Speed Limit:</p>
      <p>
        <KmhOrMph :value="props.data.posted_speed_limit" />
      </p>
    </div>
    <div class="flex items-center justify-between">
      <p>Allowed Speed Limit:</p>
      <p>
        <KmhOrMph :value="props.data.allowed_speed_limit" />
      </p>
    </div>
    <div class="flex items-center justify-between">
      <p>Active:</p>
      <p>{{ props.data.is_speed_enabled }}</p>
    </div>
  </div>
  <div class="p-4 pt-2 border-t-1 border-[#ebf5ff]">
    <router-link :to="link" class="flex items-center text-blue font-bold cursor-pointer">
      <span>See details</span>
      <ArrowNarrowRightIcon class="ml-2 h-4" />
    </router-link>
  </div>
</template>


<script setup>
import { nextTick, computed } from "vue";
import { ArrowNarrowRightIcon } from "@heroicons/vue/outline";
import { useRouter } from "vue-router";
import { useOverspeed } from "../../../stores/overspeeds";
import { getUnixTime } from "date-fns";

const router = useRouter();
const overspeedStore = useOverspeed();

const props = defineProps({
  data: Object,
});


const emit = defineEmits(["close"]);

const link = computed(() => {
  return {
    name: "AnalyticsOverspeedReport",
    query: {
      unit_name: props.data.unit_name,
      unit_uuid: props.data.unit_uuid,
      time: getUnixTime(new Date(props.data.time)),
    },
  };
});

const showOnReport = () => {
  overspeedStore.setSelectedReportOverspeed(props.data);
  emit("close");
  nextTick(() => {
    router.push({
      name: "AnalyticsOverspeedReport",
    });
  });
};
</script>

<style lang="scss" scoped>
.bottom {
  @apply mt-2 p-4 border-t-1 border-gray;

  a {
    @apply text-blue font-bold;
  }
}
</style>