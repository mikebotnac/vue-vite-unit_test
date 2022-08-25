<template>
  <button
    type="button"
    class="button"
    :disabled="isDisabled"
    :class="[
      isDisabled ? 'disabled' : '',
      isOutlined ? 'outlined' : '',
      isLoading ? 'loading' : '',
    ]"
    @click="clicked()"
  >
    <div class="duration-200" :class="isLoading ? 'opacity-0' : ''">
      <slot> </slot>
    </div>

    <div v-if="isLoading" class="loader_container">
      <svg
        class="animate-spin h-5 w-5 text-white z-50"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    </div>
  </button>
</template>

<script>
export default {
  props: {
    isOutlined: Boolean,
    isDisabled: Boolean,
    isLoading: Boolean,
  },

  emits: ["clicked"],
  setup(props, { emit }) {
    const clicked = () => {
      emit("clicked");
    };
    return { props, clicked };
  },
};
</script>

<style lang="scss" scoped>
.button {
  height: 38px;

  @apply relative inline-flex items-center justify-center duration-300 px-4 py-3 border border-transparent text-xs font-medium shadow-sm  whitespace-nowrap;
  @apply text-white bg-blue hover:bg-lightblue;
  @apply rounded;
  @apply disabled:opacity-30 disabled:cursor-not-allowed;

  &.outlined {
    @apply bg-white border-blue text-blue;
    @apply hover:bg-blue hover:text-white;
  }

  &.loading {
    @apply pointer-events-none;
  }

  .loader_container {
    @apply absolute top-1/2 left-1/2;

    transform: translate(-50%, -50%);
  }
}
</style>