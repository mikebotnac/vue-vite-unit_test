<template>
  <div class="flex justify-between items-center">
    <span>Page {{ props.currentPage }}</span>
    <div class="flex">
      <div
        class="previous"
        :class="[
          props.currentPage > 1
            ? 'opacity-1 cursor-pointer'
            : 'opacity-50 pointer-events-none',
        ]"
        @click="prevPage"
      >
        <p>Previous</p>
      </div>
      <div
        class="next"
        :class="
          !nextDisabled
            ? 'opacity-1 cursor-pointer'
            : 'opacity-50 pointer-events-none'
        "
        @click="nextPage"
      >
        <p v-if="!loadingNext">Next</p>
        <span v-else>--</span>
      </div>
      <div class="ml-2" v-if="!nextDisabled">
        <select
          id="location"
          name="location"
          class="
            h-[38px]
            block
            w-full
            pl-3
            pr-10
            py-2
            text-base
            border-0
            focus:outline-none focus:ring-indigo-500 focus:border-indigo-500
            sm:text-sm
            rounded-md
          "
          v-model="lengthValue"
        >
          <option v-for="length in listLengths" :key="length">
            {{ length }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue-demi";

const props = defineProps({
  currentPage: {
    type: [Number, String],
    required: true,
  },
  nextDisabled: {
    type: Boolean,
  },
  loadingNext: Boolean,
  listLength: {
    type: [Number, String],
  },
});
const emit = defineEmits(["prev-page", "next-page", "update:listLength"]);

const prevPage = () => {
  emit("prev-page");
};
const nextPage = () => {
  emit("next-page");
};
const listLengths = [25, 50, 100];
const lengthValue = computed({
  get: () => props.listLength,
  set: (value) => emit("update:listLength", +value),
});
</script>

<style lang="scss" scoped>
.previous,
.next {
  height: 38px;

  @apply bg-white flex items-center justify-center rounded px-2 hover:bg-darkblue hover:text-white;
}
</style>