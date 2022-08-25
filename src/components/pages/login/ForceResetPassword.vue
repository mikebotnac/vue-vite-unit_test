<template>
  <Card>
    <template v-slot:title>
      <span>Reset Password</span>
    </template>
    <template v-slot:content>
      <form class="space-y-4">
        <TextField
          type="password"
          label="New Password"
          placeholder="******"
          v-model="creds.password"
          :error="errors.password"
        />
        <PasswordField
          type="password"
          label="Repeat Password"
          placeholder="******"
          v-model="creds.repeat_password"
          :error="errors.repeat_password"
        />
      </form>
      <div class="card__actions">
        <Button
          :isLoading="isLoading"
          :isDisabled="v$.$invalid"
          @click="reset()"
        >
          <span>Reset Password</span>
        </Button>
      </div>
    </template>
  </Card>
</template>

<script>
import { inject, reactive, ref } from "vue";
import isEmailValid from "../../../utils/email";
import useVuelidate from "@vuelidate/core";
import { required, email } from "@vuelidate/validators";
export default {
  emits: ["mfa-step1-passed"],

  setup(_, { emit }) {

    const userStore = inject("userStore");

    const creds = reactive({
      password: "",
      repeat_password: "",
    });

    //Vuelidate
    const rules = {
      password: {
        required,
      },
      repeat_password: {
        required,
      },
    };
    const v$ = useVuelidate(rules, creds);
    //End of Vuelidate

    const errors = reactive({
      password: null,
      repeat_password: null,
    });

    const isLoading = ref(false);
    const reset = async () => {
      errors.password = errors.repeat_password = null;
      if (
        creds.password &&
        creds.repeat_password &&
        creds.password === creds.repeat_password
      ) {
        isLoading.value = true;
        try {
          await userStore.forceResetPassword(creds);
          emit("mfa-step1-passed");
        } catch (err) {
          errors.password = errors.repeat_password = "Wrong credentials";
        } finally {
          isLoading.value = false;
        }
      } else {
        if (!creds.password) {
          errors.password = "There is no password";
        }
        if (!creds.repeat_password) {
          errors.repeat_password = "There is no verification password";
        }
        if (creds.password === creds.repeat_password) {
           errors.repeat_password = "Both passwords need to be identical";
        } 
      }
    };

    return { v$, reset, creds, isLoading, errors };
  },
};
</script>

<style lang="scss" scoped>
.card__actions {
  @apply flex items-center justify-between;

  button {
    @apply w-100;
  }
}
</style>