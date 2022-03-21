<template>
  <div class="card flex-fill justify-self-stretch" v-if="isLoaded">
    <div class="card-header">
      <span class="h5">Suscripción</span>
      <span class="float-end text-muted fs-6">
        <span
          class="badge bg-danger rounded-pill"
          :class="{ 'd-none': isActive }"
          >INACTIVA</span
        >
        <span :class="{ 'd-none': !isActive }">
          Vence en
          <span class="badge rounded-pill" :class="daysLeftClass">{{
            DaysLeft
          }}</span>
          {{ ExpirationDurationUnitLocalized }}</span
        ></span
      >
    </div>
    <div class="card-body" :class="{ 'py-0': isActive }">
      <div class="active-subscription" :class="{ 'd-none': !isActive }">
        <table class="table small">
          <tbody class="small">
            <tr>
              <td class="fw-bold">
                Inicio:
              </td>
              <td class="text-end">
                {{ UserStatus.startDate?.toLocaleString() }}
              </td>
            </tr>
            <tr>
              <td class="fw-bold">
                Último Pago:
              </td>
              <td class="text-end">
                {{ UserStatus.lastPayDate?.toLocaleString() }}
              </td>
            </tr>
            <tr>
              <td class="fw-bold">
                Vencimiento:
              </td>
              <td class="text-end">
                {{ UserStatus.endDate?.toLocaleString() }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div
        class="inactive-subscription text-center"
        :class="{ 'd-none': isActive }"
      >
        <div class="mb-2">
          Tu suscripción a nuestra
          <span class="fst-italic">"{{ SubscriptionConfig.displayName }}"</span>
          está
          <span class="h5 fw-bold">INACTIVA</span>
        </div>
        <div>
          Comienza ahora por solo
          <h5 class="fw-bold">
            $ {{ SubscriptionConfig.cost }}
            {{ SubscriptionConfig.currency }}
            <span class="fs-6 text-muted fw-normal"
              >/ {{ SubscriptionConfig.duration }}
              {{ SubscriptionDurationUnitLocalized }}</span
            >
          </h5>
        </div>
      </div>
    </div>
    <div
      v-if="!isOffline"
      :class="[
        { 'd-none': !CanRenewSubscription },
        'card-footer justify-content-center d-flex text-center'
      ]"
    >
      <div :class="{ 'd-none': isActive }">
        <button
          type="button"
          class="btn btn-primary"
          :disabled="isQuoting"
          @click="subscriptionQuote()"
        >
          Inscribirse
          <i v-if="isQuoting" class="fas fa-spinner fa-spin"></i>
        </button>
      </div>
      <div
        v-if="!isOffline"
        :class="{ 'd-none': !isActive || !CanRenewSubscription }"
      >
        <div class="flex-colum">
          <div class="input-group d-flex">
            <span class="input-group-text bg-white fw-bold">
              $ {{ Total }} {{ SubscriptionConfig.currency }}
            </span>
            <button
              type="button"
              class="btn btn-primary flex-fill"
              :disabled="isOffline || isQuoting"
              @click="subscriptionQuote()"
            >
              Pagar
              <i v-if="isQuoting" class="fas fa-spinner fa-spin"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
// import {
//   QuoteSubscriptionRequest,
//   SubscriptionInfo
// } from "functions/src/Subscriptions/SubscriptionsInterfaces";
// import { UserSubscription } from "functions/src/Users/UsersInterfaces";
// import { defineComponent } from "vue";
// import { mapGetters } from "vuex";
// import { QuoteRequest } from "functions/src/Payments/PaymentsInterfaces";

// export default defineComponent({
//   name: "subscription-status-card",
//   data() {
//     return {
//       periodsToAdd: 1,
//       QuoteRequest: {} as QuoteRequest
//     };
//   },
//   props: {
//     subscriptionId: { type: String, required: true },
//     lastQuote: { type: Object, required: true },
//     isQuoting: { type: Boolean, required: true }
//   },
//   emits: ["isActive", "clearQuote", "requestQuote"],
//   computed: {
//     ...mapGetters("auth", ["getUsernamePK", "getUseremail"]),
//     ...mapGetters("subs", [
//       "getSubscriptionConfig",
//       "getUserSubscription",
//       "durationUnitLocalized"
//     ]),
//     ...mapGetters("sys", ["isOffline"]),
//     isLoaded(): boolean {
//       const loaded =
//         this.SubscriptionConfig != undefined && this.UserStatus != undefined;
//       return loaded;
//     },
//     SubscriptionConfig(): SubscriptionInfo {
//       return this.getSubscriptionConfig(this.subscriptionId);
//     },
//     UserStatus(): UserSubscription {
//       return this.getUserSubscription(this.subscriptionId);
//     },
//     PeriodsStep(): number {
//       return this.SubscriptionConfig?.duration || 0;
//     },
//     DaysLeft(): number {
//       if (
//         this.UserStatus.endDate != undefined &&
//         this.UserStatus.startDate != undefined
//       ) {
//         return Math.ceil(
//           (this.UserStatus.endDate.valueOf() - new Date().valueOf()) /
//             (1000 * 3600 * 24)
//         );
//       }
//       return 0;
//     },
//     daysLeftClass(): string {
//       if (this.DaysLeft <= 5) {
//         return "bg-danger";
//       } else if (this.DaysLeft <= 10) {
//         return "bg-warning";
//       } else {
//         return "bg-success";
//       }
//     },
//     isActive(): boolean {
//       const status =
//         this.UserStatus.endDate != undefined &&
//         this.UserStatus.startDate != undefined &&
//         this.UserStatus.endDate > new Date();
//       this.$emit("isActive", status);
//       return status;
//     },
//     Total(): string {
//       const total = this.SubscriptionConfig.cost;
//       return total.toLocaleString();
//     },
//     SubscriptionDurationUnitLocalized(): string {
//       return this.durationUnitLocalized(
//         this.SubscriptionConfig.duration,
//         this.SubscriptionConfig?.durationUnit
//       );
//     },
//     ExpirationDurationUnitLocalized(): string {
//       return this.durationUnitLocalized(
//         this.DaysLeft,
//         this.SubscriptionConfig?.durationUnit
//       );
//     },
//     CanRenewSubscription(): boolean {
//       if (this.subscriptionId == "distributor-license") {
//         return true;
//       } else {
//         //Update days at function
//         return this.DaysLeft < 3;
//       }
//     }
//   },
//   methods: {
//     subscriptionQuote() {
//       const fiveMinutes = new Date();
//       fiveMinutes.setTime(fiveMinutes.getTime() + 5 * 60 * 1000); //5 minutes from now
//       if (
//         !(
//           this.lastQuote.subscriptionId == this.subscriptionId &&
//           this.lastQuote.username == this.getUsernamePK &&
//           this.lastQuote.expirationTime > fiveMinutes
//         )
//       ) {
//         this.$emit("clearQuote");
//         const request: QuoteSubscriptionRequest = {
//           subscriptionId: this.subscriptionId,
//           duration: this.SubscriptionConfig.duration,
//           durationUnit: this.SubscriptionConfig.durationUnit,
//           username: this.getUsernamePK,
//           email: this.getUseremail,
//           isDirectAffiliate: false
//         };
//         this.$emit("requestQuote", request);
//       }
//     }
//   }
// });
</script>
<style lang="scss" scoped>
.added-duration {
  text-align: center;
  min-width: unset;
  width: 3rem;
}
</style>
