<template>
  <div class="card flex-fill justify-self-stretch">
    <div class="card-header d-flex flex-row justify-content-between">
      <div>
        <h5 class="mb-0"><i class="fas fa-pen-fancy me-1"></i> Nuevo socio</h5>
      </div>
      <div class="btn-toolbar d-none">
        <button @click="generarUsuario" class="btn btn-outline-info btn-sm">
          <i class="fas fa-hat-wizard"></i>
        </button>
      </div>
    </div>
    <div class="card-body">
      <div :class="{ 'd-none': isRegistered }">
        <div
          class="mb-3 d-flex justify-content-center"
          :class="{ 'd-none': !innerLegUnlocked }"
        >
          <div class="flex-fill d-flex justify-content-center">
            <div class="form-check form-check-inline">
              <input
                class="form-check-input"
                type="radio"
                name="side-radio-options"
                id="side-left"
                value="left"
                @change="onChange($event)"
                checked
              />
              <label class="form-check-label" for="side-left">Izquierda</label>
            </div>
          </div>
          <div class="flex-fill d-flex justify-content-center">
            <div class="form-check form-check-inline">
              <input
                class="form-check-input"
                type="radio"
                name="side-radio-options"
                id="side-right"
                value="right"
                @change="onChange($event)"
              />
              <label class="form-check-label" for="side-right">Derecha</label>
            </div>
          </div>
        </div>
        <div class="mb-3">
          <div class="form-floating">
            <input
              type="text"
              class="form-control mb-1"
              :class="{
                'is-invalid': emailValidation.hasError,
                'is-warning': emailValidation.hasWarning
              }"
              placeholder="Correo electrónico"
              aria-label="Correo electrónico"
              id="email"
              @input="validateEmailInput()"
              v-model.trim="registrationForm.email"
            />
            <label for="email" class="text-nowrap">
              <i class="far fa-envelope fa-fw me-1"></i>
              <span class="">
                Correo Electrónico (E-mail)
              </span>
            </label>
          </div>
          <div class="small ms-2">
            <div v-if="emailValidation.hasWarning" class="text-warning">
              <i class="fas fa-exclamation-circle fa-fw me-2"></i
              >{{ emailValidation.userMessage }}
            </div>
            <div v-if="emailValidation.hasError" class="text-danger">
              <i class="fas fa-exclamation-triangle fa-fw me-2"></i
              >{{ emailValidation.userMessage }}
            </div>
          </div>
        </div>
        <div class="mb-3">
          <div class="text-pink text-center small mb-1">
            <i class="fas fa-exclamation-circle fa-fw"></i>
            El nombre de usuario no podrá ser modificado.
          </div>
          <div class="form-floating">
            <input
              type="text"
              class="form-control mb-1"
              :class="{ 'is-invalid': !usernameAvailable || invalidUsername }"
              placeholder="Nombre de Usuario"
              aria-label="Nombre de Usuario"
              id="username"
              v-model.trim="registrationForm.username"
              @input="validateUsernameInput()"
            />
            <label for="username" class="text-nowrap">
              <i class="fas fa-user fa-fw me-1"></i>
              <span class="">
                Nombre de usuario
              </span>
            </label>
          </div>
          <div class="small ms-2 text-danger">
            <div v-if="!usernameAvailable" class="">
              <i class="fas fa-exclamation-triangle fa-fw me-2"></i>El nombre de
              usuario no está disponible.
            </div>
            <div v-if="invalidUsername" class="">
              <i class="fas fa-exclamation-triangle fa-fw me-2"></i
              >{{ usernameValidation.userMessage }}
            </div>
          </div>
        </div>
      </div>
      <div class="" :class="{ 'd-none': !isRegistered }">
        <div class="row mb-2">
          <div class="col col-md-4 text-end text-nowrap">Subscripción:</div>
          <div class="col">
            <span class="fw-bold">{{ SubscriptionConfig?.displayName }}</span>
          </div>
        </div>
        <div class="row mb-2">
          <div class="col col-md-4 text-end text-nowrap">Usuario:</div>
          <div class="col">
            <span class="fw-bold">{{ registrationForm.username }}</span>
          </div>
        </div>
        <div class="row mb-2">
          <div class="col col-md-4 text-end text-nowrap">Correo:</div>
          <div class="col">
            <span class="fw-bold">
              {{ registrationForm.email }}
            </span>
          </div>
        </div>
        <div class="row">
          <div
            v-if="!isOffline"
            class="justify-content-center d-flex text-center"
            style="padding-top: 10px;"
          >
            <div class="d-flex flex-column">
              <div
                class="mb-4"
                v-if="
                  (promotions?.tradingAcademy > 0 &&
                    promotions?.distributorLicense > 0) ||
                    promotions?.both > 0
                "
              >
                <button
                  class="btn btn-outline-info"
                  @click="registerWithNoVolume"
                  :disabled="isOffline || isPaying"
                >
                  Activar SIN Volumen
                </button>
              </div>
              <div class="" v-if="!isOffline">
                <div class="input-group d-flex">
                  <span class="input-group-text bg-white fw-bold"
                    >$
                    {{ Total }}
                    {{ SubscriptionConfig.currency }}</span
                  >
                  <button
                    type="button"
                    class="btn btn-primary flex-fill"
                    data-bs-toggle="modal"
                    data-bs-target="#checkout-modal"
                    @click="subscriptionQuote()"
                    :disabled="isOffline || isPaying"
                  >
                    Pagar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="!isOffline"
      class="card-footer justify-content-center d-flex text-center"
    >
      <div :class="{ 'd-none': isRegistered }">
        <button
          type="button"
          class="btn btn-primary"
          @click="doRegister()"
          :disabled="
            isOffline ||
              invalidFields() ||
              isRegistering ||
              !emailOK ||
              !usernameOK
          "
        >
          Registrar
          <i v-if="isRegistering" class="fas fa-spinner fa-spin"></i>
        </button>
      </div>
      <div :class="{ 'd-none': !isRegistered }">
        <button
          @click="goToRegister()"
          type="button"
          class="btn btn-outline-primary"
        >
          Registrar nuevo socio
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapGetters } from "vuex";
import * as fb from "../../firebase";
// import {
//   QuoteSubscriptionRequest,
//   SubscriptionInfo
// } from "functions/src/Subscriptions/SubscriptionsInterfaces";
import { nombres } from "@/utils/nombres";
import { AccountSummary } from "@/store/Account/AccountInterface";
import {
  // EmailValidationResponse,
  // UsernameValidationResponse,
  validationTools
} from "@/mixins/validationTools";

export default defineComponent({
  name: "subscription-register-card",
  props: {
    subscriptionId: { type: String, required: true },
    lastQuote: { type: Object, required: true },
    isPaid: { type: Boolean, required: true }
  },
  emits: ["clearQuote", "requestQuote", "paid"],
  computed: {
    ...mapGetters("auth", ["getUsernamePK", "getUseremail"]),
    ...mapGetters("subs", [
      "getSubscriptionConfig",
      "getUserSubscription",
      "durationUnitLocalized"
    ]),
    ...mapGetters("account", ["getPromotions", "getAccountSummary"]),
    ...mapGetters("sys", ["isOffline"]),
    accountSummary(): AccountSummary {
      return this.getAccountSummary;
    },
    promotions() {
      return this.getPromotions;
    },
    SubscriptionDurationUnitLocalized(): string {
      return this.durationUnitLocalized("");
    },
    // PeriodsStep(): number {
    //   // return this.SubscriptionConfig || 0;
    // },
    // Total(): string {
    //   const total = this.SubscriptionConfig;
    //   return total.toLocaleString();
    // },
    // SubscriptionConfig(): "wwew",
    daysLeftClass(): string {
      if (this.directAffiliateSubsPeriod <= 5) {
        return "bg-danger";
      } else if (this.directAffiliateSubsPeriod <= 10) {
        return "bg-warning";
      } else {
        return "bg-success";
      }
    },
    ExpirationDurationUnitLocalized(): string {
      return this.durationUnitLocalized(this.directAffiliateSubsPeriod);
    },
    isRegistering(): boolean {
      return this.registering;
    },
    isPaying(): boolean {
      return this.paying;
    },
    innerLegUnlocked(): boolean {
      if (this.accountSummary?.innerLegUnlocked == undefined) {
        return true;
      }
      return this.accountSummary?.innerLegUnlocked
        ? this.accountSummary?.innerLegUnlocked
        : false;
    }
  },
  data() {
    return {
      emailTimer: undefined,
      usernameTimer: undefined,
      // emailValidation: new EmailValidationResponse(),
      // usernameValidation: new UsernameValidationResponse(),
      registrationForm: {
        email: "",
        username: "",
        password: "a123456789",
        passwordConfirm: "a123456789",
        enroller: "",
        acceptTerms: true,
        picture: ""
      },
      binarySide: "left",
      emailOK: false,
      usernameOK: false,
      usernameAvailable: true,
      invalidUsername: false,
      emailMismatch: false,
      isRegistered: false,
      periodsToAdd: 1,
      directAffiliateSubsPeriod: 0,
      registering: false,
      paying: false
    };
  },
  methods: {
    doRegister() {
      this.registering = true;
      const userData = {
        email: this.registrationForm.email,
        username: this.registrationForm.username,
        password: this.registrationForm.password,
        passwordConfirm: this.registrationForm.passwordConfirm,
        enroller: this.getUsernamePK,
        binarySide: this.binarySide,
        pictureURL: ""
      };

      this.$store
        .dispatch("auth/register", userData)
        .then(() => {
          this.$store
            .dispatch("auth/validateEmail", this.registrationForm.email)
            .then((response) => {
              if (response.data.OPCODE == "SUCCESS") {
                this.isRegistered = true;
              }
              this.registering = false;
            })
            .catch((error) => {
              console.log(error);
              this.registering = false;
            });
        })
        .catch((error) => {
          alert("Error: " + error.message);
          this.registering = false;
        });
    },
    goToRegister() {
      this.isRegistered = false;
      this.periodsToAdd = 1;
      this.directAffiliateSubsPeriod = 0;
      this.registrationForm.email = "";
      this.registrationForm.username = "";
    },
    invalidFields(): boolean {
      return (
        this.invalidUsername ||
        !this.usernameAvailable ||
        !this.getUsernamePK ||
        !this.registrationForm.username ||
        !this.registrationForm.email //||
        // this.emailValidation.hasError
      );
    },
    validateEmailInput() {
      this.emailOK = false;
      this.updateUsername();
      if (this.emailTimer !== undefined) {
        clearTimeout(this.emailTimer);
      }
      if (this.registrationForm.email.length === 0) {
        // this.emailValidation = new EmailValidationResponse();
        // this.emailValidation.hasError = true;
        // this.emailValidation.userMessage = "El correo es requerido";
        return;
      }

      // this.emailTimer = setTimeout(async () => {
      //   this.emailValidation = "";
      //   this.validateUsernameInput();
      //   if (
      //     this.emailValidation.status === "SUCCESS" ||
      //     this.emailValidation.status === "WARNING"
      //   ) {
      //     if (!(await this.isEmailAvailable())) {
      //       this.emailValidation.hasWarning = false;
      //       this.emailValidation.canChange = false;
      //       this.emailValidation.hasError = true;
      //       this.emailValidation.userMessage =
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
      //   this.usernameValidation = "hi";
      //   this.invalidUsername = this.usernameValidation.hasError;
      //   this.usernameAvailable =
      //     this.usernameValidation.isAvailable !== undefined
      //       ? this.usernameValidation.isAvailable
      //       : this.usernameAvailable;
      //   this.usernameOK = !this.invalidUsername && this.usernameAvailable;
      //   clearTimeout(this.usernameTimer);
      //   this.usernameTimer = undefined;
      // }, 500);
    },
    onChange(event: any) {
      const data = event.target.value;
      this.binarySide = data;
    },
    subscriptionQuote() {
      const affiliateUsername = this.registrationForm.username.toLowerCase();
      const fiveMinutes = new Date();
      fiveMinutes.setTime(fiveMinutes.getTime() + 5 * 60 * 1000); //5 minutes from now
      if (
        !(
          this.lastQuote.subscriptionId == this.subscriptionId &&
          this.lastQuote.username == affiliateUsername &&
          this.lastQuote.expirationTime > fiveMinutes
        )
      ) {
        this.$emit("clearQuote");
        // const request: QuoteSubscriptionRequest = {
        //   subscriptionId: this.subscriptionId,
        //   duration: this.SubscriptionConfig.duration,
        //   durationUnit: this.SubscriptionConfig.durationUnit,
        //   username: affiliateUsername,
        //   email: this.getUseremail,
        //   isDirectAffiliate: false
        // };
        // this.$emit("requestQuote", request);
      }
    },
    generarUsuario() {
      const randomUser =
        nombres[Math.floor(Math.random() * nombres.length) + 1].toLowerCase() +
        ("00" + (Math.floor(Math.random() * 99) + 1)).substr(-2);
      this.registrationForm.email = randomUser + "@email.gtr.academy";
      this.registrationForm.username = randomUser;
      this.registrationForm.password = "a123456789";
      this.registrationForm.passwordConfirm = "a123456789";
    },
    registerWithNoVolume() {
      this.paying = true;
      const subscriptionRequest = {
        subscriptionId: "both",
        //duration: 30,
        //durationUnit: "days",
        username: this.registrationForm.username.toLowerCase(),
        email: this.getUseremail,
        isDirectAffiliate: false,
        noVolume: true
      };
      const UpdateSubscription = fb.func.httpsCallable(
        "Subscriptions-UpdateSubscriptionWithoutVolume"
      );
      UpdateSubscription(subscriptionRequest)
        .then((response) => {
          if (response.data.OPCODE == "SUCCESS") {
            this.goToRegister();
            this.$emit("paid");
            alert("Activado correctamente");
          } else if (response.data.OPCODE == "ERROR") {
            alert(response.data.message);
          }
        })
        .finally(() => {
          this.paying = false;
        });
    },
    innerLegLocked(): boolean {
      if (this.innerLegUnlocked || this.innerLegUnlocked == undefined) {
        return false;
      }
      return true;
    }
  },
  watch: {
    isPaid: function(newValue) {
      if (newValue == true) {
        this.goToRegister();
        this.$emit("paid");
      }
    }
  },
  setup() {
    const validateEmail = validationTools.methods;
    const validateUsername = validationTools.methods;
    return {
      validateEmail,
      validateUsername
    };
  }
});
</script>
