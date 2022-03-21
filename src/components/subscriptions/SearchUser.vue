<template>
  <div class="card flex-fill justify-self-stretch">
    <div class="card-header d-flex flex-row justify-content-between">
      <div>
        <h5 class="mb-0 mt-1">
          <i class="fas fa-search fa-fw me-1 text-info"></i> Buscar socio
        </h5>
      </div>
      <div class="btn-toolbar">
        <div class="input-group input-group-sm">
          <input
            type="text"
            class="form-control"
            placeholder="Nombre de Usuario"
            v-model="username"
          />
          <button
            class="btn btn-outline-secondary"
            @click="searchUser"
            :disabled="username == '' || searching"
          >
            <i class="fas fa-search"></i>
          </button>
        </div>
      </div>
    </div>
    <div class="card-body" style="min-height: 10rem;">
      <div class="row" v-if="userData.username">
        <div class="col-12 col-lg-6 col-xl-5 mb-2">
          <profile-card :user="userData"></profile-card>
        </div>
        <div class="col-12 col-lg-6 col-xl-7 flex-column">
          <carrer-summary-table
            class="border rounded"
            :user-data="userData"
          ></carrer-summary-table>
          <div class="mt-2 row">
            <div class="col-12 col-sm-5 text-sm-start text-center">
              <button
                v-if="actions.changeEmail"
                class="btn btn-outline-secondary btn-sm text-nowrap mb-2"
                @click="showChangeEmailModal"
              >
                <i class="far fa-envelope fw me-1"></i>
                Cambiar Correo
              </button>
            </div>
            <div class="col-12 col-sm-7 text-center text-sm-end">
              <button
                v-if="actions.distributor"
                class="btn btn-outline-primary btn-sm mb-2"
                :disabled="isOffline || isQuoting"
                @click="subscriptionQuote('distributor-license')"
              >
                <i class="bi bi-briefcase-fill me-1"></i>Distribuidor
                <i v-if="isQuoting" class="fas fa-spinner fa-spin"></i>
              </button>
              <button
                v-if="actions.academy"
                class="btn btn-outline-primary btn-sm ms-2 mb-2"
                :disabled="isOffline || isQuoting"
                @click="subscriptionQuote('trading-academy')"
              >
                <i class="fas fa-chalkboard-teacher me-1"></i>Academia
                <i v-if="isQuoting" class="fas fa-spinner fa-spin"></i>
              </button>
            </div>
            <div class="col-12 text-center text-sm-end mb-2">
              <div class="">
                <button
                  v-if="actions.noVolume"
                  class="btn btn-outline-info btn-sm"
                  @click="registerWithNoVolume()"
                  :disabled="isOffline || activating"
                >
                  Activar SIN volumen
                  <i v-if="activating" class="fas fa-spinner fa-spin ms-1"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row text-center">
        <div
          v-if="notFound"
          class="alert alert-danger alert-dismissible fade show col-10 col-xl-6 offset-1 offset-xl-3 mt-3"
          role="alert"
        >
          <h4 class="mb-0">
            <i class="fas fa-user-slash fa-fw me-2"></i>Usuario no encontrado
          </h4>
          <button
            type="button"
            class="btn-close btn-sm mt-1"
            data-bs-dismiss="alert"
            aria-label="Close"
          ></button>
        </div>
        <div
          v-if="searching"
          class="alert alert-info fade show col-10 col-xl-6 offset-1 offset-xl-3 mt-3"
          role="alert"
        >
          <h4 class="mb-0">
            <i class="fas fa-cog fa-fw fa-spin me-1"></i>Buscando...
          </h4>
          <!-- SVG and JS fontawesome needed -->
          <!-- <span class="cogs"> 
            <i class="fas fa-cog fa-4x fa-spin" data-fa-transform="down-5  right-5"></i>
            <i class="fas fa-cog fa-3x fa-spin" data-fa-transform="down-17 right-3"></i>
            <i class="fas fa-cog fa-5x fa-spin" data-fa-transform="left-7"></i>
          </span> -->
        </div>
      </div>
    </div>
    <div
      class="modal show"
      id="change-email-modal"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      tabindex="-1"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header bg-secondary text-light py-2">
            <h5 class="modal-title">
              <i class="fas fa-envelope fa-fw me-2"></i>
              Cambiar correo electrónico
            </h5>
            <button
              type="button"
              class="btn-close btn-sm btn-close-white"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <div class="mb-3 row">
              <label for="staticUsername" class="col-sm-2 col-form-label"
                >Usuario:
              </label>
              <div class="col-sm-10">
                <input
                  type="text"
                  readonly
                  class="form-control-plaintext fw-bold"
                  id="staticUsername"
                  :value="username"
                />
              </div>
            </div>
            <div>
              <div class="form-floating mb-3">
                <input
                  type="email"
                  class="form-control mb-1"
                  id="newEmail"
                  placeholder="Nuevo E-mail"
                  @input="validateEmailInput"
                  v-model="newEmail"
                />
                <label for="floatingInput"
                  >Nuevo Correo Electrónico (E-mail)</label
                >
                <div
                  v-if="emailValidation.hasWarning"
                  class="text-warning small"
                >
                  <i class="fas fa-exclamation-circle fa-fw mx-1"></i
                  >{{ emailValidation.userMessage }}
                </div>
                <div v-if="emailValidation.hasError" class="text-danger small">
                  <i class="fas fa-exclamation-triangle fa-fw mx-1"></i
                  >{{ emailValidation.userMessage }}
                </div>
              </div>
            </div>
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
              @click="changeEmail()"
              :disabled="!canChangeEmail"
            >
              Aceptar
            </button>
          </div>
        </div>
      </div>
    </div>
    <profile-picture-gallery-modal></profile-picture-gallery-modal>
    <error-modal :title="errorTitle" :message="errorMessage"></error-modal>
    <information-modal
      :title="informationTitle"
      :message="informationMessage"
    ></information-modal>
  </div>
</template>

<script lang="ts">
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/functions";
import { defineComponent } from "vue";
import {
  validationTools
} from "@/mixins/validationTools";
import ProfileCard from "../profile/ProfileCard.vue";
import ProfilePictureGalleryModal from "../profile/ProfilePictureGalleryModal.vue";
import { CarrerSummaryTable } from "../unilevel";
import { errorModal, informationModal } from "../modals";
import { mapGetters } from "vuex";
import { SearchUserResponse } from "../../store/User/UserInterfaces";
import * as bs from "bootstrap";
// import {
//   QuoteSubscriptionRequest,
//   SubscriptionInfo
// } from "functions/src/Subscriptions/SubscriptionsInterfaces";

export default defineComponent({
  name: "search-user",
  props: {
    lastQuote: { type: Object, required: true },
    isPaid: { type: Boolean, required: true },
    isQuoting: { type: Boolean, required: true }
  },
  components: {
    ProfileCard,
    ProfilePictureGalleryModal,
    CarrerSummaryTable,
    errorModal,
    informationModal
  },
  emits: ["clearQuote", "requestQuote", "paid"],
  data() {
    return {
      timer: undefined,
      emailModalObj: {} as any,
      informationModal: {} as any,
      errorModal: {} as any,
      searching: false,
      notFound: false,
      activating: false,
      username: "",
      actions: {
        changeEmail: false,
        academy: false,
        distributor: false,
        noVolume: false
      },
      newEmail: "",
      userData: {} as SearchUserResponse,
      // emailValidation: new EmailValidationResponse(),
      errorTitle: "",
      errorMessage: "",
      informationTitle: "",
      informationMessage: ""
    };
  },
  computed: {
    ...mapGetters("account", ["getPromotions"]),
    ...mapGetters("auth", ["getUsernamePK", "getUseremail"]),
    ...mapGetters("subs", ["getSubscriptionConfig"]),
    ...mapGetters("sys", ["isOffline"])//,
    // canChangeEmail(): boolean {
      // return (
      //   // this.emailValidation.canChange &&
      //   // this.newEmail.length > 0 &&
      //   // this.newEmail !== this.userData.contact.email.data
      // );
    // }
  },
  methods: {
    searchUser() {
      this.searching = true;
      this.notFound = false;
      this.userData = {} as SearchUserResponse;
      this.actions.changeEmail = false;
      this.actions.academy = false;
      this.actions.distributor = false;
      this.actions.noVolume = false;

      const searchUserFunction = firebase
        .functions()
        .httpsCallable("Users-searchUser");
      searchUserFunction({ username: this.username })
        .then((result) => {
          const response = result.data;

          if (response.OPCODE == "SUCCESS") {
            const user: SearchUserResponse = response.data;
            user.subscriptions = new Map(Object.entries(user.subscriptions));

            if (user.metadata != undefined) {
              user.metadata.creationTime = new Date(user.metadata.creationTime);
              user.metadata.lastSignInTime = new Date(
                user.metadata.lastSignInTime
              );
              user.metadata.lastRefreshTime = new Date(
                user.metadata.lastRefreshTime
              );
            }

            if (user.scholarshipData != undefined) {
              const endDateTimeStamp: any = user.scholarshipData.periodEndDate;
              user.scholarshipData.periodEndDate = new firebase.firestore.Timestamp(
                endDateTimeStamp._seconds,
                endDateTimeStamp._nanoseconds
              ).toDate();
            }

            this.actions.noVolume =
              user.subscriptions?.size == 0 &&
              (this.getPromotions.both > 0 ||
                (this.getPromotions.tradingAcademy > 0 &&
                  this.getPromotions.distributorLicense > 0)) &&
              user.usernamePK != this.getUsernamePK;

            this.actions.academy = user.subscriptions.has("trading-academy")
              ? (user.subscriptions.get("trading-academy") || 30) < 3
              : true;

            this.actions.distributor = user.subscriptions.has(
              "distributor-license"
            );

            const creationDate = user.metadata?.creationTime.getTime();
            this.actions.changeEmail =
              user.enroller == this.getUsernamePK &&
              creationDate != undefined &&
              Math.abs(
                new Date(creationDate).getTime() - new Date().getTime()
              ) /
                36e5 <
                24;
            this.userData = user;
          } else if (response.OPCODE == "ERROR") {
            const error = response.error;
            if (error.name == "USER_NOT_FOUND") {
              this.notFound = true;
            } else {
              alert(error.message);
              console.error(error);
            }
          }
          this.searching = false;
        })
        .catch((error) => {
          console.error(error);
          alert(
            "Error al llamar la función de búsqueda de usuarios: " +
              error.message
          );
          this.searching = false;
        });
    },
    showChangeEmailModal() {
      this.emailModalObj.show();
      return true;
    },
    validateEmailInput() {
      if (this.timer !== undefined) {
        clearTimeout(this.timer);
      }
      // this.timer = setTimeout(() => {
      //   //console.log(this.newEmail);
      //   if (this.newEmail !== this.userData.contact.email.data) {
      //     this.emailValidation = "";
      //   } else {
      //     this.emailValidation.hasWarning = false;
      //     this.emailValidation.canChange = false;
      //     this.emailValidation.hasError = true;
      //     this.emailValidation.userMessage =
      //       "El correo electrónico no puede ser el mismo";
      //   }
      //   clearTimeout(this.timer);
      //   this.timer = undefined;
      // }, 500);
    },
    changeEmail() {
      this.errorTitle = "";
      this.errorMessage = "";
      this.informationTitle = "";
      this.informationMessage = "";
      // if (!this.canChangeEmail) {
      //   this.errorTitle = "Error";
      //   this.errorMessage =
      //     "El correo electrónico no puede estar vacío o ser igual al actual.";
      //   this.errorModal.show();
      //   return;
      // }

      const changeDownlineEmail = firebase
        .functions()
        .httpsCallable("Users-changeDownlineEmail");
      changeDownlineEmail({
        username: this.userData.usernamePK,
        email: this.newEmail.toLowerCase()
      }).then((response) => {
        if (response.data.OPCODE == "SUCCESS") {
          this.userData.contact.email.data = this.newEmail;
          this.emailModalObj.hide();
          this.newEmail = "";
          this.informationTitle = "Correco electrónico cambiado exitosamente";
          this.informationMessage =
            "El correo electrónico del usuario se ha cambiado exitosamente.";
          this.informationModal.show();
        } else {
          const email = this.newEmail;
          this.emailModalObj.hide();
          this.errorTitle = "Error al cambiar el correo electrónico";
          this.errorMessage = response.data.error.message;
          console.log(response.data.error);
          this.errorModal.show();

          const errorModalElement = document.getElementById("error-modal");
          errorModalElement?.addEventListener("hidden.bs.modal", () => {
            this.errorTitle = "";
            this.errorMessage = "";
            this.newEmail = email;
            this.validateEmailInput();
            this.emailModalObj.show();
          });
          const emailModalElement = document.getElementById(
            "change-email-modal"
          );
          emailModalElement?.addEventListener("hidden.bs.modal", () => {
            this.newEmail = "";
            // this.emailValidation = new EmailValidationResponse();
            errorModalElement?.addEventListener("hidden.bs.modal", () => {
              this.errorTitle = "";
              this.errorMessage = "";
            });
          });
        }
      });
    },
    // SubscriptionConfig(
    //   subscriptionId: "trading-academy" | "distributor-license"
    // ): SubscriptionInfo {
    //   return this.getSubscriptionConfig(subscriptionId);
    // },
    subscriptionQuote(
      subscriptionId: "trading-academy" | "distributor-license"
    ) {
      const affiliateUsername = this.userData.usernamePK;
      const fiveMinutes = new Date();
      fiveMinutes.setTime(fiveMinutes.getTime() + 5 * 60 * 1000); //5 minutes from now
      if (
        !(
          this.lastQuote.subscriptionId == subscriptionId &&
          this.lastQuote.username == affiliateUsername &&
          this.lastQuote.expirationTime > fiveMinutes
        )
      ) {
        this.$emit("clearQuote");
        // const subsConf = this.SubscriptionConfig(subscriptionId);
        // const request: QuoteSubscriptionRequest = {
        //   subscriptionId: subscriptionId,
        //   duration: subsConf.duration,
        //   durationUnit: subsConf.durationUnit,
        //   username: affiliateUsername,
        //   email: this.getUseremail,
        //   isDirectAffiliate: false
        // };
        // this.$emit("requestQuote", request);
      }
    },
    registerWithNoVolume() {
      this.activating = true;
      const subscriptionRequest = {
        subscriptionId: "both",
        username: this.userData.usernamePK,
        email: this.getUseremail,
        isDirectAffiliate: false,
        noVolume: true
      };
      const UpdateSubscription = firebase
        .functions()
        .httpsCallable("Subscriptions-UpdateSubscriptionWithoutVolume");
      UpdateSubscription(subscriptionRequest)
        .then((response) => {
          if (response.data.OPCODE == "SUCCESS") {
            this.searchUser();
            this.$emit("paid");
            this.informationTitle = "Activación exitosa";
            this.informationMessage = "El usuario se ha activado exitosamente.";
            this.informationModal.show();
          } else if (response.data.OPCODE == "ERROR") {
            this.errorTitle = "Error al activar el usuario";
            this.errorMessage = response.data.message + "\n\r";
            this.errorMessage += response.data.messageDetails;
            this.errorModal.show();
          }
        })
        .finally(() => {
          this.activating = false;
        });
    }
  },
  mounted() {
    const emailModalElement = document.getElementById("change-email-modal");
    this.emailModalObj = bs.Modal.getOrCreateInstance(emailModalElement);
    emailModalElement?.addEventListener("hidden.bs.modal", () => {
      this.newEmail = "";
      // this.emailValidation = new EmailValidationResponse();
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
