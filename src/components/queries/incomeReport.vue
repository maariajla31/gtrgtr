<template>
  <div class="row">
    <div class="col-12 col-xl-8">
      <span class="period-text">Periodo: </span>
      <input
        type="date"
        id="fromDt"
        name="fromDt"
        class="form-control w-25 input-date"
        v-model="fromDate"
      />

      <span class="period-text">al</span>
      <input
        type="date"
        class="form-control w-25 input-date"
        id="toDt"
        v-model="toDate"
        v-bind:min="this.fromDate"
      />
      <button
        class="btn btn-outline-info btn-search"
        @click="getData()"
        :disabled="!this.fromDate || !this.toDate"
      >
        <i class="fas fa-search"></i>
      </button>
    </div>
  </div>
  <div class="row mt-4">
    <div class=" table-responsive">
      <table class="table table-striped table-sm">
        <thead>
          <tr class="fw-bold">
            <th class="col-2 text-center">Fecha</th>
            <th class="">Usuario</th>
            <th class="">Concepto</th>
            <th class="">Patrocinador</th>
            <th class="text-center">Valor</th>
            <th class="text-center">Pagado</th>
          </tr>
        </thead>
        <tr>
          <td colspan="6" v-if="loadingData" class="text-center">
            Loading ...
          </td>
        </tr>
        <tbody v-if="getIncomeReport && !loadingData">
          <tr class="" v-for="row of getIncomeReport" :key="row.date">
            <td class="align-middle text-center small">
              {{ formatDate(row.date.toDate()) }}
            </td>
            <td class="align-middle">{{ row.username }}</td>
            <td class="align-middle">{{ row.concept }}</td>
            <td class="align-middle">{{ row.enroller }}</td>
            <td class="align-middle text-end text-nowrap">{{ row.value }}</td>
            <td class="align-middle text-end text-nowrap">{{ row.paid }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
import {
  clearIncomeData,
  doGetIncomeData,
  IncomeDataRequest
} from "@/store/Queries/QueriesInterfaces";
import { defineComponent } from "vue";
import { mapGetters } from "vuex";
import dayjs from "dayjs";

export default defineComponent({
  name: "income-report",
  data() {
    return {
      fromDate: "",
      toDate: "",
      loadingData: false
    };
  },
  computed: {
    ...mapGetters("queries", ["getIncomeReport"])
  },
  methods: {
    formatDate(milliseconds: number) {
      return dayjs(milliseconds).format("YYYY/MM/DD HH:mm:ss");
    },
    async getData() {
      if (this.getIncomeReport && this.getIncomeReport.length > 0) {
        await this.$store.dispatch("queries/" + clearIncomeData);
      }
      const request: IncomeDataRequest = {
        fromDate: new Date(this.fromDate + " 00:00:00"),
        toDate: dayjs(new Date(this.toDate + " 00:00:00"))
          .add(1, "day")
          .toDate()
      };
      this.loadingData = true;
      await this.$store.dispatch("queries/" + doGetIncomeData, request);
      this.loadingData = false;
    }
  }
});
</script>
