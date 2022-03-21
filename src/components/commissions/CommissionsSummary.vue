<template>
  <div class="col col-sm-12">
    <div class="card h-100">
      <h5 class="card-header text-truncate">
        <i class="bi bi-graph-up text-blue"></i>
        <span> Ganancias Totales</span>
      </h5>
      <div
        class="card-body d-flex flex-column justify-content-center align-items-center"
      >
        <h6 class="card-title h3 mb-0">G$ {{ total }}</h6>
      </div>
      <div class="card-footer last-updated-text text-muted text-center small">
        {{ totalDate }}
      </div>
    </div>
  </div>
  <div class="col">
    <div class="card h-100">
      <h5 class="card-header text-truncate">
        <i class="bi bi-wallet2 text-green"></i>
        <span> Comisiones Pagadas</span>
      </h5>
      <div
        class="card-body d-flex flex-column justify-content-center align-items-center"
      >
        <h6 class="card-title h3 mb-0">G$ {{ pending }}</h6>
      </div>
      <div class="card-footer last-updated-text text-muted text-center small">
        {{ pendingDate }}
      </div>
    </div>
  </div>
  <div class="col d-none">
    <div class="card h-100">
      <h5 class="card-header text-truncate">
        <i class="fab fa-bitcoin text-yellow"></i>
        <span> Total Retirado</span>
      </h5>
      <div
        class="card-body d-flex flex-column justify-content-center align-items-center"
      >
        <h6 class="card-title h3 mb-0">G$ {{ paid }}</h6>
      </div>
      <div class="card-footer last-updated-text text-muted text-center small">
        {{ paidDate }}
      </div>
    </div>
  </div>
  <div class="col">
    <div class="card h-100">
      <h5 class="card-header text-truncate">
        <i class="fas fa-piggy-bank text-pink"></i>
        <span> Bonos Recibidos</span>
      </h5>
      <div
        class="card-body d-flex flex-column justify-content-center align-items-center"
      >
        <h6 class="card-title h3 mb-0">G$ {{ paid }}</h6>
      </div>
      <div class="card-footer last-updated-text text-muted text-center small">
        {{ paidDate }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(timezone);
dayjs.extend(advancedFormat);

export default defineComponent({
  name: "commissions-summary",
  props: {
    summary: { type: Object, required: true }
  },
  computed: {
    total(): string {
      const num = this.summary?.total || 0;
      return num.toLocaleString(undefined, {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2
      });
    },
    pending(): string {
      const num = this.summary?.pending || 0;
      return num.toLocaleString(undefined, {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2
      });
    },
    paid(): string {
      const num = this.summary?.paid || 0;
      return num.toLocaleString(undefined, {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2
      });
    },
    totalDate(): string {
      return this.summary?.totalUpdatedDate
        ? this.formatDateTimezone(this.summary.totalUpdatedDate)
        : "-";
    },
    pendingDate(): string {
      return this.summary?.pendingUpdatedDate
        ? this.formatDateTimezone(this.summary.pendingUpdatedDate)
        : "-";
    },
    paidDate(): string {
      return this.summary?.paidUpdatedDate
        ? this.formatDateTimezone(this.summary.paidUpdatedDate)
        : "-";
    }
  },
  methods: {
    formatDate(milliseconds: number) {
      return dayjs(milliseconds).format("YYYY/MM/DD HH:mm:ss");
    },
    formatDateTimezone(milliseconds: number) {
      return dayjs(milliseconds).format("YYYY/MM/DD HH:mm:ss z");
    },
    toTwoDecimals(num: number): string {
      return num.toLocaleString(undefined, {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2
      });
    }
  }
});
</script>
