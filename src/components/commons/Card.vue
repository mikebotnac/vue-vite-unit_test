<template>
  <div class="bg-white rounded-lg">
    <header v-if="hasTitle">
      <slot name="title"></slot>
    </header>
    <main>
      <slot name="content"></slot>
    </main>
  </div>
</template>

<script setup>
import { computed, useSlots } from "vue";
const slots = useSlots();
const hasTitle = computed(() => {
  return !!slots.title;
});
</script>

<style lang='scss' scoped>
header {
  @apply bg-darkgray py-3 px-6 text-white font-bold rounded-t-lg;
}

main {
  @apply p-[20px];
}
</style>