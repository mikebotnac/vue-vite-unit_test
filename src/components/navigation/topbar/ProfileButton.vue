<template>
  <router-link to="/profile" class="flex items-center">
    <div
      class="
        profile__picture
        bg-blue
        rounded-full
        flex
        items-center
        justify-center
      "
      :class="routeName === 'Profile' ? 'bg-black' : ''"
    >
    <span class="text-xs font-bold text-white">{{props.user && props.user.name && props.user.name[0]}}</span>
    </div>
    <p class="ml-2 text-xs hidden md:block">{{ props.user && props.user.email }}</p>
  </router-link>
</template>

<script>
import { computed } from "vue";
import { useRoute } from "vue-router";
export default {
  props: {
    user: Object,
  },
  setup(props) {
    const route = useRoute();
    const routeName = computed(() => {
      return route.name;
    });
    return { props, routeName };
  },
};
</script>

<style lang="scss" scoped>
.profile__picture {
  height: 38px;
  width: 38px;
}
</style>