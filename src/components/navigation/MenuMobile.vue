<template>
  <nav :class="isMobileMenuOpenned ? 'openned' : ''">
    <div class="nav__container">
      <div v-for="item in navigation" :key="item.name" class="mb-6">
        <div
          class="mb-2"
          :class="item.hiddenOnMobile ? 'hidden desktop:flex' : 'flex'"
        >
          <img :src="getIcon(item.icon)" class="mr-2 h-4 w-4" />
          <p class="uppercase text-grayblue text-xs">
            {{ item.name }}
          </p>
        </div>
        <router-link
          class="ml-6 block text-white text-xs mb-2"
          v-for="sub in item.children"
          :key="sub.name"
          :to="{ name: sub.to }"
          :class="[
            isActive(sub) ? 'font-bold' : 'font-light',
            sub.hiddenOnMobile ? 'hidden desktop:block' : '',
          ]"
        >
          {{ sub.name }}
        </router-link>
      </div>
      <div
        @click="
          () => {
            showLogoutPopup = true;
          }
        "
        class="flex items-center text-white cursor-pointer"
      >
        <img :src="getIcon('logout')" class="mr-2 h-4 w-4" />
        <p>Logout</p>
      </div>
      <Teleport to="#modal-container" v-if="showLogoutPopup">
        <LogoutModal @close="showLogoutPopup = false" @logout="logoutUser" />
      </Teleport>
      <div class="block border-t-1 border-white pt-10 px-4">
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
  </nav>
</template>

<script>
import { ref, inject, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
export default {
  setup() {
    const openned = ref(false);
    const route = useRoute();
    const routeName = computed(() => {
      return route.name;
    });

    const userStore = inject("userStore");
    const router = useRouter();

    const navigationStore = inject("navigationStore");
    const navigation = computed(() => {
      return navigationStore.state.navigation;
    });
    const isMobileMenuOpenned = computed(() => {
      return navigationStore.state.isMobileMenuOpenned;
    });
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

    const showLogoutPopup = ref(false);
    const logoutUser = async () => {
      showLogoutPopup.value = false;
      router.push("/login");
      setTimeout(() => {
        userStore.logout();
      }, 300);
    };

    return {
      openned,
      isMobileMenuOpenned,
      navigation,
      showLogoutPopup,
      getIcon,
      isActive,
      logoutUser,
    };
  },
};
</script>

<style lang='scss' scoped>
nav {
  @apply bg-red-400
    inset-0
    top-[70px]
    h-full
    w-full
    z-[100]
    duration-200
    bg-gradient-to-b from-[#1b63ff] to-[#399cff]
    transform
    translate-x-[-100%];

  &.openned {
    @apply translate-x-0;
  }

  .nav__container {
    @apply p-6;
  }
}
</style>