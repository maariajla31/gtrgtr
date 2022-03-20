<template>
  <div class="container-fluid mb-4">
    <div class="d-flex">
      <payouts-list
        class=""
        :payoutsList="getPayoutsList"
        @payoutSelected="updateDetails"
      ></payouts-list>
      <payout-detail
        class="flex-grow-1 table-responsive"
        :payoutDetails="getPayoutDetails"
        :payoutId="currentPayoutId"
      ></payout-detail>
    </div>
  </div>
</template>

<script lang="ts">
import { payoutsList, payoutDetail } from "@/components/payouts";
import { mapGetters } from "vuex";
import { defineComponent } from "vue";
import {
  CLEAR_PAYOUTS,
  doGetPayoutDetails,
  doGetPayoutsList,
  unsubscribeListener
} from "@/store/Payouts/PayoutsInterfaces";

export default defineComponent({
  name: "payouts",
  components: { payoutsList, payoutDetail },
  data() {
    return {
      currentPayoutId: ""
    };
  },
  computed: {
    ...mapGetters("payouts", ["getPayoutsList", "getPayoutDetails"])
  },
  methods: {
    updateDetails(id: string) {
      this.$store.dispatch("payouts/" + doGetPayoutDetails, id).then(() => {
        this.currentPayoutId = id;
      });
    }
  },
  created() {
    if (this.getPayoutsList.length > 0) {
      this.$store.commit("payouts/" + CLEAR_PAYOUTS);
    }
    this.$store.dispatch("payouts/" + doGetPayoutsList);
  },
  beforeUnmount() {
    this.$store.dispatch("payouts/" + unsubscribeListener, "payoutsList");
  }
});
</script>
