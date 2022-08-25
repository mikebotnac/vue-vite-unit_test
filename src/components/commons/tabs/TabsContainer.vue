<template>
  <div class="flex">
    <Tab
      v-for="tab in props.tabs"
      :key="tab.id"
      :tab="tab"
      :isActive="tab.id === activeTab"
    />
  </div>
</template>

<script>
import { computed} from "vue";
export default {
  props: {
    tabs: Array,
    activeTab: String
  },
  setup(props) {
    const activeTab = computed(() => {return props.activeTab})
    return { props, activeTab };
  },
};
</script>