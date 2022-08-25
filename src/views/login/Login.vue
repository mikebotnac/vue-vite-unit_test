<template>
  <MFAStep1
    v-if="step === 'mfa1'"
    @mfa-step1-passed="step = 'mfa2'"
    @force-reset-password="step = 'force_reset'"
    @go-to-forgot-password="goToForgotPassword()"
  />
  <MFAStep2 v-else-if="step === 'mfa2'" />
  <ForceResetPassword
    v-else-if="step === 'force_reset'"
    @mfa-step1-passed="step = 'mfa2'"
  />
</template>

<script>
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
export default {
  name:"LoginPage",
  setup() {
    
    const route = useRoute();
    const routeName = computed(() => route.name);
    const router = useRouter();
    const step = ref("");

    step.value = "mfa1";

    const goToForgotPassword = () => {
      router.push("/forgot-password");
    };

    return { routeName, step, goToForgotPassword };
  },
};
</script>

