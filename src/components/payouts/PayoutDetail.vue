<template>
  <div class="payout-detail rounded-end border border-1">
    <div class="container-fluid px-4">
      <div class="row text-end d-flex my-3">
        <div class="input-group input-group-sm justify-content-end">
          <input
            type="radio"
            class="btn-check"
            name="priority"
            id="low"
            value="low"
            autocomplete="off"
            v-model="priority"
          /><label for="low" class=" rounded-start btn btn-outline-info"
            >Low</label
          >
          <input
            type="radio"
            class="btn-check"
            name="priority"
            id="medium"
            value="medium"
            autocomplete="off"
            checked
            v-model="priority"
          /><label for="medium" class="btn btn-outline-info">Medium</label>
          <input
            type="radio"
            class="btn-check"
            name="priority"
            id="high"
            value="high"
            autocomplete="off"
            v-model="priority"
          /><label for="high" class="btn btn-outline-info">High</label>
          <button
            class="btn btn-outline-primary"
            @click="quoteWidrawals()"
            :enabled="!quoting"
          >
            Calcular
            <i v-if="quoting" class="fas fa-spinner fa-spin"></i>
          </button>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <table class="table table-sm">
            <thead>
              <tr>
                <th class="col-1 text-start">
                  <input
                    class="form-check-input me-2"
                    type="checkbox"
                    id="toggle-all"
                    :value="toggleCheckUsers"
                    v-model="toggleCheckUsers"
                    @click="toggleCheckboxes()"
                  />Username
                </th>
                <th class="col-1 text-center">Valor</th>
                <th class="col-1 text-center">Comisión</th>
                <th class="col-1 text-center text-nowrap">Por Pagar</th>
                <th class="col-1 text-center">Status</th>
                <th class="col-1 text-center text-nowrap">Comisión BC</th>
                <th class="col-1 text-center">Total</th>
                <th class="col-2 text-nowrap">Wallet / TX Hash</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="detail of payoutDetails" :key="detail._id">
                <td class="text-nowrap">
                  <input
                    class="form-check-input align-bottom"
                    type="checkbox"
                    v-if="
                      detail.status == 'new' ||
                        detail.status == 'invalid_wallet'
                    "
                    :id="detail._id"
                    checked
                    :value="detail.username"
                    v-model="checkedUsers"
                  />
                  <span v-else class=" px-2 me-1"></span>
                  {{ detail.username }}
                </td>
                <td class="align-top text-end">
                  <div class="d-flex text-nowrap">
                    <span class="ms-3 me-1">G$</span
                    ><span class=" flex-fill me-2">{{
                      toTwoDecimals(detail.amount)
                    }}</span>
                  </div>
                </td>
                <td class="align-top text-end">
                  <div class="d-flex text-nowrap">
                    <span class="ms-3 me-1">G$</span
                    ><span class=" flex-fill me-2">{{
                      toTwoDecimals(detail.fee)
                    }}</span>
                  </div>
                </td>
                <td class="align-top text-end">
                  <div class="d-flex text-nowrap">
                    <span class="ms-3 me-1">G$</span
                    ><span class=" flex-fill me-2">{{
                      toTwoDecimals(detail.payment)
                    }}</span>
                  </div>
                  <div class="d-flex text-nowrap">
                    <span class="ms-3 me-1"><i class="fab fa-btc"></i></span
                    ><span class=" flex-fill me-2">{{
                      detail.paidAmount.toFixed(8) || "0.00000000"
                    }}</span>
                  </div>
                </td>
                <td class="align-middle text-center">
                  <div
                    :class="'text-nowrap ' + statusColorClass(detail.status)"
                  >
                    <span class="ms-4 me-1">
                      <i :class="statusIconClass(detail.status) + ' me-1'"></i>
                    </span>
                    <span
                      class="text-center small flex-fill me-4 text-truncate"
                    >
                      {{ translateStatus(detail.status) }}
                    </span>
                  </div>
                </td>
                <td class="align-top text-end">
                  <div class="d-flex text-nowrap">
                    <span class="ms-3 me-1"
                      ><i class="fas fa-dollar-sign"></i></span
                    ><span class="flex-fill me-2">{{
                      toTwoDecimals(
                        (detail.blockchainFee * detail.payment) /
                          detail.paidAmount
                      )
                    }}</span>
                  </div>
                  <div class="d-flex text-nowrap">
                    <span class="ms-3 me-1"><i class="fab fa-btc"></i></span
                    ><span class=" flex-fill me-2">{{
                      detail.blockchainFee.toFixed(8) || "0.00000000"
                    }}</span>
                  </div>
                </td>
                <td class="align-top text-end">
                  <div class="d-flex text-nowrap">
                    <span class="ms-3 me-1"
                      ><i class="fas fa-dollar-sign"></i></span
                    ><span class="flex-fill me-2">{{
                      toTwoDecimals(
                        (detail.totalSpent * detail.payment) / detail.paidAmount
                      )
                    }}</span>
                  </div>
                  <div class="d-flex text-nowrap">
                    <span class="ms-3 me-1"><i class="fab fa-btc"></i></span
                    ><span class=" flex-fill me-2">{{
                      detail.totalSpent.toFixed(8) || "0.00000000"
                    }}</span>
                  </div>
                </td>
                <td class="align-middle small" style="max-width: 8rem">
                  <div class="text-truncate">
                    <span :title="detail.destinationAddress">{{
                      detail.destinationAddress
                    }}</span>
                  </div>
                  <div class="text-truncate">
                    <a
                      v-if="detail.hash != 'pending'"
                      :href="
                        'https://www.blockchain.com/search?search=' +
                          detail.hash
                      "
                      target="_blank"
                      class="link-success"
                      >{{ detail.hash }}</a
                    >
                  </div>
                </td>
              </tr>
            </tbody>
            <tfoot class="bg-gray-100 bg-gradient">
              <tr>
                <td class="align-top text-end fw-bold">Totales:</td>
                <td class="align-top text-end">
                  <div class="d-flex text-nowrap">
                    <span class="ms-3 me-1">G$</span
                    ><span class=" flex-fill me-2">{{
                      toTwoDecimals(totals.amount)
                    }}</span>
                  </div>
                </td>
                <td class="align-top text-end">
                  <div class="d-flex text-nowrap">
                    <span class="ms-3 me-1">G$</span
                    ><span class=" flex-fill me-2">{{
                      toTwoDecimals(totals.fee)
                    }}</span>
                  </div>
                </td>
                <td class="align-top text-end">
                  <div class="d-flex text-nowrap">
                    <span class="ms-3 me-1">G$</span
                    ><span class=" flex-fill me-2">{{
                      toTwoDecimals(totals.payment)
                    }}</span>
                  </div>
                  <div class="d-flex text-nowrap">
                    <span class="ms-3 me-1"><i class="fab fa-btc"></i></span
                    ><span class=" flex-fill me-2">{{
                      totals.paidAmount.toFixed(8) || "0.00000000"
                    }}</span>
                  </div>
                </td>
                <td class="align-top text-end"></td>
                <td class="align-top text-end">
                  <div class="d-flex text-nowrap">
                    <span class="ms-3 me-1"
                      ><i class="fas fa-dollar-sign"></i></span
                    ><span class="flex-fill me-2 small">{{
                      toTwoDecimals(totals.blockchainFeeUsd)
                    }}</span>
                  </div>
                  <div class="d-flex text-nowrap">
                    <span class="ms-3 me-1"><i class="fab fa-btc"></i></span
                    ><span class=" flex-fill me-2">{{
                      totals.blockchainFee.toFixed(8) || "0.00000000"
                    }}</span>
                  </div>
                </td>
                <td class="align-top text-end">
                  <div class="d-flex text-nowrap">
                    <span class="ms-3 me-1"
                      ><i class="fas fa-dollar-sign"></i></span
                    ><span class="flex-fill me-2 small">{{
                      toTwoDecimals(totals.totalSpentUsd)
                    }}</span>
                  </div>
                  <div class="d-flex text-nowrap">
                    <span class="ms-3 me-1"><i class="fab fa-btc"></i></span
                    ><span class=" flex-fill me-2">{{
                      totals.totalSpent.toFixed(8) || "0.00000000"
                    }}</span>
                  </div>
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
      <div class="row text-end d-flex flex-row my-3">
        <div>
          <button
            class="btn btn-primary"
            @click="processPayouts"
            :disabled="paying || quoting"
          >
            Procesar
            <i v-if="paying" class="fas fa-spinner fa-spin"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
// import { UserPayout } from "@/../functions/src/System/SystemInterfaces";
import { defineComponent } from "vue";
import * as fb from "../../firebase";

export default defineComponent({
  name: "payout-detail",
  props: {
    payoutDetails: { required: true, type: Object },
    payoutId: { required: true, type: String }
  },
  data() {
    return {
      priority: "medium",
      checkedUsers: new Array<string>(),
      toggleCheckUsers: false,
      quoting: false,
      paying: false
    };
  },
  methods: {
    toTwoDecimals(num: number): string {
      if (num) {
        return num.toLocaleString(undefined, {
          maximumFractionDigits: 2,
          minimumFractionDigits: 2
        });
      } else {
        return "0.00";
      }
    },
    toggleCheckboxes() {
      //Fired before value is changed
      this.checkedUsers = []; //Uncheck all users, clean array if all will be added
      if (!this.toggleCheckUsers) {
        //Check all users
        this.payoutDetails.forEach((u: "UserPayout") => {
          this.checkedUsers.push(u);
        });
      }
    },
    quoteWidrawals() {
      this.quoting = true;
      const quoteWithdrawals = fb.func.httpsCallable(
        "Payments-quoteWithdrawals"
      );
      const request = {
        withdrawalId: this.payoutId,
        users: this.checkedUsers,
        priority: this.priority
      };
      quoteWithdrawals(request)
        .then((response) => {
          if (response.data.OPCODE == "ERROR") {
            console.log(response);
            alert(response.data.message);
          }
        })
        .catch((error) => {
          alert(error);
          console.log(error);
        })
        .finally(() => {
          this.quoting = false;
        });
    },
    processPayouts() {
      this.paying = true;
      const processPayouts = fb.func.httpsCallable("Payments-processPayouts");
      const request = {
        withdrawalId: this.payoutId,
        users: this.checkedUsers,
        priority: this.priority
      };
      processPayouts(request)
        .then((response) => {
          if (response.data.OPCODE == "ERROR") {
            alert(response.data.message);
          }
        })
        .catch((error) => {
          alert(error);
          console.log(error);
        })
        .finally(() => {
          this.paying = false;
        });
    },
    statusIconClass(status: string): string {
      switch (status) {
        case "new":
          return "far fa-clock";
        case "invalid_wallet":
          return "fas fa-wallet";
        case "processing":
          return "fas fa-cogs";
        case "paid":
          return "fas fa-flag-checkered";
        case "confirmed":
          return "fas fa-cogs";
        case "complete":
          return "far fa-check-circle";
        default:
          return "";
      }
    },
    statusColorClass(status: string): string {
      switch (status) {
        case "new":
          return "text-warning";
        case "invalid_wallet":
          return "text-danger";
        case "processing":
          return "text-cyan";
        case "paid":
          return "text-teal";
        case "confirmed":
          return "text-cyan";
        case "complete":
          return "text-success";
        default:
          return "";
      }
    },
    translateStatus(status: string): string {
      switch (status) {
        case "new":
          return "Pendiente";
        case "invalid_wallet":
          return "Cartera Inválida";
        case "processing":
          return "En proceso";
        case "paid":
          return "Iniciado";
        case "confirmed":
          return "Procesando";
        case "complete":
          return "Pagado";
        default:
          return status;
      }
    }
  },
  computed: {
    totals(): any {
      const totals: any = {
        amount: (this.payoutDetails as []).reduce(
          (a, b) => a + (b["amount"] || 0),
          0
        ),
        fee: (this.payoutDetails as []).reduce(
          (a, b) => a + (b["fee"] || 0),
          0
        ),
        payment: (this.payoutDetails as []).reduce(
          (a, b) => a + (b["payment"] || 0),
          0
        ),
        paidAmount: (this.payoutDetails as []).reduce(
          (a, b) => a + (b["paidAmount"] || 0),
          0
        ),
        blockchainFee: (this.payoutDetails as []).reduce(
          (a, b) => a + (b["blockchainFee"] || 0),
          0
        ),
        blockchainFeeUsd: 0,
        totalSpent: (this.payoutDetails as []).reduce(
          (a, b) => a + (b["totalSpent"] || 0),
          0
        ),
        totalSpentUsd: 0
      };
      totals.blockchainFeeUsd =
        (totals.blockchainFee * totals.payment) / totals.paidAmount;

      totals.totalSpentUsd =
        (totals.totalSpent * totals.payment) / totals.paidAmount;

      totals.blockchainFeeUsd = totals.blockchainFeeUsd
        ? totals.blockchainFeeUsd
        : 0;
      totals.totalSpentUsd = totals.totalSpentUsd ? totals.totalSpentUsd : 0;
      return totals;
    }
  },
  watch: {
    payoutDetails: function() {
      this.checkedUsers = [];
      this.toggleCheckUsers = false;
      this.quoting = false;
    }
  }
});
</script>
<style lang="scss" scoped>
.bg-table-footer {
  background-color: $gray-100;
}
.payout-detail {
  min-height: 300px;
  background-color: $white;
  border-color: $cyan !important;
}
</style>
