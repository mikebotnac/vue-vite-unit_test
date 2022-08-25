<template>
  <span>Login you out...</span>
</template>

<script>
import { inject } from "vue";
import { useRouter } from "vue-router";
export default {
  setup() {
    const logout = async () => {
      const router = useRouter();
      const userStore = inject("userStore");
      await userStore.logout();
      setTimeout(() => {
        router.push("/login");
      }, 1000);
    };
    logout();
  },
};
</script>