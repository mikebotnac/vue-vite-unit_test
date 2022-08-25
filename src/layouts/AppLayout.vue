<template>
  <div class="h-screen w-screen flex flex-col bg-gray-100">
    <Top />
    <div class="flex flex-1 w-screen overflow-hidden">
      <Sidebar />
      <main class="flex-1 relative focus:outline-none bg-lightgray">
        <div class="h-full flex flex-col overflow-y-auto overscroll-none p-4">
          <div class="flex justify-between items-center">
            <p class="pb-4 text-darkgray text-xs" v-if="routeBreadcrumb">
              <span
                v-for="(item, index) in routeBreadcrumb"
                :key="item"
                :class="
                  index === routeBreadcrumb.length - 1
                    ? 'font-bold text-black'
                    : ''
                "
              >
                {{ routeBreadcrumb[index] }}
                <template v-if="index < routeBreadcrumb.length - 1">
                  <ArrowRightIcon class="inline h-4 mr-1" />
                </template>
              </span>
            </p>
          </div>
          <div class="flex-1">
            <router-view :key="fullpath" />
          </div>
        </div>
        <div id="modal-container"></div>
        <PageLoader v-if="showPageLoader" />
      </main>
    </div>
    <Notifications />
  </div>
</template>

<script>
import { computed, inject } from "vue";
import { useRoute } from "vue-router";
import { ArrowRightIcon } from "@heroicons/vue/solid";
export default {
  components: {
    ArrowRightIcon,
  },
  setup() {
    const route = useRoute();

    const fullpath = computed(() => {
      return route.fullPath;
    });
    const routeBreadcrumb = computed(() => {
      return route.meta ? route.meta.breadcrumb : null;
    });

    const uiStore = inject("uiStore");
    const showPageLoader = computed(() => {
      return uiStore.state.showPageLoader;
    });

    return { route, fullpath, routeBreadcrumb, showPageLoader };
  },
};
</script>