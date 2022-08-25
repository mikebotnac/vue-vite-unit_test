<template>
  <div class="card" :class="props.disabled ? 'disabled' : ''">
    <div class="card__header space-y-4 md:space-y-0 md:flex md:justify-between">
      <div class="flex justify-between md:justify-start items-center">
        <p class="md:mr-2">Speed Limit enable</p>
        <Toggle darkLight v-model="isSpeedLimitEnabled" />
      </div>
      <div
        class="
          hidden
          md:flex
          justify-between
          md:justify-start
          items-center
          md:mr-4
        "
        v-if="!multiple"
      >
        <p class="md:mr-2">Immobilize vehicle</p>
        <Toggle darkLight v-model="isImmobilized"/>
      </div>
    </div>
    <div class="card__content">
      <p class="text-blue text-xs font-bold mb-4">Speed limit parameters</p>
      <div class="speeds">
        <NumberPicker
          v-for="zone in limits"
          :key="zone.label"
          :label="zone.label"
          :defaultval="zone.value"
          :payload="!props.disabled ? zone.limit : 0"
          :max="userSpeedUnit === 'kmh' ? 200 : 120"
          @updated="(e) => makeChange(e, zone)"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, inject, computed, toRef } from "vue";

const props = defineProps({
  disabled: Boolean,
  deviceLimits: Object,
  isImmobilized: Boolean,
  isSpeedLimitEnabled: Boolean,
  multiple: Boolean
});

const isDisabled = toRef(props, "disabled");
const deviceLimits = toRef(props, "deviceLimits");

const emit = defineEmits([
  "update:modelValue",
  "update:immobilized",
  "update:speedLimitEnable",
]);

const userStore = inject("userStore");
const user = computed(() => userStore.state.user);
const userSpeedUnit = userStore.speedUnit.value;

const limits = ref([]);
const isImmobilized = ref(false);
const isSpeedLimitEnabled = ref(false);

const generateZones = () => {
  const baseZones =
    userSpeedUnit === "kmh"
      ? [20, 25, 30, 40, 50, 60, 70, 80, 90, 100]
      : [15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80];
  const zones = [];
  baseZones.forEach((zone) => {
    zones.push({
      value: zone,
      label: `Zone ${zone} ${userSpeedUnit}`,
      limit: deviceLimits.value ? deviceLimits.value[zone] || zone : zone,
    });
  });
  return zones;
};

const transformZonesForApi = () => {
  const transformedZones = {};
  limits.value.forEach((z) => {
    transformedZones[z.value] = z.limit;
  });
  return transformedZones;
};

const exportData = () => {
  return {
    limits: transformZonesForApi(),
    isImmobilized: isImmobilized.value,
    isSpeedLimitEnabled: isSpeedLimitEnabled.value,
  };
};

const makeChange = (e, zone) => {
  zone.limit = e;
}

const reset = () => {
  limits.value = generateZones();
  isImmobilized.value = props.isImmobilized;
  isSpeedLimitEnabled.value = props.isSpeedLimitEnabled;
};

limits.value = generateZones();

watch(isDisabled, (val) => {
  if (!val) {
    limits.value = generateZones();
    isImmobilized.value = props.isImmobilized;
    isSpeedLimitEnabled.value = props.isSpeedLimitEnabled;
  } else {
    limits.value = [];
    isImmobilized.value = false;
    isSpeedLimitEnabled.value = false;
  }
});

defineExpose({ exportData, reset, makeChange });
</script>

<style lang="scss" scoped>
.card {
  @apply rounded-xl w-full overflow-hidden flex flex-col bg-white;
  @apply md:h-auto;

  .card__header {
    @apply bg-darkgray text-xs text-white font-bold p-4 flex flex-col md:flex-row md:items-center;
  }

  .card__content {
    @apply p-6 flex-1 flex flex-col justify-start items-start;

    .speeds {
      @apply w-full md:w-auto grid grid-cols-2 md:grid-cols-4 gap-4;
    }
  }

  &.disabled {
    @apply opacity-40 pointer-events-none;
  }
}
</style>