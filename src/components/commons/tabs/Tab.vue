<template>
  <router-link
    :to="{
      name: tab.route,
    }"
    class="tab"
    :class="isActive ? 'active' : ''"
  >
    {{ t(`main_toolbar.${tab.title}`) }}
  </router-link>
</template>

<script>
import { computed } from "vue-demi";
import { useTranslation } from "../../../composables/lang";

export default {
  props: {
    tab: Object,
    isActive: Boolean,
  },
  setup(props) {
    const { t, locale } = useTranslation();
    const tab = computed(() => {
      return props.tab;
    });
    const isActive = computed(() => {
      return props.isActive;
    });

    return { props, tab, isActive, t, locale };
  },
};
</script>

<style lang="scss" scoped>
.tab {
  height: 38px;
  width: 155px;
  font-weight: 600;

  @apply bg-white text-black rounded flex items-center justify-center text-xs cursor-pointer transition-all;

  &.active {
    @apply bg-darkblue text-white cursor-default;
  }

  &:hover {
    @apply bg-darkblue text-white cursor-pointer;
  }
}
</style>