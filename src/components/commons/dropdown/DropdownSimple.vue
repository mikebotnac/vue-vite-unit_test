<!-- This example requires Tailwind CSS v2.0+ -->
<template>
  <Listbox
    as="div"
    v-model="selected"
    class="dropdown_simple"
    :class="props.isDisabled ? 'disabled' : ''"
  >
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
          focus:outline-none
          sm:text-sm
        "
      >
        <span class="block truncate text-xs">
          <template v-if="selected">
            {{ props.optionLabel ? selected[optionLabel] : selected }}
          </template>
          <template v-else>
            {{ props.placeholder }}
          </template>
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
          <SelectorIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
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
            rounded
            py-1
            text-base
            ring-1 ring-black ring-opacity-5
            overflow-auto
            focus:outline-none
            sm:text-sm
          "
        >
          <ListboxOption
            as="template"
            v-for="option in props.options"
            :key="option"
            :value="option"
            v-slot="{ active, selected }"
          >
            <li :class="[active ? 'text-white bg-blue' : 'text-gray-900']">
              <span
                class="text-xs"
                :class="[
                  selected ? 'font-semibold' : 'font-normal',
                  'block truncate',
                ]"
              >
                {{ props.optionLabel ? option[optionLabel] : option }}
              </span>

              <span
                v-if="selected"
                :class="[
                  active ? 'text-white' : 'text-blue',
                  'absolute inset-y-0 right-0 flex items-center pr-4',
                ]"
              >
                <CheckIcon class="h-3 w-3" aria-hidden="true" />
              </span>
            </li>
          </ListboxOption>
        </ListboxOptions>
      </transition>
    </div>
  </Listbox>
</template>

<script>
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/vue";
import { CheckIcon, SelectorIcon } from "@heroicons/vue/solid";
export default {
  components: {
    Listbox,
    ListboxButton,
    ListboxOption,
    ListboxOptions,
  },
};
</script>

<script setup >
import { ref, computed, watch } from "vue";

const emit = defineEmits(["selected", "update:modelValue"]);
const props = defineProps({
  options: Array,
  optionLabel: String,
  payload: String,
  placeholder: String,
  isDisabled: Boolean,
  modelValue: [Object, String, Number],
});

const options = ref(props.options);
const selected = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

watch(
  () => props.modelValue,
  (val) => {
    if (!val || val.length === 0) {
      selected.value = "";
    } else {
      selected.value = val;
    }
  }
);
</script>

<style lang="scss" scoped>
.dropdown_simple {
  &.disabled {
    button {
      @apply cursor-not-allowed pointer-events-none opacity-50;
    }
  }
}

button {
  height: 38px;
}

ul li {
  @apply cursor-pointer select-none relative py-2 pl-3 pr-9;
}
</style>