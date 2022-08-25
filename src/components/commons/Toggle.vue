<template>
  <div class="flex items-center">
    <span v-if="props.text" class="mr-2"> {{ t(`main_toolbar.${props.text}`) }}</span>
    <div
      class="toggle"
      :class="[enabled ? 'on' : 'off', darkLight ? 'darkLight' : '']"
      @click="emit('update:modelValue', !enabled)"
    >
      <div
        class="toggle__round"
        :class="[enabled ? 'on' : 'off', darkLight ? 'darkLight' : '']"
      ></div>
      <span
        class="toggle__text"
        :class="[enabled ? 'on' : 'off', darkLight ? 'darkLight' : '']"
      >
        {{ enabled ? t(`main_toolbar.Yes`) : t(`main_toolbar.No`) }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, toRef } from "vue";
import { useTranslation } from '../../composables/lang';
const { t, locale } = useTranslation();
const emit = defineEmits(["toogled", "update:modelValue"]);
const props = defineProps({
  text: {
    type: String,
    default: null,
  },
  darkLight: {
    type: Boolean,
    default: false,
  },
  modelValue: {
    type: Boolean,
  },
});

const enabled = toRef(props, "modelValue");

watch(enabled, (p) => {
  emit("update:modelValue", p);
});
</script>

<style lang="scss" scoped>
button {
  @apply relative bg-black
    inline-flex
    flex-shrink-0
    h-6
    w-11
    border-2 border-transparent
    rounded-full
    cursor-pointer
    transition-colors
    ease-in-out
    duration-200;
}

.toggle {
  @apply w-[50px] h-[20px] rounded-full relative cursor-pointer duration-300;

  &__round {
    @apply w-[16px] h-[16px] rounded-full bg-white absolute;

    top: 50%;
    transform: translateY(-50%);

    &.on {
      transform: translateY(-50%) translateX(2px);
    }

    &.off {
      right: 2px;
      transform: translateY(-50%);

      &.darkLight {
        @apply bg-black;
      }
    }
  }

  &__text {
    @apply absolute font-normal;

    top: 50%;
    transform: translateY(-50%);
    font-size: 12px;

    &.on {
      right: 8px;

      @apply text-white;
    }

    &.off {
      left: 8px;

      @apply text-white;

      &.darkLight {
        @apply text-black;
      }
    }
  }

  &.on {
    @apply bg-blue;
  }

  &.off {
    @apply bg-black;

    &.darkLight {
      @apply bg-white;
    }
  }
}
</style>