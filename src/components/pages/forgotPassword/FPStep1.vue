<template>
  <Card>
    <template v-slot:title>
      <span>Forgot Password</span>
    </template>
    <template v-slot:content>
      <div>
        <TextField
          label="Email"
          placeholder="hello@esmart.com"
          type="email"
          v-model="username"
          :error="formError"
        />
      </div>
      <div class="card__actions">
        <router-link
          :to="{ name: 'Login' }"
          class="font-bold text-blue text-xs"
        >
          I remember my password
        </router-link>
        <Button
          :isDisabled="v$.$invalid"
          :isLoading="isLoading"
          @clicked="request()"
        >
          <span>Send me a reset code</span>
        </Button>
      </div>
    </template>
  </Card>
</template>

<script>
import { ref, inject } from "vue";
import useVuelidate from "@vuelidate/core";
import { required, email } from "@vuelidate/validators";
export default {
  emits: ["go-to-step-2"],
  setup(props, { emit }) {
    const username = ref("");
    const userStore = inject("userStore");
    const isLoading = ref(false);
    const formError = ref("");

    //Vuelidate
    const rules = {
      username: {
        required,
        email,
      },
    };
    const v$ = useVuelidate(rules, { username });
    //End of Vuelidate

    const request = async () => {
      formError.value = "";
      isLoading.value = true;
      try {
        const resp = await userStore.requestResetPasswordEmail(username.value);
        emit("go-to-step-2");
      } catch (error) {
        formError.value =
          "Uh oh... can't send you a reset code for now. Please try later.";
      }
      isLoading.value = false;
    };
    return { v$, username, request, isLoading, formError };
  },
};
</script>


<style lang="scss" scoped>
.card {
  &__actions {
    @apply flex items-center justify-between;
  }
}
</style>