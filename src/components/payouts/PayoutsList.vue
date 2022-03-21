<template>
  <div class="payouts-list-container border rounded-start pt-4 pb-5">
    <div class="list-group payouts-list">
      <a
        href="#"
        v-for="payout of payoutsList"
        :key="payout"
        :class="[
          'list-group-item list-group-item-action border-1 border-end-0',
          selectedPayout == payout ? 'active rounded-start' : ''
        ]"
        @click="payoutSelected(payout)"
      >
        <span class="small text-nowrap">{{ formatDate(payout) }}</span>
      </a>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import dayjs from "dayjs";

export default defineComponent({
  name: "payouts-list",
  data() {
    return {
      selectedPayout: ""
    };
  },
  props: {
    payoutsList: { required: true, type: Object }
  },
  emits: ["payoutSelected"],
  methods: {
    formatDate(milliseconds: number) {
      return dayjs(milliseconds).format("YYYY/MM/DD HH:mm:ss");
    },
    payoutSelected(id: string) {
      if (this.selectedPayout != id) {
        this.selectedPayout = id;
        this.$emit("payoutSelected", id);
      }
    }
  },
  watch: {
    payoutsList: function(newValue) {
      if (this.selectedPayout == "") {
        this.payoutSelected(newValue[0]);
      }
    }
  }
});
</script>

<style lang="scss">
.payouts-list > a:first-child {
  border-top-right-radius: 0;
}
.payouts-list > a:last-child {
  border-bottom-right-radius: 0;
}
.payouts-list > a.active {
  background-color: $white;
  color: unset;
  border-right: 0;
  border-color: $cyan;
  margin-left: 2px;
}
.payouts-list > a {
  background-color: $gray-100;
  margin-left: 0px;
  //padding-left: 2px;
}
.payouts-list-container.border {
  background-color: $gray-200;
  //border-right: solid 2px $cyan !important;
}
</style>
