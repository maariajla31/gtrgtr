<template>
  <div
    class="modal fade"
    id="change-password-modal"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
    tabindex="-1"
    aria-labelledby="ChangePasswordModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header bg-secondary py-2 bg-gradient text-light">
          <h5 class="modal-title">
            <i class="fas fa-key fa-fw me-2"></i>
            Cambiar Contraseña
          </h5>
          <button
            type="button"
            class="btn-close btn-sm btn-close-white"
            aria-label="Close"
            ref="close"
            @click="closeModal"
          ></button>
        </div>
        <div class="modal-body">
          <form
            :class="{ 'is-invalid': errors.includes('formError') }"
            aria-describedby="formErrorsFeedback"
            novalidate
          >
            <input type="hidden" v-model="username" id="username" />
            <input type="hidden" v-model="userEmail" id="email" />
            <div class="d-flex flex-column">
              <div class="form-floating mb-3">
                <input
                  type="password"
                  class="form-control"
                  :class="{ 'is-invalid': errors.includes('oldPassword') }"
                  id="password"
                  ref="password"
                  placeholder="Contraseña anterior"
                  aria-describedby="validationOldPasswordFeedback"
                  v-model="oldPassword"
                  @blur="typeOldPassword"
                  required
                />
                <div
                  id="validationOldPasswordFeedback"
                  class="invalid-feedback"
                >
                  {{ invalidOldPasswordMessage }}
                </div>
                <label for="oldPassword">Contraseña anterior</label>
              </div>
              <div class="mb-3">
                <div
                  class="input-group"
                  :class="{ 'is-invalid': errors.includes('newPassword') }"
                >
                  <div class="form-floating col">
                    <input
                      :type="showPassword ? 'text' : 'password'"
                      class="form-control rounded-0 rounded-start"
                      id="newPassword"
                      ref="newPassword"
                      placeholder="Contraseña nueva"
                      aria-describedby="validationNewPasswordFeedback"
                      v-model="newPassword"
                      @blur="validateNewPassword"
                      required
                    />
                    <label for="password">Contraseña nueva</label>
                  </div>
                  <button
                    class="btn btn-outline-secondary pt-1"
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
                  id="validationNewPasswordFeedback"
                  class="invalid-feedback"
                >
                  {{ invalidNewPasswordMessage }}
                </div>
              </div>
              <div class="form-floating mb-3">
                <input
                  type="password"
                  class="form-control"
                  :class="{ 'is-invalid': errors.includes('confirmPassword') }"
                  id="confirmPassword"
                  ref="confirmPassword"
                  placeholder="Confirmar Contraseña"
                  aria-describedby="validationConfirmPasswordFeedback"
                  v-model="confirmPassword"
                  @blur="validateConfirmPassword"
                  required
                />
                <div
                  id="validationConfirmPasswordFeedback"
                  class="invalid-feedback"
                >
                  {{ invalidConfirmPasswordMessage }}
                </div>
                <label for="confirmPassword">Confirmar contraseña nueva</label>
              </div>
            </div>
            <div id="capslock-on" class="text-warning small" v-if="capsLockOn">
              <span class="small">
                <i class="fas fa-exclamation-triangle fa-fw me-1"></i>
                BloqMayús (CapsLock) está activado.
              </span>
            </div>
          </form>
          <div id="formErrorsFeedback" class="invalid-feedback">
            {{ formErrorMessage }}
          </div>
        </div>
        <div class="modal-footer justify-content-center">
          <div class="order-2">
            <button
              @click="changePassword()"
              type="button"
              class="btn btn-outline-secondary mx-3 order-2"
              :disabled="!isValid || saving"
            >
              Aceptar
              <i v-if="saving" class="fas fa-spinner fa-spin fa-fw ms-1"></i>
            </button>
          </div>
          <div class="order-1">
            <button
              type="button"
              class="btn btn-outline-primary mx-3 order-1"
              :disabled="saving"
              @click="closeModal"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import firebase from "firebase/app";
import "firebase/auth";
import * as bs from "bootstrap";
import {
  // PasswordValidationResponse,
  validationTools
} from "@/mixins/validationTools";

export default defineComponent({
  name: "change-password-modal",
  emits: ["passwordChanged"],
  data() {
    return {
      modalObject: {} as any,
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
      // passwordValidation: new PasswordValidationResponse(),
      errors: Array<string>(),
      invalidOldPasswordMessage: "",
      invalidNewPasswordMessage: "",
      invalidConfirmPasswordMessage: "",
      formErrorMessage: "",
      saving: false,
      showPassword: false,
      capsLockOn: false
    };
  },
  computed: {
    isValid(): boolean {
      return (
        this.oldPassword.length > 5 &&
        this.newPassword.length > 5 &&
        this.newPassword === this.confirmPassword
      );
    },
    username(): string {
      return firebase.auth().currentUser?.displayName || "";
    },
    userEmail(): string {
      return firebase.auth().currentUser?.email || "";
    }
  },
  methods: {
    typeOldPassword() {
      this.errors = this.errors.filter((error) => error !== "oldPassword");
      this.invalidOldPasswordMessage = "";
    },
    validateConfirmPassword() {
      if (this.newPassword !== this.confirmPassword) {
        this.errors.push("confirmPassword");
        this.invalidConfirmPasswordMessage = "Las contraseñas no coinciden";
      } else {
        this.errors = this.errors.filter(
          (error) => error !== "confirmPassword"
        );
        this.invalidConfirmPasswordMessage = "";
      }
    },
    validateNewPassword() {
      // this.passwordValidation = "";
      // if (this.passwordValidation) {
      //   this.errors.push("newPassword");
      //   this.invalidNewPasswordMessage = "this.passwordValidation.userMessage";
      // } else {
      //   this.errors = this.errors.filter((error) => error !== "newPassword");
      //   this.invalidNewPasswordMessage = "";
      // }
    },
    changePassword() {
      this.saving = true;
      this.errors = [];
      const userEmail = firebase.auth().currentUser?.email || "";
      const credential = firebase.auth.EmailAuthProvider.credential(
        userEmail,
        this.oldPassword
      );
      firebase
        .auth()
        .currentUser?.reauthenticateWithCredential(credential)
        .then(() => {
          return firebase
            .auth()
            .currentUser?.updatePassword(this.newPassword)
            .then(() => {
              this.$emit(
                "passwordChanged",
                "Cambio de contrasña exitoso",
                "La contraseña ha sido cambiada de manera exitosa."
              );
              this.oldPassword = "";
              this.newPassword = "";
              this.confirmPassword = "";
              this.closeModal();
            })
            .catch((error) => {
              return Promise.reject(error);
            });
        })
        .catch((e) => {
          const error = new Error();
          if (e.code) {
            switch (e.code) {
              case "auth/wrong-password":
                error.message = "La contraseña anterior es incorrecta.";
                this.invalidOldPasswordMessage = error.message;
                this.errors.push("oldPassword");
                this.oldPassword = "";
                break;
              case "auth/weak-password":
                error.message = "La contraseña es muy débil.";
                this.invalidNewPasswordMessage = error.message;
                this.errors.push("newPassword");
                break;
              case "auth/invalid-password":
                error.message = "La contraseña no es válida.";
                this.invalidNewPasswordMessage = error.message;
                this.errors.push("newPassword");
                break;
              case "auth/user-mismatch":
                error.message =
                  "El usuario es incorrecto o no coincide con el usuario autenticado.";
                this.formErrorMessage = error.message;
                this.errors.push("formError");
                break;
              default:
                error.message = "Error al cambiar la contraseña.\n" + e.message;
                this.formErrorMessage = error.message;
                this.errors.push("formError");
                break;
            }
          } else {
            error.message = "Error al cambiar la contraseña.\n" + e.message;
            this.formErrorMessage = error.message;
            this.errors.push("formError");
          }
          console.log(e);
        })
        .finally(() => {
          this.saving = false;
        });
    },
    closeModal() {
      this.oldPassword = "";
      this.newPassword = "";
      this.confirmPassword = "";
      this.errors = [];
      this.invalidOldPasswordMessage = "";
      this.invalidNewPasswordMessage = "";
      this.invalidConfirmPasswordMessage = "";
      this.formErrorMessage = "";
      this.modalObject.hide();
    }
  },
  mounted() {
    this.modalObject = bs.Modal.getOrCreateInstance(
      document.getElementById("change-password-modal")
    );
    const inputs = [];
    inputs.push(this.$refs.password as HTMLInputElement);
    inputs.push(this.$refs.newPassword as HTMLInputElement);
    inputs.push(this.$refs.confirmPassword as HTMLInputElement);

    inputs.forEach((input) => {
      input.addEventListener("keyup", (event) => {
        this.capsLockOn = event.getModifierState("CapsLock");
      });
    });
  },
  setup() {
    const validatePassword = validationTools.methods;
    return {
      validatePassword
    };
  }
});
</script>
