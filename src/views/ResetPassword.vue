<template>
  <div class="row justify-content-center">
    <div class="col-md-9 col-lg-8 col-xl-6">
      <form role="form" @submit.prevent>
        <div class="card auth-form-card">
          <div class="card-header p-4 text-center">
            <img
              class="img-fluid"
              src="../assets/img/gtr_academy-300x115.png"
              alt="GTR Academy"
            />
          </div>
          <div class="card-body">
            <div class="card-text">
              <div class="mb-3">
                <div class="input-group">
                  <span class="input-group-text">
                    <i class="fas fa-lock fa-fw"></i>
                  </span>
                  <input
                    :type="showPassword ? 'text' : 'password'"
                    class="form-control"
                    placeholder="Nueva contraseña"
                    aria-label="Contraseña"
                    id="password"
                    ref="password"
                    autocomplete="current-password"
                    v-model.trim="loginForm.password"
                    @blur="validatePasswords()"
                  />
                  <button
                    class="btn btn-secondary pt-1"
                    type="button"
                    id="show-password"
                    @click="showPassword = !showPassword"
                  >
                    <i
                      class="fas fa-xs fa-fw"
                      :class="showPassword ? 'fa-eye-slash' : 'fa-eye'"
                    ></i>
                  </button>
                </div>
                <div
                  class="auth-error-message-box text-center rounded-bottom small mx-3 text-light "
                >
                  <div
                    v-if="!validPassword"
                    class="bg-danger bg-opacity-50 p-2"
                  >
                    <i
                      class="fas fa-exclamation-triangle fa-fw me-2 text-danger"
                    ></i
                    >{{ passwordValidation.userMessage }}
                  </div>
                </div>
              </div>
              <div>
                <div class="input-group mb-1">
                  <span class="input-group-text">
                    <i class="fas fa-lock fa-fw"></i>
                  </span>
                  <input
                    type="password"
                    class="form-control"
                    placeholder="Confirmar nueva contraseña"
                    aria-label="Contraseña"
                    id="confirmPassword"
                    ref="confirmPassword"
                    autocomplete="current-password"
                    v-model.trim="loginForm.passwordConfirm"
                    @blur="validatePasswords()"
                  />
                </div>
                <div
                  class="auth-error-message-box text-center rounded-bottom small mx-3 text-light "
                >
                  <div
                    v-if="!validPasswordConfirm"
                    class="bg-danger bg-opacity-50 p-2"
                  >
                    <i
                      class="fas fa-exclamation-triangle fa-fw me-2 text-danger"
                    ></i
                    >Las contraseñas no coinciden.
                  </div>
                </div>
                <div
                  id="capslock-on"
                  class="ms-2 text-warning small"
                  v-if="capsLockOn"
                >
                  <span class="small">
                    <i class="fas fa-exclamation-triangle fa-fw me-1"></i>
                    BloqMayús (CapsLock) está activado.
                  </span>
                </div>
              </div>
              <div class="text-center">
                <button
                  @click="resetPassword()"
                  class="btn btn-secondary my-4 w-100"
                  :disabled="invalidInputs()"
                >
                  Cambiar contraseña
                  <i v-if="loading" class="fas fa-spinner fa-spin"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import router from "@/router";
import {
  // PasswordValidationResponse,
  validationTools
} from "@/mixins/validationTools";

export default defineComponent({
  name: "ResetPassword",
  data() {
    return {
      capsLockOn: false,
      showPassword: false,
      loading: false,
      // passwordValidation: new PasswordValidationResponse(),
      validPassword: true,
      validPasswordConfirm: true,
      loginForm: {
        password: "",
        passwordConfirm: ""
      }
    };
  },
  methods: {
    invalidInputs() {
      return (
        !this.loginForm.passwordConfirm ||
        !this.loginForm.password ||
        this.loginForm.passwordConfirm != this.loginForm.password
      );
    },
    resetPassword() {
      this.loading = true;
      const _token = this.$route.params.token;
      this.$store
        .dispatch("auth/resetPassword", {
          token: _token,
          pw: this.loginForm.password
        })
        .then((response) => {
          if (response.OPCODE == "SUCCESS") {
            this.loading = false;
            alert(response.message);
            router.push({ name: "login" });
          } else {
            this.loading = false;
            alert(response.message);
          }
        })
        .catch((error) => {
          this.loading = false;
          alert(error.message);
        });
    },
    validatePasswords() {
      this.validatePasswordInput();
      this.validatePasswordConfirm();
    },
    validatePasswordInput() {
      // this.passwordValidation = this.validatePassword(this.loginForm.password);
      // this.validPassword = !this.passwordValidation;
    },
    validatePasswordConfirm() {
      if (
        this.loginForm.passwordConfirm.length > 0 &&
        this.loginForm.passwordConfirm != this.loginForm.password
      ) {
        this.validPasswordConfirm = false;
        return;
      }
      this.validPasswordConfirm = true;
    }
  },
  mounted() {
    const inputs = [];
    inputs.push(this.$refs.password as HTMLInputElement);
    inputs.push(this.$refs.confirmPassword as HTMLInputElement);

    inputs.forEach((input) => {
      input.addEventListener("keyup", (event) => {
        this.capsLockOn = event.getModifierState("CapsLock");
      });
    });
  },
  setup() {
    // const validatePassword = validationTools.methods.validPassword;
    // return {
    //   validatePassword
    // };
  }
});
</script>
