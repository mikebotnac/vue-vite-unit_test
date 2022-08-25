<template>
  <Card>
    <template v-slot:title>
      <span>SMS Verification</span>
    </template>
    <template v-slot:content>
      <p class="text-xs mb-4">
        You will receive soon an sms with a validation code.
      </p>

      <TextField
        label="Verification Code"
        placeholder="012345"
        v-model="code"
        :error="error"
      />
      <div class="card__actions">
        <p class="font-bold text-blue text-xs cursor-pointer" @click="resend()">
          {{ resendIsLoading ? "Loading..." : "Resend me an sms" }}
        </p>
        <Button :isDisabled="!code" :isLoading="isLoading" @click="verify()">
          <span>Verify Me</span>
        </Button>
      </div>
    </template>
  </Card>
</template>

<script>
import { inject, ref } from "vue";
import router from "../../../router";
export default {
  setup() {
    const userStore = inject("userStore");
    const isLoading = ref(false);
    const resendIsLoading = ref(false);
    const error = ref("");
    const code = ref("");
    const verify = async () => {
      isLoading.value = true;
      try {
        await userStore.verifySmsCode(code.value);
        router.replace({ name: "MapVehicules" });
      } catch (err) {
        error.value = "Wrong sms code";
      } finally {
        isLoading.value = false;
      }
    };

    const resend = async () => {
      resendIsLoading.value = true;
      await userStore.resendSmsCode();
      resendIsLoading.value = false;
    };

    return { verify, isLoading, code, error, resend, resendIsLoading };
  },
};
</script>

<style lang="scss" scoped>
.card__actions {
  @apply flex items-center justify-between;
}
</style>