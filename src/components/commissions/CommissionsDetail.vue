<template>
  <div class="table-responsive -offset-xxl-1 col-sm-12">
    <table class="table table-striped table-sm">
      <thead>
        <tr class="fw-bold">
          <th class="col-2 text-center">Fecha</th>
          <th class="col-2 text-center">Tipo</th>
          <th class="col-3">Origen</th>
          <th class="col-2 col-xl-1 text-center">Estatus</th>
          <th class="col-3 col-xl-2 text-center">Valor</th>
        </tr>
      </thead>
      <tbody v-if="commissions.length > 0">
        <tr v-for="c of commissions" :key="c._id">
          <td class="align-middle text-center small ">
            {{ formatDate(c._id) }}
          </td>
          <td class="align-middle">
            <div class="d-flex align-items-center text-nowrap">
              <span class="ms-4 me-3">
                <i :class="typeIconClass(c.type)"></i>
              </span>
              <span class="flex-fill me-1">
                {{ translateType(c.type) }}
              </span>
            </div>
          </td>
          <td class="align-middle small">{{ c.source }}</td>
          <td class="align-middle">
            <div
              :class="'d-flex align-items-center ' + statusColorClass(c.status)"
            >
              <span class="ms-4 me-1">
                <i :class="'fa-fw ' + statusIconClass(c.status)"></i>
              </span>
              <span class="text-center small flex-fill me-4 text-truncate">
                {{ translateStatus(c.status) }}
              </span>
            </div>
          </td>
          <td class="align-middle text-end">
            <div class="d-flex text-nowrap">
              <span class="ms-4 me-1">G$</span>
              <span :class="'flex-fill me-4 ' + amountClass(c.status)">
                {{ toTwoDecimals(c.amount) }}</span
              >
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import dayjs from "dayjs";

export default defineComponent({
  name: "commissions-detail",
  props: {
    commissions: { type: Object, required: true }
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
    translateType(type: string): string {
      switch (type) {
        case "direct":
          return "Venta Directa";
        case "binary":
          return "Binario";
        case "carrer":
          return "Carrera";
        case "scholarship":
          return "Beca";
        case "scholarshipCredit":
          return "Crédito de Beca";
        case "prize":
          return "Premio";
        case "penalty":
          return "Multa";
        case "novolume":
          return "Sin Volumen";
        default:
          return type;
      }
    },
    typeIconClass(type: string): string {
      switch (type) {
        case "direct":
          return "fas fa-hand-holding-usd text-cyan";
        case "binary":
          return "bi bi-diagram-2 text-purple";
        case "carrer":
          return "fas fa-award text-red";
        case "scholarship":
          return "fas fa-piggy-bank text-pink";
        case "scholarshipCredit":
          return "fas fa-user text-orange";
        case "prize":
          return "fas fa-trophy text-yellow";
        case "penalty":
          return "fas fa-times-circle text-danger";
        case "novolume":
          return "far fa-handshake text-muted";
        default:
          return "";
      }
    },
    translateStatus(status: string): string {
      switch (status) {
        case "pending":
          return "Pendiente";
        case "processing":
          return "En Proceso";
        case "paid":
          return "Pagada";
        case "lost":
          return "Perdida";
        default:
          return status;
      }
    },
    statusIconClass(status: string): string {
      switch (status) {
        case "pending":
          return "far fa-clock";
        case "processing":
          return "fas fa-cogs";
        case "paid":
          return "far fa-check-circle";
        case "lost":
          return "far fa-frown";
        default:
          return "";
      }
    },
    statusColorClass(status: string): string {
      switch (status) {
        case "pending":
          return "text-warning";
        case "processing":
          return "text-cyan";
        case "paid":
          return "text-success";
        case "lost":
          return "muted";
        default:
          return "";
      }
    },
    amountClass(status: string): string {
      switch (status) {
        case "pending":
          return "muted";
        case "paid":
          return "text-dark fw-bold";
        case "lost":
          return "text-decoration-line-through";
        default:
          return "";
      }
    }
  }
});
</script>
