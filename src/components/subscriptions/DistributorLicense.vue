<template>
  <div>
    <div class="row">
      <div class="col-12 col-md-6 col-xl-4 d-flex flex-row mb-4">
        <status-card
          :subscription-id="'distributor-license'"
          :lastQuote="quote"
          :isQuoting="isQuoting"
          @isActive="setIsActive"
          @clear-quote="clearQuote"
          @request-quote="createQuote"
        ></status-card>
      </div>
      <div
        class="col-12 col-md-6 col-xl-4 d-flex flex-row mb-4"
        v-if="isActive"
      >
        <register-card
          :subscription-id="'trading-academy'"
          :lastQuote="quote"
          :isPaid="affiliateIsPaid"
          @clear-quote="clearQuote"
          @request-quote="createQuote"
          @paid="affiliateMarkedAsPaid"
        ></register-card>
      </div>
    </div>
    <div class="row">
      <div v-if="isActive" class="col-12 d-flex mb-4">
        <search-user
          :lastQuote="quote"
          :isPaid="affiliateIsPaid"
          :isQuoting="isQuoting"
          @clear-quote="clearQuote"
          @request-quote="createQuote"
          @paid="affiliateMarkedAsPaid"
        ></search-user>
      </div>
    </div>
  </div>
  <checkout-modal
    :quote="quote"
    @clear-quote="clearQuote"
    @renew-quote="createQuote"
    @paid="paid"
  ></checkout-modal>
  <div class="distributor d-none">
    <h1>Distributor License</h1>
    <ul>
      <li>Adquirir licencia</li>
      <li>Inscribir socio</li>
      <li>Inscribir multiples socios</li>
      <li>Inscribir desde archivo</li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
// import StatusCard from "./StatusCard.vue";
import CheckoutModal from "../CheckoutModal.vue";
import RegisterCard from "./RegisterCard.vue";
import SearchUser from "./SearchUser.vue";
// import { Quote } from "functions/src/Payments/PaymentsInterfaces";
// import { QuoteSubscriptionRequest } from "functions/src/Subscriptions/SubscriptionsInterfaces";
import { quoteSubscription } from "@/store/Subscriptions/SubscriptionsConsts";
import * as bs from "bootstrap";
import { mapGetters } from "vuex";

export default defineComponent({
  name: "DistributorLicense",
  components: { CheckoutModal, RegisterCard, SearchUser },
  data() {
    return {
      // quote: {} as Quote,
      affiliateIsPaid: false,
      isQuoting: false,
      isActive: false,
      modalObj: {} as any
    };
  },
  computed: {
    ...mapGetters("sys", ["isOffline"])
  },
  methods: {
    clearQuote() {
      // this.quote = {} as Quote;
    },
    // createQuote(request: QuoteSubscriptionRequest): void {
    //   if (!this.isOffline) {
    //     this.isQuoting = true;
    //     this.$store.dispatch("subs/" + quoteSubscription, request).then((q) => {
    //       if (q.OPCODE == "ERROR") {
    //         alert(q.message);
    //       } else {
    //         this.quote = q;

    //         if (!this.modalObj._isShown) {
    //           this.modalObj.show();
    //         }
    //       }
    //       this.isQuoting = false;
    //     });
    //   }
    // },
    paid() {
      this.affiliateIsPaid = true;
    },
    affiliateMarkedAsPaid() {
      this.affiliateIsPaid = false;
    },
    setIsActive(status: boolean) {
      this.isActive = status;
    }
  },
  mounted() {
    this.modalObj = new bs.Modal(document.getElementById("checkout-modal"));
  }
});
</script>
