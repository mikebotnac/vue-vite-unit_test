<!-- This example requires Tailwind CSS v2.0+ -->
<template>
  <Listbox as="div" v-model="selected">
    <div class="relative">
      <ListboxButton
        class="
          bg-white
          relative
          w-full
          border border-gray
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
          {{ selected ? selected : props.placeholder }}
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
            top-2/4
          "
        >
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
            v-for="option in options"
            :key="option"
            :value="option"
            v-slot="{ active, selected }"
          >
            <li
              class="cursor-default select-none relative py-2 pl-3 pr-9"
              :class="[active ? 'text-white bg-blue' : 'text-gray-900', '']"
            >
              <span
                class="text-xs"
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
import { ref, toRefs, watch } from "vue";
import {
  Listbox,
  ListboxButton,
  ListboxLabel,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/vue";
import { CheckIcon, SelectorIcon } from "@heroicons/vue/solid";
import DropdownArrow from "../../assets/icons/inputs/dropdown_arrow.svg";

export default {
  props: {
    options: Array,
    payload: String,
    placeholder: String,
  },
  components: {
    Listbox,
    ListboxButton,
    ListboxLabel,
    ListboxOption,
    ListboxOptions,
    CheckIcon,
    SelectorIcon,
  },
  emits: ["selected"],
  setup(props, { emit }) {
    const options = ref(props.options);
    const selected = ref();
    if (props.payload) {
      const index = options.value.indexOf(props.payload);
      selected.value = options.value[index];
    }

    watch(
      () => props.payload,
      (val) => {
        selected.value = val;
      }
    );

    watch(selected, (selected) => {
      emit("selected", selected);
    });


    return {
      props,
      selected,
      options,
    };
  },
};
</script>

<style lang="scss" scoped>
button {
  height: 38px;
}
</style>