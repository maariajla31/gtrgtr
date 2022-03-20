<template>
  <div class="row justify-content-center">
    <div class="col-md-9 col-lg-8 col-xl-6">
      <form role="form" @submit.prevent novalidate>
        <div class="card auth-form-card">
          <div class="card-header p-4 text-center">
            <img
              class="img-fluid"
              src="../assets/img/gtr_academy-300x115.png"
              alt="Genera tu Riqueza"
            />
          </div>
          <div class="card-body">
            <div class="card-text">
              <div class="text-center mb-2 d-none">
                <button @click="generarUsuario" class="btn btn-outline-info">
                  <i class="fas fa-hat-wizard"></i>
                </button>
              </div>
              <!-- email -->
              <div class="mb-3">
                <div class="input-group">
                  <span class="input-group-text">
                    <i class="fas fa-envelope fa-fw"></i>
                  </span>
                  <input
                    type="text"
                    class="form-control"
                    :class="{
                      'is-invalid': emailValidation.hasError
                    }"
                    placeholder="Correo electrónico"
                    aria-label="Correo electrónico"
                    id="email"
                    ref="email"
                    autocomplete="username"
                    @input="validateEmailInput()"
                    v-model.trim="registrationForm.email"
                  />
                </div>
                <div
                  class="auth-error-message-box text-center rounded-bottom small mx-3 text-light "
                >
                  <div
                    v-if="emailValidation.hasWarning"
                    class="bg-warning bg-opacity-50 p-2"
                  >
                    <i
                      class="fas fa-exclamation-circle fa-fw me-2 text-warning"
                    ></i
                    >{{ emailValidation.userMessage }}
                  </div>
                  <div
                    v-if="emailValidation.hasError"
                    class="bg-danger bg-opacity-50 p-2"
                  >
                    <i
                      class="fas fa-exclamation-triangle fa-fw me-2 text-danger"
                    ></i
                    >{{ emailValidation.userMessage }}
                  </div>
                </div>
              </div>
              <!-- /email -->
              <!-- Username -->
              <div class="mb-3">
                <div class="text-pink text-center small mb-1">
                  <i class="fas fa-exclamation-circle fa-fw text-warning"></i>
                  El nombre de usuario no podrá ser modificado.
                </div>
                <div class="input-group">
                  <span class="input-group-text">
                    <i class="fas fa-user fa-fw"></i>
                  </span>
                  <input
                    type="text"
                    class="form-control"
                    :class="{
                      'is-invalid': invalidUsername || !usernameAvailable
                    }"
                    placeholder="Nombre de Usuario"
                    aria-label="Nombre de Usuario"
                    autocomplete="nickname"
                    id="username"
                    ref="username"
                    v-model.trim="registrationForm.username"
                    @input="validateUsernameInput()"
                  />
                </div>
                <div
                  class="auth-error-message-box text-center rounded-bottom small mx-3 text-light "
                >
                  <div
                    v-if="!usernameAvailable"
                    class="bg-danger bg-opacity-50 p-2"
                  >
                    <i
                      class="fas fa-exclamation-triangle fa-fw me-2 text-danger"
                    ></i
                    >El nombre de usuario no está disponible.
                  </div>
                  <div
                    v-if="invalidUsername"
                    class="bg-danger bg-opacity-50 p-2"
                  >
                    <i
                      class="fas fa-exclamation-triangle fa-fw me-2 text-danger"
                    ></i
                    >{{ usernameValidation.userMessage }}
                  </div>
                </div>
              </div>
              <!-- /username -->
              <!-- password -->
              <div class="mb-3">
                <div
                  id="capslock-on"
                  class="ms-2 mb-1 text-warning small"
                  v-if="capsLockOn"
                >
                  <span class="small">
                    <i class="fas fa-exclamation-triangle fa-fw me-1"></i>
                    BloqMayús (CapsLock) está activado.
                  </span>
                </div>
                <div class="input-group">
                  <span class="input-group-text">
                    <i class="fas fa-lock fa-fw"></i>
                  </span>
                  <input
                    :type="showPassword ? 'text' : 'password'"
                    class="form-control"
                    :class="{
                      'is-invalid': !validPassword
                    }"
                    placeholder="Contraseña"
                    aria-label="Contraseña"
                    autocomplete="new-password"
                    id="password"
                    ref="password"
                    v-model.trim="registrationForm.password"
                    @input="validatePasswords()"
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
              <!-- /password -->
              <!-- Confirm password -->
              <div class="mb-3">
                <div class="input-group">
                  <span class="input-group-text">
                    <i class="fas fa-lock fa-fw"></i>
                  </span>
                  <input
                    type="password"
                    class="form-control"
                    :class="{
                      'is-invalid': !validPasswordConfirm
                    }"
                    placeholder="Confirmar Contraseña"
                    aria-label="Confirmar Contraseña"
                    autocomplete="new-password"
                    id="confirmPassword"
                    ref="confirmPsw"
                    v-model.trim="registrationForm.passwordConfirm"
                    @input="validatePasswords()"
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
              </div>
              <!-- /confirm password -->
              <!-- Enroller -->
              <div class="mb-3">
                <div class="input-group">
                  <span class="input-group-text">
                    <i class="fas fa-user-circle fa-fw"></i>
                  </span>
                  <span
                    type="text"
                    class="form-control"
                    placeholder="Patrocinador"
                    aria-label="Patrocinador"
                    id="enroller"
                  >
                    {{ registrationForm.enroller }}
                  </span>
                </div>
              </div>
              <!-- /enroller -->
              <div class="px-2">
                <div class="form-check">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    value=""
                    id="chkAgreeTerms"
                    v-model.trim="registrationForm.acceptTerms"
                  />
                  <label
                    class="form-check-label text-light"
                    for="flexCheckDefault"
                  >
                    Acepto los Términos y Condiciones, así como el Acuerdo de
                    Distribuidor.
                  </label>
                </div>
              </div>
              <div class="text-center">
                <button
                  @click="doRegister()"
                  class="btn btn-secondary mt-4 w-100"
                  :disabled="
                    invalidFields() || loading || !emailOK || !usernameOK
                  "
                >
                  {{ buttonLabel }}
                  <i v-if="loading" class="fas fa-spinner fa-spin"></i>
                </button>
              </div>
            </div>
          </div>
          <div class="card-footer">
            <div class=" text-muted small text-center">
              <div>
                <router-link class="link-pink" to="/login">
                  Ingresar
                  <i class="fas fa-user"></i>
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
  <!-- Invalid Link Modal -->
  <div
    class="modal fade"
    id="invalid-Link-modal"
    ref="invalidLinkModal"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
    tabindex="-1"
    aria-labelledby="messageModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header bg-danger bg-gradient text-light py-2">
          <h5 class="modal-title">
            <i class="fas fa-exclamation-triangle fa-fw me-2"></i>
            Liga Inválida
          </h5>
        </div>
        <div class="modal-body text-center">
          <p class="text-center text-warning">
            <i class="fas fa-exclamation-triangle fa-4x"></i>
          </p>
          <p>
            Comuníquese con un socio para que le proporcione una liga de
            registro válida.
          </p>
        </div>
      </div>
    </div>
  </div>
  <!-- Registration Confirmation Modal -->
  <div
    class="modal fade"
    id="registration-conf-modal"
    tabindex="-1"
    role="dialog"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header bg-secondary py-2 bg-gradient text-light">
          <h5 class="modal-title">
            <i class="fas fa-flag-checkered fa-fw me-2"></i>Registro Exitoso
          </h5>
        </div>
        <div class="modal-body">
          <div class="text-center mt-2 mb-4">
            <h5>Bienvenido a la familia <strong>GTR Academy!</strong></h5>
          </div>
          <p>
            Hemos enviado una liga para verificar tu correo electrónico a la
            dirección que registraste. Favor de revisar tu bandeja de entrada y
            y darle click al botón para activar todas las funciones de tu
            cuenta.
          </p>
          <p>
            Ya puedes acceder a tu plataforma desde este momento.
          </p>
        </div>
        <div class="modal-footer justify-content-between">
          <button
            type="button"
            class="btn btn-outline-secondary"
            @click="gotoLoginPage()"
          >
            Inicio
          </button>
          <button
            type="button"
            class="btn btn-outline-secondary"
            @click="refreshPage()"
          >
            <i class="fas fa-redo fa-fw"></i>
          </button>
          <button
            class="btn btn-outline-primary"
            data-bs-target="#verificationModal"
            @click="login"
            :disabled="loading"
          >
            {{ verifyModalButtonLabel }}
            <i v-if="loading" class="fas fa-spinner fa-spin"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import router from "@/router";
import * as bs from "bootstrap";
import { nombres } from "@/utils/nombres";
import {
  validationTools
  // EmailValidationResponse,
  // UsernameValidationResponse,
  // PasswordValidationResponse
} from "@/mixins/validationTools";

export default defineComponent({
  name: "Register",
  props: ["username", "side"],
  data() {
    return {
      emailTimer: undefined,
      usernameTimer: undefined,
      registrationConfirmModal: {} as any,
      capsLockOn: false,
      showPassword: false,
      registrationForm: {
        email: "",
        username: "",
        password: "",
        passwordConfirm: "",
        enroller: this.username,
        acceptTerms: false,
        picture: ""
      },
      buttonLabel: "Registrarse",
      verifyModalButtonLabel: "Ingresar",
      loading: false,
      emailOK: false,
      usernameOK: false,
      invalidUsername: false,
      usernameAvailable: true,
      // usernameValidation: new UsernameValidationResponse(),
      // emailValidation: new EmailValidationResponse(),
      // passwordValidation: new PasswordValidationResponse(),
      validPassword: true,
      validPasswordConfirm: true
    };
  },
  mounted() {
    const inputs = [];
    inputs.push(this.$refs.email as HTMLInputElement);
    inputs.push(this.$refs.username as HTMLInputElement);
    inputs.push(this.$refs.password as HTMLInputElement);
    inputs.push(this.$refs.confirmPsw as HTMLInputElement);

    inputs.forEach((input) => {
      input.addEventListener("keyup", (event) => {
        this.capsLockOn = event.getModifierState("CapsLock");
      });
    });

    const element: HTMLElement = document.getElementById(
      "registration-conf-modal"
    ) as HTMLElement;
    this.registrationConfirmModal = new bs.Modal(element);

    if (
      !this.registrationForm.enroller ||
      this.registrationForm.enroller === "gtr.academy" ||
      this.registrationForm.enroller === "rootuser"
    ) {
      const warningModal = this.$refs.invalidLinkModal as HTMLElement;
      new bs.Modal(warningModal).show();
    }
  },
  methods: {
    generarUsuario() {
      const randomUser =
        nombres[Math.floor(Math.random() * nombres.length) + 1].toLowerCase() +
        ("00" + (Math.floor(Math.random() * 99) + 1)).substr(-2);
      this.registrationForm.email = randomUser + "@email.gtr.academy";
      this.registrationForm.username = randomUser;
      this.registrationForm.password = "a123456789";
      this.registrationForm.passwordConfirm = "a123456789";
      this.registrationForm.acceptTerms = true;
    },
    doRegister() {
      this.loading = true;
      const userData = {
        email: this.registrationForm.email,
        username: this.registrationForm.username,
        password: this.registrationForm.password,
        passwordConfirm: this.registrationForm.passwordConfirm,
        enroller: this.registrationForm.enroller,
        binarySide: this.side,
        pictureURL: ""
      };
      this.$store
        .dispatch("auth/register", userData)
        .then(() => {
          this.$store
            .dispatch("auth/validateEmail", this.registrationForm.email)
            .then((response) => {
              if (response.data.OPCODE == "SUCCESS") {
                this.loading = false;
                this.registrationConfirmModal.show();
              }
            })
            .catch((error) => {
              console.log(error);
              this.loading = false;
            });
        })
        .catch((error) => {
          alert("Error: " + error.message);
          this.loading = false;
        });
    },
    async login() {
      this.loading = true;
      this.verifyModalButtonLabel = "Ingresando";
      this.buttonLabel = "Ingresando";

      if (
        await this.$store.dispatch("auth/login", {
          userIdentification: this.registrationForm.email,
          password: this.registrationForm.password
        })
      ) {
        this.registrationConfirmModal.hide();
        router.push({ name: "subscriptions" });
      }
    },
    // invalidFields(): boolean {
    //   return ( "
    //     // this.invalidUsername ||
    //     // !this.usernameAvailable ||
    //     // !this.validPassword ||
    //     // !this.validPasswordConfirm ||
    //     // !this.registrationForm.enroller ||
    //     // !this.registrationForm.username ||
    //     // !this.registrationForm.email ||
    //     // !this.registrationForm.password ||
    //     // !this.registrationForm.passwordConfirm ||
    //     // !this.registrationForm.acceptTerms ||
    //     // this.registrationForm.password !=
    //     //   this.registrationForm.passwordConfirm ||
    //     // this.validateEmail(this.registrationForm.email).hasError
    //   ");
    // },
    validateEmailInput() {
      this.emailOK = false;
      this.updateUsername();
      if (this.emailTimer !== undefined) {
        clearTimeout(this.emailTimer);
      }
      if (this.registrationForm.email.length === 0) {
        // this.emailValidation = new EmailValidationResponse();
        // this.emailValidation = true;
        // this.emailValidation = "El correo es requerido";
        return;
      }

      // this.emailTimer = setTimeout(async () => {
      //   this.emailValidation = this.validateEmail(this.registrationForm.email);
      //   this.validateUsernameInput();
      //   if (
      //     this.emailValidation === "SUCCESS" ||
      //     this.emailValidation === "WARNING"
      //   ) {
      //     if (!(await this.isEmailAvailable())) {
      //       this.emailValidation = false;
      //       this.emailValidation = false;
      //       this.emailValidation = true;
      //       this.emailValidation =
      //         "El correo electrónico ya ha sido registrado.";
      //     }
      //     this.emailOK = true;
      //   }
      //   clearTimeout(this.emailTimer);
      //   this.emailTimer = undefined;
      // }, 500);
    },
    updateUsername() {
      // const prevUsername = this.registrationForm.username;
      const newValue = this.registrationForm.email.split("@")[0];
      // if (
      // prevUsername.length === 0
      // ||
      // (newValue.startsWith(prevUsername) && prevUsername.length !== 0) ||
      // (prevUsername.startsWith(newValue) && (newValue.length !== 0 || prevUsername.length === 1))
      // ) {
      this.registrationForm.username = newValue;
      // }
    },
    async isEmailAvailable(): Promise<boolean> {
      return await this.$store
        .dispatch("auth/GetEmailAvailability", this.registrationForm.email)
        .then((response) => {
          if (response.OPCODE == "UNAVAILABLE") {
            return false;
          } else if (response.OPCODE == "SUCCESS") {
            return true;
          } else {
            throw Error("Can not validate email availability");
          }
        })
        .catch((error) => {
          alert("Error: " + error.message);
          throw error;
        });
    },
    validateUsernameInput() {
      this.invalidUsername = false;
      this.usernameOK = false;

      if (this.usernameTimer !== undefined) {
        clearTimeout(this.usernameTimer);
      }

      if (this.registrationForm.username.length === 0) {
        return;
      }
      // this.usernameTimer = setTimeout(async () => {
      //   this.usernameValidation = await this.validateUsername(
      //     this.registrationForm.username
      //   );
      //   // this.invalidUsername = this.usernameValidation;
      //   // this.usernameAvailable =
      //   //   this.usernameValidation !== undefined
      //   //     ? this.usernameValidation
      //   //     : this.usernameAvailable;
      //   this.usernameOK = !this.invalidUsername && this.usernameAvailable;
      //   clearTimeout(this.usernameTimer);
      //   this.usernameTimer = undefined;
      // }, 500);
    },
    validatePasswords() {
      this.validatePasswordInput();
      this.validatePasswordConfirm();
    },
    validatePasswordInput() {
      // this.passwordValidation = "";
      // this.validPassword = !this.passwordValidation;
    },
    validatePasswordConfirm() {
      if (
        this.registrationForm.passwordConfirm.length > 0 &&
        this.registrationForm.passwordConfirm != this.registrationForm.password
      ) {
        this.validPasswordConfirm = false;
        return;
      }
      this.validPasswordConfirm = true;
    },
    gotoLoginPage() {
      this.registrationConfirmModal.hide();
      router.push({ name: "login" });
    },
    refreshPage() {
      this.registrationConfirmModal.hide();
      this.$router.go(0);
    }
  },
  setup() {
    const validateEmail = validationTools.methods;
    const validateUsername = validationTools.methods;
    const validatePassword = validationTools.methods;
    return {
      validateEmail,
      validateUsername,
      validatePassword
    };
  }
});
</script>

<style lang="scss" scoped>
.form-control.is-invalid {
  box-shadow: inset 0 0 3px $danger;
}
</style>
