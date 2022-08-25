<template>
  <div class="relative">
    <label>
      {{ props.label }}
    </label>
    <div class="relative">
      <input
        v-model="text"
        :type="props.type"
        :placeholder="props.placeholder"
        :class="props.error ? 'error' : ''"
      />
      <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
        <slot name="icon"></slot>
      </div>
    </div>
    <span>
      {{ props.error }}
    </span>
  </div>
</template>

<script>
import { computed, ref, watch } from "vue";
export default {
  props: {
    type: {
      type: String,
      default: "text",
    },
    label: String,
    placeholder: String,
    error: String,
    modelValue: String,
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const text = ref("");
    const textPayload = computed(() => {
      return props.modelValue;
    });
    if (textPayload) {
      text.value = textPayload.value;
    }
    watch(textPayload, (val) => {
      text.value = val;
    });
    watch(text, (val) => {
      emit("update:modelValue", val);
    });
    return { props, text };
  },
};
</script>

<style lang="scss" scoped>
label {
  height: 15px;

  @apply flex items-center text-sm font-bold text-black;
}

input {
  @apply text-xs focus:ring-indigo-500 focus:border-indigo-500 block w-full pr-10  border-gray rounded;

  &.error {
    @apply border-orange focus:ring-orange focus:border-orange;
  }
}

span {
  height: 15px;

  @apply flex items-center text-xs text-orange;
}
</style>