<!-- This example requires Tailwind CSS v2.0+ -->
<template>
  <Listbox as="div" class="select" v-model="selected">
    <div class="relative">
      <ListboxButton
        class="
          bg-white
          relative
          w-full
          border border-lightgray
          rounded
          pl-3
          pr-10
          py-2
          text-left
          cursor-default
          focus:outline-none focus:ring-1 focus:ring-blue focus:border-blue
          sm:text-sm
          h-[38px]
        "
      >
        <span class="block truncate">
          {{
            selected
              ? selected
              : props.placeholder
              ? props.placeholder
              : "Select"
          }}
        </span>
        <span
          class="
            absolute
            inset-y-0
            right-0
            flex
            items-center
            pr-2
            pointer-events-none
          "
        >
          <img
            src="../../assets/icons/inputs/search.svg"
            alt=""
            class="h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </span>
      </ListboxButton>

      <transition
        leave-active-class="transition ease-in duration-100"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <ListboxOptions
          class="
            absolute
            z-10
            mt-1
            w-full
            bg-white
            shadow-lg
            max-h-60
            rounded-md
            text-base
            ring-1 ring-black ring-opacity-5
            overflow-y-auto
            focus:outline-none
            sm:text-sm
          "
        >
          <div class="relative">
            <input
              class="
                focus:outline-none focus:ring-0
                w-full
                py-3
                pl-3
                search-input
              "
              placeholder="Search"
              v-model="filter"
            />
            <div
              class="
                absolute
                inset-y-0
                right-0
                pr-3
                flex
                items-center
                pointer-events-none
              "
            >
              <img src="../../assets/icons/inputs/search.svg" alt="" />
            </div>
          </div>
          <template v-if="options.length > 0 && filter.length >= 1">
            <ListboxOption
              as="template"
              v-for="(option, index) in options"
              :key="index"
              :value="option"
              v-slot="{ active, selected }"
            >
              <li :class="[active ? 'text-white bg-blue' : 'text-gray-900']">
                <span
                  :class="[
                    selected ? 'font-semibold' : 'font-normal',
                    'block truncate',
                  ]"
                >
                  {{ option }}
                </span>

                <span
                  v-if="selected"
                  :class="[
                    active ? 'text-white' : 'text-blue',
                    'absolute inset-y-0 right-0 flex items-center pr-4',
                  ]"
                >
                  <CheckIcon class="h-5 w-5" aria-hidden="true" />
                </span>
              </li>
            </ListboxOption>
          </template>
          <template v-else-if="options.length > 0 && filter.length < 1">
            <span class="py-2 pl-3 pr-9 block font-normal">
              Please type in at least one number
            </span>
          </template>
          <template v-else>
            <span class="py-2 pl-3 pr-9 block font-semibold">No unit</span>
          </template>
        </ListboxOptions>
      </transition>
    </div>
  </Listbox>
  <span class="text-orange text-xs">{{ props.error }}</span>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import {
  Listbox,
  ListboxButton,
  ListboxLabel,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/vue";
import { CheckIcon, SelectorIcon, ChevronDownIcon } from "@heroicons/vue/solid";

const props = defineProps({
  options: Array,
  placeholder: String,
  optionSelected: String,
  error: String,
});

const emit = defineEmits(["update:optionSelected"]);

const selected = ref();
const filter = ref("");

const options = computed(() => {
  if (filter.value.length === 0) {
    return props.options;
  } else {
    return props.options.filter((o) => {
      return o.includes(filter.value) ? true : false;
    });
  }
});

if (props.optionSelected) {
  selected.value = props.optionSelected;
}
watch(
  () => props.optionSelected,
  (val) => {
    selected.value = val;
    if (!val) {
      filter.value = "";
    }
  }
);

watch(selected, (val) => {
  emit("update:optionSelected", val);
});
</script>

<style lang="scss" scoped>
.select {
  @apply w-full;
}

li {
  @apply cursor-default select-none relative py-2 pl-3 pr-9;
}

.search-input {
  -webkit-appearance: none;
  margin: 0;
  border-bottom: 1px solid #eaeef3;
  border-radius: 5px;
}
</style>