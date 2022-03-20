<template>
  <div class="container-md mb-4">
    <div
      class="row row-cols-1 row-cols-sm-2 row-cols-xl-3 g-4 mb-4 justify-content-center"
    >
      <commissions-summary :summary="summary"></commissions-summary>
    </div>
    <div class="row">
      <commissions-detail :commissions="commissions"> </commissions-detail>
    </div>
  </div>
</template>

<script lang="ts">
import {
  CLEAR_USER_COMMISSIONS,
  doGetCommissions,
  unsubscribeListener
} from "@/store/Commissions/CommissionsInterfaces";
import { defineComponent } from "vue";
import { mapGetters } from "vuex";
import {
  CommissionsDetail,
  CommissionsSummary
} from "../components/commissions";

export default defineComponent({
  name: "Commissions",
  components: { CommissionsDetail, CommissionsSummary },
  data() {
    return {
      loaded: false
    };
  },
  computed: {
    ...mapGetters("commissions", {
      commissions: "getCommissions",
      summary: "getSummary"
    })
  },
  methods: {
    async requestCommissions() {
      await this.$store.dispatch("commissions/" + doGetCommissions);
      this.loaded = true;
    }
  },
  async created() {
    if (this.commissions.length > 0) {
      this.$store.commit("commissions/" + CLEAR_USER_COMMISSIONS);
    }
    await this.requestCommissions();
  },
  beforeUnmount() {
    this.$store.dispatch("commissions/" + unsubscribeListener);
  }
});
</script>
