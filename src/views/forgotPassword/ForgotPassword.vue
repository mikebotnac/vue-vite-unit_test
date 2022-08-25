<template>
  <FPStep1 v-if="step === 1" @go-to-step-2="step = 2" />
  <FPStep2 v-if="step === 2" />
</template>

<script>
import { ref } from "vue";
export default {
  setup() {
    const step = ref(1);
    return { step };
  },
};
</script>