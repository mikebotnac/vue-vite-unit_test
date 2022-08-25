<template>
  <div class="bg-lightgray px-4 py-3">
    <span>Unit Name:</span>
    <span class="ml-2 font-bold">{{ props.unit_name }}</span>
  </div>
  <div class="text-xs p-4">
    <div class="space-y-3">
      <div class="flex items-center justify-between">
        <span>Vehicle Speed:</span>
        <p class="text-blue font-bold" v-if="props.vehicle_speed > 0">
          <KmhOrMph :value="props.vehicle_speed" />
        </p>
        <p class="text-blue font-bold" v-if="props.vehicle_speed === 0">Idle</p>
        <p class="text-blue font-bold" v-if="props.vehicle_speed === -1" >Stopped</p>
      </div>
      <div class="flex items-center justify-between">
        <p>Posted Speed Limit:</p>
        <p>
          <KmhOrMph :value="props.posted_speed_limit" name = "posted_speed_limit"/>
        </p>
      </div>
      <div class="flex items-center justify-between">
        <p>Allowed Speed Limit:</p>
        <p>
          <KmhOrMph :value="props.allowed_speed" name = "allowed_speed" />
        </p>
      </div>
      <div class="flex items-center justify-between">
        <p>Active:</p>
        <p>
          {{ props.isActive }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  vehicle_speed: Number,
  posted_speed_limit: Number,
  allowed_speed: Number,
  unit_name: String,
  isKmh: Boolean,
  isActive: Boolean,
});
</script>