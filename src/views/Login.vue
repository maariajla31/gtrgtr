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
              <div class="input-group mb-3">
                <span class="input-group-text">
                  <i class="fas fa-id-card-alt fa-fw"></i>
                </span>
                <input
                  type="text"
                  class="form-control"
                  placeholder="Correo electrónico / Nombre de Usuario"
                  aria-label="Correo electrónico o Nombre de Usuario"
                  id="username"
                  ref="username"
                  autocomplete="username"
                  v-model.trim="loginForm.userId"
                />
              </div>
              <div class="mb-3">
                <div class="input-group">
                  <span class="input-group-text">
                    <i class="fas fa-lock fa-fw"></i>
                  </span>
                  <input
                    :type="showPassword ? 'text' : 'password'"
                    class="form-control"
                    placeholder="Contraseña"
                    aria-label="Contraseña"
                    id="password"
                    ref="password"
                    autocomplete="current-password"
                    v-model.trim="loginForm.password"
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
                  @click="userLogin()"
                  class="btn btn-secondary my-4 w-100"
                  :disabled="
                    !loginForm.userId || !loginForm.password || loading
                  "
                >
                  Ingresar
                  <i v-if="loading" class="fas fa-spinner fa-spin"></i>
                </button>
              </div>
            </div>
          </div>
          <div class="card-footer">
            <div class="mt-2 px-2 text-muted small text-center">
              <div>
                <button
                  type="button"
                  class="btn btn-link link-pink"
                  @click="showResetPasswordModal()"
                >
                  <i class="fas fa-key"></i>
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>

  <div
    class="modal fade"
    id="change-password-modal"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
    tabindex="-1"
    aria-labelledby="ChangePasswordModalLabel"
    aria-hidden="true"
    ref="resetPasswordModal"
  >
    <div class="modal-dialog -modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header bg-secondary py-2 bg-gradient text-light">
          <h5 class="modal-title">
            <i class="fas fa-key fa-fw me-2"></i>
            Recuperación de Contraseña
          </h5>
          <button
            type="button"
            class="btn-close btn-sm btn-close-white"
            aria-label="Close"
            ref="close"
            data-bs-dismiss="modal"
          ></button>
        </div>
        <div class="modal-body">
          <form novalidate>
            <div class="form-floating mb-3">
              <input
                type="email"
                class="form-control mb-1"
                id="userEmail"
                placeholder="Correo electrónico (E-mail)"
                @input="validateEmailInput"
                v-model.trim="userEmail"
              />
              <label for="floatingInput">Correo Electrónico (E-mail)</label>
              <div v-if="emailValidation.hasWarning" class="text-warning small">
                <i class="fas fa-exclamation-circle fa-fw mx-1"></i
                >{{ emailValidation.userMessage }}
              </div>
              <div v-if="emailValidation.hasError" class="text-danger small">
                <i class="fas fa-exclamation-triangle fa-fw mx-1"></i
                >{{ emailValidation.userMessage }}
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer justify-content-center">
          <button
            type="button"
            class="btn btn-outline-primary mx-3"
            data-bs-dismiss="modal"
          >
            Cancelar
          </button>
          <button
            type="button"
            class="btn btn-outline-secondary mx-3"
            @click="resetPassword(userEmail)"
            :disabled="
              emailValidation.hasError || userEmail === '' || loadingPW
            "
          >
            Enviar liga de restablecimiento
            <i v-if="loadingPW" class="fas fa-spinner fa-spin"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
  <error-modal :title="errorTitle" :message="errorMessage"></error-modal>
  <information-modal
    :title="informationTitle"
    :message="informationMessage"
  ></information-modal>
</template>

<script lang="ts">
import { errorModal, informationModal } from "@/components/modals";
import {
  validationTools
} from "@/mixins/validationTools";
import router from "@/router";
import * as bs from "bootstrap";
import { defineComponent } from "vue";

export default defineComponent({
  name: "Login",
  components: {
    errorModal,
    informationModal
  },
  data() {
    return {
      timer: undefined,
      loadingPW: false,
      loading: false,
      verifyEmail: true,
      showPassword: false,
      capsLockOn: false,
      loginForm: {
        userId: "",
        email: "",
        password: ""
      },
      userEmail: "",
      resetPasswordModal: {} as any,
      // emailValidation: new EmailValidationResponse(),
      informationModal: {} as any,
      errorModal: {} as any,
      errorTitle: "",
      errorMessage: "",
      informationTitle: "",
      informationMessage: ""
    };
  },
  methods: {
    loginUser(user: string) {
      this.loginForm.userId = user + this.loginForm.userId;
      this.verifiedLogin(this.loginForm.userId);
    },
    userLogin() {
      this.loading = true;
      if (this.loginForm.userId.includes("@")) {
        this.verifiedLogin(this.loginForm.userId);
      } else {
        this.$store
          .dispatch("auth/getEmailByUsername", this.loginForm.userId)
          .then((response) => {
            const email = response;
            this.verifiedLogin(email);
          })
          .catch((error) => {
            this.loading = false;
            this.errorTitle = "Error";
            if (error.data.code === "USER_NOT_FOUND") {
              this.errorMessage =
                "<p class='text-center'><i class='fas fa-user-slash fa-4x'></i></p>" +
                "<h3>El usuario no existe.</h3>";
            } else {
              this.errorMessage = error.data.message;
            }
            this.errorModal.show();
          });
      }
    },
    verifiedLogin(userEmail: string) {
      if (this.verifyEmail) {
        this.loading = true;
        this.$store
          .dispatch("auth/getEmailStatus", userEmail)
          .then((response) => {
            if (response) {
              this.$store
                .dispatch("auth/setVerifiedProfile", userEmail)
                .then((response) => {
                  if (response.OPCODE == "SUCCESS") {
                    this.doLogin(userEmail);
                  } else {
                    this.loading = false;
                    this.errorTitle = "Error";
                    this.errorMessage =
                      "Favor de comunicarse con su administrador";
                    this.errorModal.show();
                  }
                })
                .catch((error) => {
                  console.log(error);
                });
            } else {
              this.$store
                .dispatch("auth/setUnverifiedProfile", userEmail)
                .then((response) => {
                  if (response.OPCODE == "SUCCESS") {
                    this.doLogin(userEmail);
                  } else {
                    this.loading = false;
                    this.errorTitle = "Error";
                    this.errorMessage = "Es necesario verificar el Email";
                    this.errorModal.show();
                  }
                })
                .catch((error) => {
                  console.log(error);
                });
            }
          })
          .catch((error) => {
            this.loading = false;
            this.errorTitle = "Error";

            if (error.data.code !== undefined) {
              switch (error.data.code) {
                case "USER_NOT_FOUND":
                case "EMAIL_NOT_FOUND":
                  this.errorMessage =
                    "<p class='text-center'><i class='fas fa-user-slash fa-4x'></i></p>" +
                    "<p>El correo electrónico proporcionado <strong>NO existe.</strong> Favor de verificarlo.</p>";
                  break;
                case "INVALID_EMAIL":
                  this.errorMessage =
                    "<p class='text-center'><i class='far fa-times-circle fa-4x'></i></p>" +
                    "<h3>El correo electrónico no es válido.</h3>";
                  break;
                default:
                  this.errorMessage = error.data.message;
                  break;
              }
            } else {
              this.errorMessage = error.data.message;
            }
            this.errorModal.show();
          });
      } else {
        this.doLogin(userEmail);
      }
    },
    doLogin(userEmail: string) {
      this.loading = true;
      this.$store
        .dispatch("auth/login", {
          userIdentification: userEmail,
          password: this.loginForm.password
        })
        .then((response) => {
          if (response) {
            router.push({ name: "home" });
          }
        })
        .catch((error) => {
          this.errorTitle = "Error";
          if (typeof error === "string") {
            this.errorMessage = error;
          } else if (error.code != undefined) {
            switch (error.code) {
              case "auth/wrong-password":
                this.errorMessage =
                  "<p class='text-center'><i class='far fa-times-circle fa-4x'></i></p>" +
                  "<p>El usuario o el password son <strong>incorrectos.</strong></p>";
                break;
              case "auth/too-many-requests":
                this.errorMessage =
                  "<p class='text-center'><i class='fas fa-user-clock fa-4x'></i></p>" +
                  "<p>El acceso a esta cuenta ha sido <strong>bloqueado temporalmente</strong> por seguridad, " +
                  "debido a que ha superado el número máximo de intentos de inicio de sesión.</p>" +
                  "<p>Por favor, pruebe de nuevo más tarde o <strong>realice un cambio de contraseña</strong> " +
                  "para <strong>desbloquearla inmediatamente.</strong></p>";
                break;
              case "auth/user-not-found":
                this.errorMessage =
                  "<p class='text-center'><i class='far fa-times-circle fa-4x'></i></p>" +
                  "<p>El usuario no existe.</p>";
                break;
              case "auth/user-disabled":
                this.errorMessage =
                  "<p class='text-center'><i class='fas fa-user-lock fa-4x'></i></p>" +
                  "<p>El usuario está <strong>deshabilitado</strong>.</p>" +
                  "<p>Favor de contactar a su patrocinador o al departamento de soporte al correo <a href='mailto:soporte@gtr.academy'>soporte@gtr.academy</a>.</p>";
                break;
              default:
                console.log(error);
                this.errorMessage = "Error al hacer el login.";
                break;
            }
          } else {
            this.errorMessage = JSON.stringify(error);
          }
          this.errorModal.show();
        })
        .finally(() => {
          this.loading = false;
        });
    },
    validateEmailInput() {
      if (this.timer !== undefined) {
        clearTimeout(this.timer);
      }
      // this.timer = setTimeout(() => {
      //   this.emailValidation = this.validateEmail(this.userEmail);
      //   clearTimeout(this.timer);
      //   this.timer = undefined;
      // }, 500);
    },
    showResetPasswordModal() {
      this.resetPasswordModal.show();
    },
    resetPassword(userEmail: string) {
      this.loadingPW = true;
      this.$store
        .dispatch("auth/sendPasswordResetLink", userEmail)
        .then((response) => {
          this.informationTitle = "Liga de restablecimiento enviada";
          this.informationMessage = response.message;
          this.informationModal.show();
          this.resetPasswordModal.hide();
        })
        .catch((error) => {
          this.errorTitle = "Error al generar la liga de restablecimiento";
          if (error.data.OPCODE === "ERROR") {
            if (error.data.code !== undefined) {
              switch (error.data.code) {
                case "USER_NOT_FOUND":
                case "EMAIL_NOT_FOUND":
                  this.errorMessage =
                    "<p class='text-center'><i class='fas fa-user-slash fa-4x'></i></p>" +
                    "<p>El correo electrónico proporcionado <strong>NO existe.</strong> Favor de verificarlo.</p>";
                  break;
                case "INVALID_EMAIL":
                  this.errorMessage =
                    "<p class='text-center'><i class='far fa-times-circle fa-4x'></i></p>" +
                    "<h3>El correo electrónico no es válido.</h3>";
                  break;
                default:
                  this.errorMessage = error.data.message;
                  break;
              }
            } else {
              this.errorMessage = error.data.message;
            }
            console.log(error.data.errorDetail);
          } else {
            this.errorMessage = "Error: " + JSON.stringify(error.message);
            console.log(error.data.message);
          }
          this.errorModal.show();
        })
        .finally(() => {
          this.loadingPW = false;
        });
    }
  },
  async mounted() {
    await this.$store.dispatch("auth/logout");

    const resetPswModal = this.$refs.resetPasswordModal as HTMLElement;
    this.resetPasswordModal = bs.Modal.getOrCreateInstance(resetPswModal);
    resetPswModal?.addEventListener("hidden.bs.modal", () => {
      this.userEmail = "";
      // this.emailValidation = new EmailValidationResponse();
    });

    const username: HTMLInputElement = this.$refs.username as HTMLInputElement;
    const psw: HTMLInputElement = this.$refs.password as HTMLInputElement;
    username.addEventListener("keyup", (event) => {
      this.capsLockOn = event.getModifierState("CapsLock");
    });
    psw.addEventListener("keyup", (event) => {
      this.capsLockOn = event.getModifierState("CapsLock");
    });

    const infModalElement = document.getElementById("information-modal");
    this.informationModal = bs.Modal.getOrCreateInstance(infModalElement);
    infModalElement?.addEventListener("hidden.bs.modal", () => {
      this.informationTitle = "";
      this.informationMessage = "";
    });

    const errorModalElement = document.getElementById("error-modal");
    this.errorModal = bs.Modal.getOrCreateInstance(errorModalElement);
    errorModalElement?.addEventListener("hidden.bs.modal", () => {
      this.errorTitle = "";
      this.errorMessage = "";
    });
  },
  setup() {
    const validateEmail = validationTools.methods;
    return {
      validateEmail
    };
  }
});
</script>
