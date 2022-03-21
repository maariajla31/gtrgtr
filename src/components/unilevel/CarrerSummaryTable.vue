<template>
  <div class="flex-grow-1 table-responsive">
    <table class="table mb-0">
      <tbody>
        <tr>
          <td></td>
          <td class="h5">Rango actual:</td>
          <td class="h5 text-end text-nowrap">
            <i :class="userRank?.iconClass + ' pe-2'"></i>
            {{ userRank?.name }}
          </td>
          <td></td>
        </tr>
        <tr>
          <td></td>
          <td class="h6">Volumen Calificado:</td>
          <td class="h6 text-end">
            {{ totalValidPoints.toLocaleString() }}
          </td>
          <td></td>
        </tr>
        <tr>
          <td></td>
          <td class="h6">Volumen Total:</td>
          <td class="h6 text-end">
            {{ userData.points.current.toLocaleString() }}
          </td>
          <td></td>
        </tr>
        <tr>
          <td></td>
          <td class="h6">Total facturado por la red:</td>
          <td class="h6 text-end text-nowrap">G$ {{ invoicedTotalString }}</td>
          <td></td>
        </tr>
        <tr v-if="userData.scholarshipData">
          <td></td>
          <td>
            <i class="fas fa-piggy-bank fa-fw text-pink me-2"></i>Beca GTR
            Academy
            <div class="small">
              <i class="fas fa-fw me-2"></i>
              Fin del Periodo:
            </div>
          </td>
          <td class="text-end">
            <i
              v-if="userData.scholarshipData.periodPoints >= 300"
              class="fas fa-award text-yellow fa-lg"
            ></i>
            <span v-else>
              <i :class="scholarshipPointsClass(100)"></i>
              <i :class="scholarshipPointsClass(200)"></i>
              <i :class="scholarshipPointsClass(300)"></i>
            </span>
            <div class="small">
              <span class="small fw-bold">{{ scholarshipEndDate }}</span>
            </div>
          </td>
          <td></td>
        </tr>
        <tr class="small text-center">
          <td></td>
          <td>
            <div class="text-nowrap">
              <i class="fas fa-user-graduate text-indigo me-2"></i>
              Academia
            </div>
            <span class="">
              <i
                v-if="academyDaysLeft == 0"
                class="bi bi-x-circle-fill text-red"
              ></i>
              <span
                v-else
                class="badge rounded-pill"
                :class="daysLeftClass(academyDaysLeft)"
              >
                {{ academyDaysLeft?.toLocaleString() }}</span
              >
            </span>
          </td>
          <td>
            <div class="text-nowrap">
              <i class="bi bi-briefcase-fill text-info me-2"></i>
              Licencia de Distribuidor
            </div>
            <span class="">
              <i
                v-if="distributorDaysLeft == 0"
                class="bi bi-x-circle-fill text-red"
              ></i>
              <span
                v-else
                class="badge rounded-pill"
                :class="daysLeftClass(distributorDaysLeft)"
              >
                {{ distributorDaysLeft?.toLocaleString() }}</span
              >
            </span>
          </td>
          <td></td>
        </tr>
      </tbody>
      <tfoot class="bg-table-footer">
        <tr class="bg-gradient">
          <td></td>
          <td class="h6 small">Siguiente Rango:</td>
          <td class="h6 small text-end">
            <i :class="userNextRank?.iconClass + ' pe-2'"></i>
            {{ rankName(userData.nextRank) }}
          </td>
          <td></td>
        </tr>
        <tr class="bg-gradient" v-if="nextRankPoints != '0'">
          <td></td>
          <td class="h6 small">
            Volumen Calificado Requerido:
          </td>
          <td class="h6 small text-end fw-bold">
            {{ nextRankPoints }}
          </td>
          <td></td>
        </tr>
        <tr class="bg-gradient small" v-if="nextRankPoints != '0'">
          <td></td>
          <td class="h6 small">
            Mínimo por Equipo (20%):
            <span class="ms-1 fw-bold">{{ minTeamPoints }}</span>
          </td>
          <td class="h6 small text-end">
            Máximo por Socio (40%):
            <span class="ms-1 fw-bold">{{ maxAffiliatePoints }}</span>
          </td>
          <td></td>
        </tr>
        <tr class="bg-gradient" v-if="nextRankEarning != '0.00'">
          <td></td>
          <td class="h6 small">
            Ganancias requeridas:
          </td>
          <td class="h6 small text-end">G$ {{ nextRankEarning }}</td>
          <td></td>
        </tr>
      </tfoot>
    </table>
  </div>
</template>

<script lang="ts">
import { mapGetters } from "vuex";
import { defineComponent } from "vue";
import { Rank } from "@/store/Ranks/RanksInterfaces";
import { UnilevelMember } from "@/store/Unilevel/UnilevelInterfaces";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(timezone);
dayjs.extend(advancedFormat);

export default defineComponent({
  name: "carrer-summary",
  props: {
    userData: { required: true, type: Object as () => UnilevelMember }
  },
  computed: {
    ...mapGetters("ranks", ["rankName", "rankIconClass", "rankById"]),
    ...mapGetters("auth", ["nextRank", "currentRank"]),
    userRank(): Rank {
      return this.rankById(this.userData.currentRank);
    },
    userNextRank(): Rank {
      const nextRank = this.rankById(this.userData.nextRank);
      return nextRank;
    },
    invoicedTotalString(): string {
      return this.userData.invoicedTotal.toLocaleString(undefined, {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2
      });
    },
    nextRankPoints(): string {
      if (this.userNextRank?.requiredPoints) {
        return this.userNextRank?.requiredPoints.toLocaleString();
      } else {
        return "0";
      }
    },
    nextRankEarning(): string {
      if (this.userNextRank?.requiredEarning) {
        return this.userNextRank?.requiredEarning.toLocaleString(undefined, {
          maximumFractionDigits: 2,
          minimumFractionDigits: 2
        });
      } else {
        return "0.00";
      }
    },
    totalValidPoints(): number {
      return this.userData.points.valid.left + this.userData.points.valid.right;
    },
    minTeamPoints(): string {
      return (this.userNextRank?.requiredPoints * 0.2).toLocaleString();
    },
    maxAffiliatePoints(): string {
      return (this.userNextRank?.requiredPoints * 0.4).toLocaleString();
    },
    academyDaysLeft(): number {
      const days = this.userData.subscriptions.get("trading-academy");
      return days ? days : 0;
    },
    distributorDaysLeft(): number {
      const days = this.userData.subscriptions.get("distributor-license");
      return days ? days : 0;
    },
    scholarshipEndDate(): string {
      return this.userData.scholarshipData?.periodEndDate &&
        this.userData.scholarshipData?.periodEndDate.getTime() > 0
        ? this.formatDateTimezone(
            this.userData.scholarshipData?.periodEndDate.getTime()
          )
        : "-";
    }
  },
  methods: {
    scholarshipPointsClass(points: number) {
      const classes = "fa-lg ms-2";
      if (
        this.userData.scholarshipData &&
        this.userData.scholarshipData.periodPoints >= points
      ) {
        return "fas fa-user text-orange " + classes;
      } else {
        return "far fa-user text-light-gray " + classes;
      }
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
    formatDateTimezone(milliseconds: number) {
      return dayjs(milliseconds).format("YYYY/MM/DD HH:mm:ss z");
    }
  }
});
</script>

<style lang="scss" scoped>
.bg-table-footer {
  background-color: $gray-200;
}
</style>
