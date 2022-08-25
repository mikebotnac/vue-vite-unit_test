<template>
  <div class="relative z-50 font-normal" ref="target">
    <div class="relative">
      <input
        type="text"
        v-model="input"
        class="rounded border-1 border-lightgray w-full text-sm h-[38px]"
        :placeholder="props.placeholder"
        @focus="focus"
      />
      <span
        class="absolute inset-y-0 right-0 flex items-center pr-2"
        :class="
          props.clickabled && selected ? 'cursor-pointer' : 'pointer-event-none'
        "
      >
        <img
          src="../../assets/icons/inputs/search.svg"
          alt=""
          class="h-5 w-5 text-gray-400"
          aria-hidden="true"
          @click="search"
        />
      </span>
    </div>
    <div
      v-if="openned && input.length > 0"
      class="
        absolute
        bg-white
        h-auto
        w-full
        top-[40px]
        shadow
        rounded
        overflow-hidden
      "
    >
      <div class="overflow-y-auto max-h-[200px]">
        <ul v-if="results.length">
          <li
            v-for="option in results"
            :key="option"
            class="p-3 hover:bg-blue group"
            @click="select(option)"
          >
            <span class="group-hover:text-white">{{ option }}</span>
          </li>
        </ul>
        <span v-else class="p-3 block">
          There is no result matching your input
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { onClickOutside } from "@vueuse/core";
const props = defineProps({
  payload: {
    type: String,
  },
  options: {
    type: Array,
    required: true,
  },
  placeholder: {
    type: String,
  },
  clickabled: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(["search", "selected"]);

const clickedOutside = ref(false);

const input = ref("");
input.value = props.payload ? props.payload : "";

watch(input, () => {
  if (input.value !== selected.value) {
    selected.value = "";
    emit("selected", null);
  }
});

const openned = ref(false);

const results = computed(() => {
  return props.options.length
    ? props.options.filter((o) => o.includes(input.value))
    : [];
});

const focus = () => {
  openned.value = true;
  clickedOutside.value = false;
};

const selected = ref("");
const select = (option) => {
  selected.value = option;
  input.value = option;
  emit("selected", option);
  clickedOutside.value = true;
  openned.value = false;
};

const search = () => {
  emit("search", selected.value);
  input.value = "";
  selected.value = "";
};

const target = ref(null);

onClickOutside(target, (event) => {
  clickedOutside.value = true;
  openned.value = false;
});

const reset = () => {
  selected.value = "";
  input.value = "";
};
defineExpose({ reset });
</script>