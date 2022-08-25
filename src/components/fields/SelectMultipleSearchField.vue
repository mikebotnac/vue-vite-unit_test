<template>
  <Menu as="div" class="w-full relative inline-block text-left">
    <div>
      <MenuButton
        class="
          inline-flex
          justify-between
          items-center
          w-full
          rounded
          border border-gray
          px-4
          py-2
          bg-white
          text-sm
          font-medium
          text-gray-700
          hover:bg-gray-50
          cursor-default
          focus:outline-none focus:ring-1 focus:ring-blue focus:border-blue
          sm:text-sm
          h-[38px]
        "
      >
        {{ props.placeholder }}
        <ChevronDownIcon class="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
      </MenuButton>
    </div>

    <transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <MenuItems
        class="
          z-10
          origin-top-left
          absolute
          left-0
          mt-2
          w-[600px]
          h-[400px]
          rounded-md
          shadow-lg
          bg-white
          ring-1 ring-black ring-opacity-5
          divide-y divide-gray-100
          focus:outline-none
          flex flex-col
        "
      >
        <div class="px-4 py-3 space-x-4 flex items-center">
          <div class="relative">
            <input
              type="text"
              placeholder="Filter"
              v-model="filter"
              class="rounded border border-gray"
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
              <img
                aria-hidden="true"
                class="h-5 w-5 text-gray-400"
                src="../../assets/icons/inputs/search.svg"
                alt=""
              />
            </div>
          </div>
          <div
            class="rounded border border-gray h-[38px] flex items-center px-3"
          >
            <input
              aria-describedby="comments-description"
              name="comments"
              type="checkbox"
              @click="selectAll"
              :value="
                options.filter((o) => o.selected).length === options.length
                  ? true
                  : false
              "
              class="
                focus:ring-indigo-500
                h-4
                w-4
                text-indigo-600
                border-gray-300
                rounded
                mr-2
              "
            />
            Select all
          </div>
          <span
            class="rounded font-bold cursor-pointer flex items-center"
            @click="unselectAll"
          >
            <img class="mr-2" src="../../assets/icons/reset.svg" alt="" />
            Reset Selection
          </span>
        </div>
        <div class="overflow-y-auto p-6">
          <div class="grid grid-cols-4 mb-4">
            <div v-for="column in columns" :key="column">
              <div v-for="option in column" :key="option">
                <div
                  v-if="option.unit.indexOf(filter) > -1"
                  class="relative flex items-start"
                >
                  <input
                    v-model="option.selected"
                    aria-describedby="comments-description"
                    name="comments"
                    type="checkbox"
                    :disabled="maxState == false && option.selected == false"
                    class="
                      focus:ring-indigo-500
                      h-4
                      w-4
                      text-indigo-600
                      border-gray-300
                      rounded
                    "
                  />
                  <div class="ml-3 text-sm">
                    <label for="comments" class="font-medium text-gray-700">
                      {{ option.unit }}
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <span class="text-blue">
            Limited to 200 results, please use the filter bar.</span
          >
        </div>
      </MenuItems>
    </transition>
  </Menu>
</template>

<script>
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
import { ChevronDownIcon } from "@heroicons/vue/solid";
import { ref, watch, computed } from "vue";
export default {
  components: {
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
    ChevronDownIcon,
  },
  props: {
    placeholder: String,
    options: Array,
  },
  emits: ["updated"],
  setup(props, { emit }) {
    const filter = ref("");
    const options = ref();
    let maxState = ref(true);
    options.value = props.options.map((o) => {
      return {
        ...o,
        selected: false,
      };
    });
    watch(
      () => options,
      (val) => {
        const MaxValue = options.value.filter((item) => item.selected).length;
        if (MaxValue >= 5) {
          maxState.value = false;
        } else {
          maxState.value = true;
        }
        emit("updated", val);
      },
      { deep: true }
    );
    const selectAll = () => {
      options.value = options.value.map((o) => {
        return {
          ...o,
          selected: true,
        };
      });
    };
    const unselectAll = () => {
      options.value = options.value.map((o) => {
        return {
          ...o,
          selected: false,
        };
      });
    };
    const columns = computed(() => {
      let test = [[], [], [], []];
      const nbOfColumns = 4;
      const maxPerColumn = 50;
      for (let index = 0; index < nbOfColumns; index++) {
        test[index].push(
          ...options.value.slice(
            index * maxPerColumn,
            index * maxPerColumn + 50
          )
        );
      }
      return test;
    });
    return { props, filter, columns, maxState, selectAll, unselectAll };
  },
};
</script>