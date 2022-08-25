<template>
  <div class="topbar flex items-center bg-white">
    <div
      class="topbar__left bg-blue h-full flex items-center p-4"
      :class="isSidenavOpen ? 'openned' : ''"
    >
      <img
        src="../../assets/icons/navigation/burger.svg"
        alt="burger-icon"
        class="h-4 cursor-pointer"
        @click="isSidenavOpen ? closeSidenav() : openSidenav()"
      />
      <p class="md:ml-2 text-xs text-white opacity-30"> {{t("menu.title")}}</p>
    </div>
    <div class="flex flex-1 justify-between p-4">
      <div class="flex items-center">
        <img
          id="nav__logo"
          src="../../assets/esmart-logo.svg"
          alt=""
          class="h-[19px]"
        />
      </div>
      <div class="flex items-center space-x-4">
        <div class="w-[200px] hidden md:block">
          <AutocompleteField
            v-model="unitSelected"
            placeholder="Find a vehicle"
            clickabled
            :options="userUnits"
            @search="openVehicleLocator"
          />
        </div>

        <div
          v-if="route.name !== 'MapVehicules'"
          class="
            md:hidden
            border-1 border-[#eaeef3]
            rounded
            h-[38px]
            w-[38px]
            flex
            justify-center
            items-center
          "
          @click="openVehicleLocator()"
        >
          <img src="../../assets/icons/inputs/search.svg" alt="" />
        </div>

        <ProfileButton v-if="user" :user="user" />
        <template class="hidden lg:flex">
          <SquareButton icon="phone" class="mr-2" />
          <SquareButton icon="mail" />
        </template>
        
        <LanguageSelector />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, inject, nextTick, ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useTranslation } from '../../composables/lang';
const { t, locale } = useTranslation();
const navigationStore = inject("navigationStore");
const userStore = inject("userStore");
const user = computed(() => userStore.state.user);
const isSidenavOpen = computed(() => {
  return navigationStore.state.isSidenavOpen;
});
const isMobileMenuOpenned = computed(() => {
  return navigationStore.state.isMobileMenuOpenned;
});
const closeSidenav = () => {
  navigationStore.closeSidenav();
};
const openSidenav = () => {
  navigationStore.openSidenav();
};
const closeMenuMobile = () => {
  navigationStore.closeMenuMobile();
};
const openMenuMobile = () => {
  navigationStore.openMenuMobile();
};

const unitSelected = ref("");

const userUnits = computed(() => {
  if (!userStore.state.user.units.loading) {
    return userStore.state.user.units.data.map((u) => u.unit_name);
  }
  return [];
});

const router = useRouter();
const route = useRoute();

const openVehicleLocator = (unit) => {
  router.push({
    name: "MapVehicules",
    params: {
      id: unit,
    },
  });
};
</script>

<style lang="scss" scoped>
.topbar {
  height: 70px;

  .topbar__left {
    img {
      z-index: 9000;
    }

    background-color: #3375ff;

    @apply justify-center;
    @apply tablet:justify-start;

    p {
      @apply mobile:hidden tablet:hidden desktop:block;
    }

    @apply mobile:w-70 tablet:w-70;
    @apply desktop:w-menu;

    &.openned {
      p {
        @apply mobile:hidden tablet:block desktop:block;
      }
    }
  }

  #nav__logo {
    height: 14px;
  }
}
</style>