<template>
  <div id="sidebar" :class="isSidenavOpen ? 'display z-[52]' : ''">
    <div class="flex flex-col">
      <div class="flex flex-col flex-grow pt-5 pb-4">
        <div class="mt-5 flex-1 flex flex-col">
          <nav class="flex-1 px-4">
            <div v-for="item in navigation" :key="item.name" class="mb-6">
              <div
                class="mb-2"
                :class="item.hiddenOnMobile ? 'hidden desktop:flex' : 'flex'"
              >
                <img :src="getIcon(item.icon)" class="mr-2 h-4 w-4" />
                <p class="uppercase text-grayblue text-xs">
                  {{ t(`menu.${item.name}`) }}
                </p>
              </div>
              <template class="block space-y-2">
                <router-link
                  class="ml-6 text-white text-xs"
                  v-for="sub in item.children"
                  :key="sub.name"
                  :to="{ name: sub.to }"
                  :class="[
                    isActive(sub) ? 'font-bold' : 'font-light',
                    sub.hiddenOnMobile ? 'hidden desktop:block' : '',
                  ]"
                >
                  {{ t(`menu.${sub.name}`) }}
                </router-link>
              </template>
            </div>
            <p></p>
            <div
              @click="
                () => {
                  if (mq.current === 'xs' || mq.current === 'md') {
                    closeSidenav();
                  }
                  showLogoutPopup = true;
                }
              "
              class="flex items-center text-white cursor-pointer"
            >
              <img :src="getIcon('logout')" class="mr-2 h-4 w-4" />
              <p>{{ t(`menu.logout`) }}</p>
            </div>
            <Teleport to="#modal-container" v-if="showLogoutPopup">
              <LogoutModal
                @close="showLogoutPopup = false"
                @logout="logoutUser"
              />
            </Teleport>
          </nav>
        </div>
        <div class="block md:hidden border-t-1 border-white mt-10 pt-10 px-4">
          <div class="flex">
            <img
              src="../../assets/icons/navigation/phone.svg"
              alt=""
              class="mr-2 h-4 w-4"
            />
            <span class="text-white"> 1-888-437 6278</span>
          </div>
          <div class="flex">
            <img
              src="../../assets/icons/navigation/mail.svg"
              alt=""
              class="mr-2 h-4 w-4"
            />
            <span class="text-white">support@esmartcontrol.com</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, inject, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useMq } from "vue3-mq";
import { useTranslation } from "../../composables/lang";
export default {
  setup() {
    const { t, locale } = useTranslation();
    const mq = useMq();
    const navigationStore = inject("navigationStore");
    const userStore = inject("userStore");
    const router = useRouter();
    const navigation = computed(() => {
      return navigationStore.state.navigation;
    });
    const isSidenavOpen = computed(() => {
      return navigationStore.state.isSidenavOpen;
    });

    //Route
    const route = useRoute();
    const routeName = computed(() => {
      return route.name;
    });

    const closeSidenav = () => {
      navigationStore.closeSidenav();
    };

    //Icons
    const navIcons = import.meta.globEager(
      "../../assets/icons/navigation/*.svg"
    );
    const getIcon = (icon) => {
      const iconUrl =
        navIcons["../../assets/icons/navigation/" + icon + ".svg"].default;
      return iconUrl;
    };

    const isActive = (sub) => {
      if (route.name === sub.to || sub.otherRoutes.includes(route.name)) {
        return true;
      }
    };

    watch(routeName, () => {
      if (mq.current === "xs" || mq.current === "md") {
        closeSidenav();
      }
    });

    const showLogoutPopup = ref(false);
    const logoutUser = () => {
      router.push({
        name: "Logout",
      });
    };

    return {
      navigation,
      isSidenavOpen,
      getIcon,
      routeName,
      isActive,
      logoutUser,
      showLogoutPopup,
      closeSidenav,
      mq,
      t,
      locale,
    };
  },
};
</script>

<style lang="scss" scoped>
#sidebar {
  background-image: linear-gradient(to bottom, #1b63ff, #399cff);

  @apply fixed top-[70px] md:top-0 md:pt-[70px] w-full;
  @apply left-0 h-screen duration-200 overflow-hidden;
  @apply tablet:w-menu;
  @apply desktop:relative
    desktop:pt-0
    desktop:flex
    desktop:flex-shrink-0;

  transform: translateX(-100%);

  @apply desktop:w-0;

  &.display {
    transform: translateX(0);

    @apply desktop:w-menu;
  }
}

.sidebar__logo {
  @apply flex items-center flex-shrink-0 px-4 uppercase;

  height: 70px;
  background-color: #3375ff;
}
</style>