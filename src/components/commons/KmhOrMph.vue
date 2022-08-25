<template>
  <span>
    {{ convertedValue }}
    {{ userStore.speedUnit === "kmh" ? "Kph" : "MPH" }}
  </span>
</template>

<script setup>
import { computed, inject, defineProps } from "vue";
const props = defineProps({
  value: {
    type: [String, Number],
  },
  valueUnit: {
    type: String,
    default: "kph",
  },
    name: {
    type: String,
  },
});
const round5 = (x) =>{
    return (x % 5) >= 2.5 ? parseInt(x / 5) * 5 + 5 : parseInt(x / 5) * 5;
}
const userStore = inject("userStore");
const user = computed(() => {
  return userStore.state.user;
});
const convertedValue = computed(() => {
  if (userStore.speedUnit.value === "kmh" && props.valueUnit === "mph") {
    return props.name == "posted_speed_limit" ? round5(mphToKph(props.value)) : mphToKph(props.value);
  }
  if (userStore.speedUnit.value === "mph" && props.valueUnit === "kph") {
    return props.name == "posted_speed_limit" ? round5(kphToMph(props.value)) : kphToMph(props.value);
  }
  if(props.name == "posted_speed_limit") return round5(props.value)
  return props.value;
});

const kphToMph = (value) => {
  return Math.round(value * 0.621371);
};
const mphToKph = (value) => {
  return Math.round(value / 0.621371);
};
</script>