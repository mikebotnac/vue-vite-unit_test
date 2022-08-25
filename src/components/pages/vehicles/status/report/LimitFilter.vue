<template>
  <div class="flex items-center space-x-3 w-full">
    <div class="flex-1">
      <DropdownSimple :options="props.range" placeholder="Speed zone" v-model="filters.limit" />
    </div>
    <div class="flex-1">
      <DropdownSimple :options="comp" placeholder="=" v-model="filters.comp" />
    </div>
    <input
      type="number"
      class="text-xs focus:ring-indigo-500 focus:border-indigo-500 block border-gray rounded;"
      v-model="filters.value"
      min="0"
      placeholder="Speed"
    />
  </div>
</template>

<script setup>
import { toRef } from "vue";

const props = defineProps({
  range: {
    type: Array,
    required: true,
  },
  modelValue: {
    type: Object,
    required: true,
  },
});
const comp = ["=", ">=", ">", "<", "<=", "!="];
const filters = toRef(props, "modelValue");
</script>