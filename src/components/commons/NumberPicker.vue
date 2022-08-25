<template>
  <div class="w-full md:w-[124px]">
    <p class="font-bold text-xs mb-1">{{ props.label }}</p>
    <div class="number_picker">
      <input
        class="number"
        type="number"
        :min="props.defaultval - 5"
        :max="props.defaultval + 5"
        v-model="number"
        :disabled="true"
      />
      <div class="actions">
        <span @click="number < props.max ? number++ : _">+</span>
        <span
          @click="
            () => {
              if (number > 0) number--;
            }
          "
          >-</span
        >
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, toRefs, watch } from "vue";
const props = defineProps({
  label: String,
  payload: Number,
  max: Number,
  defaultval: Number,
});
const emit = defineEmits(["updated"]);
const number = ref(0);
number.value = props.defaultval;
const max_numeber = ref(0);
const min_numeber = ref(0);
max_numeber.value = props.defaultval + 10;
min_numeber.value = props.defaultval - 10;
watch(
  () => props.payload,
  (value) => {
    number.value = value;
  }
);
watch(
  () => number.value,
  (value) => {
    if (value > max_numeber.value) {
      number.value = max_numeber.value;
    }
    if (value < min_numeber.value) {
      number.value = min_numeber.value;
    }
    emit("updated", +value);
  }
);
</script>

<style lang="scss" scoped>
.number_picker {
  height: 38px;

  @apply w-full  border-gray border-1 flex items-center rounded;

  .number {
    @apply flex-1 pl-4 border-0 w-full focus:ring-0;
  }

  .actions {
    height: 38px;

    @apply flex flex-col justify-between;

    span {
      height: calc(50% - 0.5px);
      width: 30px;

      @apply text-xs bg-lightgray flex items-center justify-center font-bold cursor-pointer hover:bg-darkgray;
    }
  }
}

/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type="number"] {
  -moz-appearance: textfield;
}
</style>