<template>
  <div class="card">
    <div class="card__header">Forgot password</div>
    <div class="card__content">
      <TextField
        label="Confirmation Code"
        placeholder="123456"
        v-model="credentials.confirmationCode"
      />
      <TextField
        label="New password"
        placeholder="123456"
        v-model="credentials.password"
      />
      <div class="flex flex-col regexs">
        <span :class="credentials.password.length > 16 ? 'valid' : ''">
          {{ t(`user.password.requirements.length`) }} {{ credentials.password.length }})
        </span>
        <span
          :class="
            passwordRegexUppercase.test(credentials.password) ? 'valid' : ''
          "
        >
          {{ t(`user.password.requirements.uppercase`) }}
        </span>
        <span
          :class="
            passwordRegexLowercase.test(credentials.password) ? 'valid' : ''
          "
        >
          {{ t(`user.password.requirements.lowercase`) }}
        </span>
        <span
          :class="
            passwordRegexSpecial.test(credentials.password) ? 'valid' : ''
          "
        >
          {{ t(`user.password.requirements.specialCharacter`) }}
        </span>
      </div>
    </div>
    <div class="card__actions">
      <p class="font-bold text-blue text-xs cursor-pointer" @click="resend()">
        {{ resendIsLoading ? "Loading..." : "Resend me a code" }}
      </p>
      <Button
        :isDisabled="v$.$invalid"
        :isLoading="isLoading"
        @clicked="reset()"
      >
        <span>Reset password</span>
      </Button>
    </div>
  </div>
</template>

<script setup>
import { ref, inject, reactive, computed } from "vue";
import { useRouter } from "vue-router";
import useVuelidate from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import { useTranslation } from "../../../composables/lang";
const { t } = useTranslation();

const router = useRouter();
const userStore = inject("userStore");
const credentials = reactive({
  confirmationCode: "",
  password: "",
});

const isLoading = ref(false);
const errors = reactive({
  confirmation_code: null,
  password: null,
});

//Vuelidate
const passwordRegexUppercase = new RegExp(/^(?=.*?[A-Z])/);
const passwordRegexLowercase = new RegExp(/^(?=.*?[a-z])/);
const passwordRegexSpecial = new RegExp(/^(?=.*?[@$!%*?&_-])/);
const passwordRegex = helpers.regex(
  credentials.password,
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*d)(?=.*[@$!%*?&_-])[A-Za-zd@$!%*?&_-]{16,}$/
);
const rules = computed(() => {
  return {
    confirmationCode: {
      required,
    },
    password: {
      required,
      valid: () => {
        return passwordRegex();
      },
    },
  };
});
const v$ = useVuelidate(rules, credentials);
//End of Vuelidate

//Send the reset query
const reset = async () => {
  isLoading.value = true;
  try {
    await userStore.resetPassword({
      confirmation_code: credentials.confirmationCode,
      password: credentials.password,
    });
    isLoading.value = false;
    router.push("/login");
  } catch (error) {
    if (error.message.includes("Invalid verification code provided")) {
      errors.confirmation_code = "Invalid verification code provided.";
    }
    isLoading.value = false;
  }
};

const resendIsLoading = ref(false);
const resend = async () => {
  resendIsLoading.value = true;
  try {
    await userStore.requestResetPasswordEmail(userStore.state.fp_username);
    resendIsLoading.value = false;
  } catch {
    resendIsLoading.value = false;
    errors.confirmation_code = "Can't send you a reset code.";
  }
};
</script>

<style lang="scss" scoped>
.card {
  @apply rounded-xl w-full h-full overflow-hidden flex flex-col bg-white;
  @apply md:h-auto;

  .card__header {
    @apply bg-darkgray text-xs text-white font-bold p-4;
  }

  .card__content {
    @apply p-6 flex-1;

    @media (min-width: 1024px) {
      padding: 40px 40px 0;
    }
  }

  .card__actions {
    @apply p-6 flex items-center justify-between;

    @media (min-width: 1024px) {
      padding: 20px 40px 40px;

      button {
        min-width: 100px;
      }
    }
  }
}

.regexs {
  span {
    @apply text-orange;

    &.valid {
      @apply text-green;
    }
  }
}
</style>