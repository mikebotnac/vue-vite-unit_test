<template>
  <div
    class="relative"
    :class="props.class"
    ref="target"
    @click="isFocused = true"
  >
    <label
      v-if="props.label"
      :for="props.name"
      class="block text-sm font-bold text-gray-700"
    >
      {{ props.label }}
    </label>
    <input
      :type="props.type"
      :name="props.name"
      :id="props.name"
      :class="isError ? 'error' : ''"
      :placeholder="props.placeholder"
      v-model="content"
    />

    <!-- Error -->
    <p class="text-xs text-orange h-4" v-if="canShowError">
      {{ error || null }}
    </p>

    <!-- Icon -->
    <div
      class="absolute inset-y-0 right-0 pr-3 flex items-center"
      :class="props.isIconClickable ? 'cursor-pointer' : 'pointer-events-none'"
      v-if="props.icon"
      @click="iconClicked()"
    >
      <img :src="SearchIconUrl" />
    </div>
    <!-- End of Icon -->

    <!-- Autocomplete -->
    <div
      v-if="isAutocomplete && autocompleteOpenned"
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
      <ul v-if="filteredValues.length > 0">
        <li
          v-for="item in filteredValues"
          :key="item"
          class="
            cursor-default
            select-none
            relative
            py-2
            pl-3
            pr-9
            hover:bg-blue
            hover:text-white
            text-xs
          "
          @click="selectOption(item)"
        >
          {{ item }}
        </li>
      </ul>
      <p class="text-xs py-2 pl-3 pr-9" v-else>
        There is no results for {{ content }}
      </p>
    </div>
    <!-- End of Autocomplete -->
  </div>
</template>

<script>
import { computed, ref, watch } from "vue";
import { onClickOutside } from "@vueuse/core";
import SearchIconUrl from "../../../assets/icons/inputs/search.svg";
export default {
  props: {
    label: String,
    type: String,
    name: String,
    placeholder: String,
    payload: String,
    verboseError: Boolean,
    isError: Boolean,
    error: String,
    icon: String,
    isIconClickable: Boolean,
    isAutocomplete: Boolean,
    autocompleteOptions: Array,
    class: String,
    canShowError: Boolean,
  },
  emits: ["updated", "icon-clicked"],
  setup(props, { emit }) {
    const content = ref("");

    const error = computed(() => {
      return props.error;
    });

    if (props.payload) {
      content.value = props.payload;
    }

    watch(content, (newContent, oldContent) => {
      emit("updated", newContent);
    });
    const iconClicked = () => {
      emit("icon-clicked", content);
    };
    const selectOption = (item) => {
      content.value = item;
      setTimeout(() => {
        isFocused.value = false;
      }, 100);
    };

    const options = computed(() => {
      return props.autocompleteOptions;
    });

    // Autocomplete
    const autocompleteOpenned = computed(() => {
      if (content.value.length > 1 && isFocused.value) {
        return true;
      } else {
        return false;
      }
    });
    const filteredValues = computed(() => {
      if (!content.value) {
        return options.value;
      } else {
        return options.value.filter((i) => {
          return i.includes(content.value) ? true : false;
        });
      }
    });

    const target = ref(null);
    const isFocused = ref(false);

    onClickOutside(target, (event) => {
      isFocused.value = false;
    });

    return {
      error,
      SearchIconUrl,
      props,
      content,
      iconClicked,
      autocompleteOpenned,
      selectOption,
      target,
      isFocused,
      filteredValues,
    };
  },
};
</script>

<style lang="scss" scoped>
input {
  height: 38px;

  @apply text-xs focus:ring-indigo-500 focus:border-indigo-500 block w-full pr-10  border-gray rounded;

  &.error {
    @apply border-orange;
  }
}
</style>