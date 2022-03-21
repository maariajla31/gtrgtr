<template>
  <div class=" table-responsive">
    <table class="table table-striped table-sm">
      <thead>
        <tr class="fw-bold">
          <th class="col-2 text-center">Fecha</th>
          <th class="col-3">Concepto</th>
          <th class="" style="--max-width:  10rem">TX Hash</th>
          <th class="col-2 col-xl-2 text-center">Valor</th>
          <th class="col-2 col-xl-2 text-center">Pagado</th>
          <th class="col-2 col-xl-2 text-center">Status</th>
        </tr>
      </thead>
      <tbody>
        <tr class="" v-for="p of getPayments" :key="p._id">
          <td class="align-middle text-center small ">
            {{ formatDate(p._id) }}
          </td>
          <td class="align-middle">
            <span class="text-nowrap">{{ p.concept }}</span>
          </td>
          <td class="align-middle small ">
            <ul class="list-unstyled d-inline">
              <li
                class=" text-truncate"
                style="max-width: 15rem"
                v-for="(tran, tranid) of p.blockchainTransactions"
                :key="tranid"
              >
                <a
                  :href="'https://www.blockchain.com/search?search=' + tranid"
                  target="_blank"
                  class="link-success"
                  :title="tranid"
                  v-if="tranid != 'gtr_FIX_ACTIVATION'"
                  >{{ tranid }}</a
                >
              </li>
            </ul>
          </td>
          <td class="align-middle text-end">
            <div class="d-flex text-nowrap">
              <span class="ms-4 me-1">G$</span>
              <span class=" flex-fill me-4">
                {{ toTwoDecimals(Number(p.originalAmount)) }}</span
              >
            </div>
          </td>
          <td class="align-middle text-end">
            <div class="d-flex text-nowrap fw-bold">
              <span class="ms-4 me-1">
                <i class="fab fa-btc"></i>
              </span>
              <span class=" flex-fill me-4">
                {{ p.paidAmount.toFixed(8) }}
                <span class="small">{{ p.paidCurrency }}</span>
              </span>
            </div>
            <div
              class="d-flex text-nowrap small muted"
              v-if="p.processingAmount && p.processingAmount > 0"
            >
              <span class="ms-4 me-1">
                <i class="fab fa-btc"></i>
              </span>
              <span class=" flex-fill me-4">
                {{ p.processingAmount.toFixed(8) }}
                <span class="small">{{ p.paidCurrency }}</span>
              </span>
            </div>
          </td>
          <td class="align-middle">
            <div :class="'text-nowrap ' + statusColorClass(p.status)">
              <span class="ms-4 me-1">
                <i :class="statusIconClass(p.status) + ' me-1'"></i>
              </span>
              <span class="text-center small flex-fill me-4 text-truncate">
                {{ translateStatus(p.status) }}
              </span>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { mapGetters } from "vuex";
import { defineComponent } from "vue";
import {
  CLEAR_USER_PAYMENTS,
  doGetPayments,
  unsubscribeListener
} from "@/store/Payments/PaymentsInterfaces";

import dayjs from "dayjs";

export default defineComponent({
  name: "payments-detail",
  computed: {
    ...mapGetters("payments", ["getPayments"])
  },
  methods: {
    formatDate(milliseconds: number) {
      return dayjs(milliseconds).format("YYYY/MM/DD HH:mm:ss");
    },
    toTwoDecimals(num: number): string {
      return num.toLocaleString(undefined, {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2
      });
    },
    statusIconClass(status: string): string {
      switch (status) {
        case "new":
          return "far fa-play-circle";
        case "paid":
          return "fas fa-flag-checkered";
        case "confirmed":
          return "fas fa-cogs";
        case "complete":
          return "far fa-check-circle";
        case "paidOver":
          return "fas fa-exclamation-triangle";
        case "paidPartial":
          return "fas fa-exclamation-circle";
        case "expired":
          return "fas fa-ban";
        case "invalid":
          return "fas fa-exclamation-triangle";
        default:
          return "";
      }
    },
    statusColorClass(status: string): string {
      switch (status) {
        case "new":
          return "text-muted";
        case "paid":
          return "text-teal";
        case "confirmed":
          return "text-cyan";
        case "complete":
          return "text-success";
        case "paidOver":
          return "text-warning";
        case "paidPartial":
          return "text-danger";
        case "expired":
          return "text-warning";
        case "invalid":
          return "text-danger";
        default:
          return "";
      }
    },
    translateStatus(status: string): string {
      switch (status) {
        case "new":
          return "Nuevo";
        case "paid":
          return "Iniciado";
        case "confirmed":
          return "Procesando";
        case "complete":
          return "Pagado";
        case "paidOver":
          return "Pago excedido";
        case "paidPartial":
          return "Pago incompleto";
        case "expired":
          return "Expirado";
        case "invalid":
          return "Inválido";
        default:
          return status;
      }
    }
  },
  created() {
    if (this.getPayments.length > 0) {
      this.$store.commit("payments/" + CLEAR_USER_PAYMENTS);
    }
    this.$store.dispatch("payments/" + doGetPayments);
  },
  beforeUnmount() {
    this.$store.dispatch("payments/" + unsubscribeListener, "payments");
  }
});
</script>
