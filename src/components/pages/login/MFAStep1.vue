<template>
  <Card>
    <template v-slot:title>
      <span>Login</span>
    </template>
    <template v-slot:content>
      <form class="space-y-4">
        <TextField
          type="email"
          label="Email"
          placeholder="hello@esmart.io"
          v-model="credentials.username"
          :error="errors.username"
        />
        <PasswordField
          type="password"
          label="Password"
          placeholder="******"
          v-model="credentials.password"
          :error="errors.password"
        />
      </form>
      <div class="card__actions">
        <router-link
          :to="{ name: 'ForgotPassword' }"
          class="font-bold text-blue text-xs"
        >
          Forgot your password ?
        </router-link>
        <Button
          :isLoading="isLoading"
          :isDisabled="v$.$invalid"
          @click="signin()"
        >
          <span>Log in</span>
        </Button>
      </div>
      <div class="login__sso">
        <div> Or log with </div>
        <div class="login__sso__provider">
          <img @click="goToOkta()" :src="OktaIcon" class="login__sso__provider__okta"/>
        </div>
      </div>
    </template>
  </Card>
</template>

<script>
import { inject, reactive, ref } from "vue";
import isEmailValid from "../../../utils/email";
import useVuelidate from "@vuelidate/core";
import { useRoute, useRouter } from "vue-router";
import { required, email } from "@vuelidate/validators";
import OktaIcon from "../../../assets/icons/okta.png";
export default {
  emits: ["mfa-step1-passed", "go-to-forgot-password", "force-reset-password"],

  setup(_, { emit }) {
    const userStore = inject("userStore");

    const route = useRoute();
    const router = useRouter();

    const credentials = reactive({
      username: route?.query?.username || "",
      password: "",
    });

    //Vuelidate
    const rules = {
      username: {
        required,
        email,
      },
      password: {
        required,
      },
    };
    const v$ = useVuelidate(rules, credentials);
    //End of Vuelidate

    const errors = reactive({
      username: null,
      password: null,
    });

    const isLoading = ref(false);
    const signin = async () => {
      errors.username = errors.password = null;
      if (
        credentials.username &&
        isEmailValid(credentials.username) &&
        credentials.password
      ) {
        isLoading.value = true;
        try {
          const resp = await userStore.login(credentials);
          const { data: { challenge } } = resp;
          emit(challenge !== "NEW_PASSWORD_REQUIRED" ? "mfa-step1-passed" : "force-reset-password");
        } catch (err) {
          errors.username = errors.password = "Wrong credentials";
        } finally {
          isLoading.value = false;
        }
      } else {
        if (!credentials.username) {
          errors.username = "There is no email";
        } else {
          if (!isEmailValid(credentials.username)) {
            errors.username = "This email is not valid";
          }
        }
        if (!credentials.password) {
          errors.password = "There is no password";
        }
      }
    };
    const forgotPassword = () => {
      emit("go-to-forgot-password");
    };

    const goToOkta = async () => {
      let ulrRedirect = `${import.meta.env.VITE_OKTA_SAML}/login?response_type=token`;
      ulrRedirect += `&client_id=${import.meta.env.VITE_SAML_CLIENT_ID}&redirect_uri=${import.meta.env.VITE_BASE_URL}`;
      window.location.href = encodeURI(ulrRedirect);
    }

    return { v$, signin, forgotPassword, credentials, isLoading, errors, OktaIcon, goToOkta };
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

.login {
  &__sso {
    display: grid;

    div {
      margin: 15px auto;
    }

    &__provider {
      &__okta {
        width: 120px;
      }
    }
  }
}
</style>