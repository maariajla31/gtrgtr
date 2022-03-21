<template>
  <span class="d-none">{{ usernamePK }}</span>
  <div class="col col-sm-12">
    <ul class="list-group">
      <li
        class="list-group-item d-flex justify-content-between align-items-center"
      >
        <div>
          <i class="fas fa-user-graduate text-indigo me-2"></i>
          Academia
        </div>
        <i
          v-if="accountSummary?.academyDaysLeft == 0"
          class="bi bi-x-circle-fill text-red"
        ></i>
        <span
          v-else
          class="badge rounded-pill"
          :class="daysLeftClass(accountSummary?.academyDaysLeft)"
        >
          {{ accountSummary?.academyDaysLeft?.toLocaleString() }}</span
        >
      </li>
      <li
        class="list-group-item d-flex justify-content-between align-items-center"
      >
        <div>
          <i class="bi bi-briefcase-fill text-info me-2"></i>
          Licencia de Distribuidor
        </div>
        <i
          v-if="accountSummary?.distributorDaysLeft == 0"
          class="bi bi-x-circle-fill text-red"
        ></i>
        <span
          v-else
          class="badge rounded-pill"
          :class="daysLeftClass(accountSummary?.distributorDaysLeft)"
        >
          {{ accountSummary?.distributorDaysLeft?.toLocaleString() }}</span
        >
      </li>
      <li
        class="list-group-item d-flex justify-content-between align-items-center"
        v-if="accountSummary.directAffiliates"
      >
        <div>
          <i class="bi bi-diagram-3 text-orange me-2"></i>
          Afiliados Directos
        </div>
        <span class="badge bg-info rounded-pill">{{
          accountSummary?.directAffiliates?.toLocaleString()
        }}</span>
      </li>
      <li
        class="list-group-item d-flex justify-content-between align-items-center"
      >
        <div>
          <i class="bi bi-diagram-2 text-purple me-2"></i>
          Bono de Red Binaria
        </div>
        <div
          class="small"
          v-if="
            accountSummary?.innerLegUnlocked != false &&
              accountSummary?.bonusRemainingDays < 15
          "
        >
          <span>Quedan </span>
          <strong>{{ accountSummary?.bonusRemainingDays }}</strong>
          días<span v-if="expiringSide">
            del lado <strong>{{ expiringSide }}</strong></span
          >
        </div>
        <i
          class="bi"
          :class="
            bonusClass(
              accountSummary?.innerLegUnlocked,
              accountSummary?.hasBinaryNetworkBonus,
              accountSummary?.bonusRemainingDays
            )
          "
        ></i>
      </li>
      <li
        class="list-group-item d-flex justify-content-between align-items-center"
      >
        <div>
          <i class="fab fa-bitcoin text-yellow me-2"></i>
          Bitcoin Wallet Configurada
        </div>
        <i
          v-if="accountSummary?.configuredWallet"
          class="bi bi-check-circle-fill text-green"
        ></i>
        <i v-else class="bi bi-x-circle-fill text-red"></i>
      </li>
      <li
        class="list-group-item d-flex justify-content-between align-items-center"
      >
        <div class="d-flex">
          <div>
            <i class="fas fa-piggy-bank text-pink me-2"></i>
          </div>
          <div>
            Beca GTR Academy
            <div v-if="accountSummary?.scholarshipPoints < 0" class="small">
              Inicia:
              <span class="fw-bold">
                {{ scholarshipStartDate }}
              </span>
            </div>
            <div
              v-else-if="
                accountSummary.scholarshipStartDate == undefined ||
                  accountSummary.scholarshipStartDate.getTime() == 0
              "
            ></div>
            <div v-else class="small">
              Fin del Periodo:
              <span class="fw-bold">
                {{ scholarshipEndDate }}
              </span>
            </div>
          </div>
        </div>
        <i
          v-if="accountSummary?.scholarshipEndDate < new Date()"
          class="bi bi-x-circle-fill text-red"
        ></i>
        <i
          v-else-if="accountSummary?.scholarshipPoints >= 300"
          class="fas fa-award text-yellow fa-lg"
        ></i>
        <span v-else-if="accountSummary?.scholarshipPoints < 0">
          <i class="fas fa-lock"></i>
        </span>
        <span v-else>
          <i :class="scholarshipPointsClass(100)"></i>
          <i :class="scholarshipPointsClass(200)"></i>
          <i :class="scholarshipPointsClass(300)"></i>
        </span>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { AccountSummary } from "@/store/Account/AccountInterface";
import { defineComponent } from "vue";
import { mapGetters } from "vuex";
//import { UserSubscription } from "functions/src/Users/UsersInterfaces";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(timezone);
dayjs.extend(advancedFormat);

export default defineComponent({
  name: "AccountSummary",
  data() {
    return {
      account: {
        academyDaysLeft: 0,
        distributorDaysLeft: 0,
        directAffiliates: 0,
        hasBinaryNetworkBonus: false,
        bonusRemainingDays: 0,
        configuredWallet: false
      }
    };
  },
  computed: {
    ...mapGetters("auth", ["getUsernamePK"]),
    ...mapGetters("account", ["getAccountSummary"]),
    accountSummary(): AccountSummary {
      return this.getAccountSummary;
    },
    usernamePK(): string {
      if (this.getUsernamePK) {
        this.getAccount(this.getUsernamePK);
      }
      return this.getUsernamePK;
    },
    expiringSide(): string {
      switch (this.accountSummary.binaryBonusExpiringSide) {
        case "left":
          return "Izquierdo";
        case "right":
          return "Derecho";
        default:
          return "";
      }
    },
    scholarshipStartDate(): string {
      return this.accountSummary?.scholarshipStartDate
        ? this.formatDateTimezone(
            this.accountSummary.scholarshipStartDate.getTime()
          )
        : "-";
    },
    scholarshipEndDate(): string {
      return this.accountSummary?.scholarshipEndDate
        ? this.formatDateTimezone(
            this.accountSummary.scholarshipEndDate.getTime()
          )
        : "-";
    }
  },
  methods: {
    getAccount(username: string) {
      this.$store
        .dispatch("account/initializeAccountSummary", username)
        .catch((error) => {
          console.log(error);
        });
    },
    daysLeftClass(daysLeft: number): string {
      if (daysLeft <= 5) {
        return "bg-danger";
      } else if (daysLeft <= 10) {
        return "bg-warning";
      } else {
        return "bg-success";
      }
    },
    bonusClass(innerLegUnlocked: boolean, hasBonus: boolean, days: number) {
      if (innerLegUnlocked == false) {
        return "fas fa-lock";
      } else if (hasBonus) {
        if (days < 10) {
          return "bi-exclamation-circle-fill text-red";
        } else if (days >= 10 && days < 15) {
          return "bi-exclamation-circle-fill text-warning";
        } else {
          return "bi-check-circle-fill text-green";
        }
      } else {
        return "bi-x-circle-fill text-red";
      }
    },
    scholarshipPointsClass(points: number) {
      const classes = "fa-lg ms-2";
      if (this.accountSummary.scholarshipPoints >= points) {
        return "fas fa-user text-orange " + classes;
      } else {
        return "far fa-user text-light-gray " + classes;
      }
    },
    formatDateTimezone(milliseconds: number) {
      return dayjs(milliseconds).format("YYYY/MM/DD HH:mm:ss z");
    }
  }
});
</script>

<style lang="scss" scoped></style>
