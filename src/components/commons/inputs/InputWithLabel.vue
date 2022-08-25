<template>
  <div>
    <label for="email" class="block text-sm font-bold text-gray-700">
      {{ props.label }}
    </label>
    <div class="mt-1 relative rounded shadow-sm">
      <input
        v-model="value"
        :type="props.type"
        :name="props.name"
        :id="props.name"
        :placeholder="props.placeholder"
        :class="props.error ? 'invalid' : ''"
      />
      <div id="inputIcon" v-if="props.error">
        <ExclamationCircleIcon class="h-5 w-5 text-red-500" />
      </div>
    </div>
    <p class="mt-2 text-sm text-red-600" id="input-error">
      {{ props.error }}
    </p>
  </div>
</template>

<script>
import { ExclamationCircleIcon } from "@heroicons/vue/solid";
import { ref } from "vue";
export default {
  props: {
    label: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    placeholder: {
      type: String,
    },
    type: {
      type: String,
    },
    error: {
      type: String,
    },
  },
  components: {
    ExclamationCircleIcon,
  },
  setup(props) {
    const value = ref("");
    return { props, value };
  },
};
</script>

<style lang="scss" scoped>
input {
  @apply block w-full pr-10  sm:text-sm rounded;

  &.invalid {
    @apply border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500;
  }
}

#inputIcon {
  @apply absolute inset-y-0 right-0 pr-3  flex items-center pointer-events-none;
}
</style>