<template>
  <div class="flex items-center">
    <input
      id="remember-me"
      name="remember-me"
      type="checkbox"
      class="h-4 w-4 text-black focus:ring-blue border-gray-300 rounded"
      v-model="checked"
    />
    <label
      v-if="props.text"
      for="remember-me"
      class="ml-2 block text-sm text-gray-900"
    >
      {{ props.text }}
    </label>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
const props = defineProps({
  text: String,
});
const emit = defineEmits(["checked"]);
const checked = ref(false);
watch(checked, (value) => {
  emit("checked", value);
});
</script>