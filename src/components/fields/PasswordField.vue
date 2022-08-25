<template>
  <div>
    <label>
      {{ props.label }}
    </label>
    <div class="relative">
      <input
        v-model="text"
        :type="display ? 'text' : 'password'"
        :placeholder="props.placeholder"
        :class="props.error ? 'error' : ''"
      />
      <div
        class="
          absolute
          inset-y-0
          right-0
          pr-3
          flex
          items-center
        "
      >
        <EyeIcon
          class="h-5 w-5 text-gray-400"
          v-if="display"
          @click="display = false"
        />
        <EyeOffIcon
          class="h-5 w-5 text-gray-400"
          v-else
          @click="display = true"
        />
      </div>
    </div>
    <span>
      {{ props.error }}
    </span>
  </div>
</template>

<script>
import { computed, ref, watch } from "vue";
import { EyeIcon, EyeOffIcon } from "@heroicons/vue/solid";
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
  components: {
    EyeIcon,
    EyeOffIcon,
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const text = ref("");
    const display = ref(false);
    const textPayload = computed(() => {
      return props.modelValue;
    });
    watch(textPayload, (val) => {
      text.value = val;
    });
    watch(text, (val) => {
      emit("update:modelValue", val);
    });
    return { props, text, display };
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