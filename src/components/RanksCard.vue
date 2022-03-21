<template>
  <div class="card">
    <h5 class="card-header d-flex align-items-center">
      <span><i class="fas fa-tasks me-2 text-green"></i>{{ cardTitle }}</span>
    </h5>
    <div
      id="ranksCarousel"
      class="card-body text-center d-flex align-items-strech carousel carousel-dark slide"
      data-bs-ride="carousel"
      data-bs-interval="false"
      data-bs-wrap="false"
    >
      <div class="carousel-inner d-flex align-items-center">
        <div
          v-for="rank in ranksData"
          :key="rank[0]"
          class="carousel-item"
          :class="{ active: displayedRankId == rank[1]._id }"
        >
          <span class="fa-stack rank-icon fa-4x">
            <i :class="rank[1].iconClass + ' fa-stack-2x rank-base'"></i>
            <i
              v-if="nextRank != undefined"
              :class="rank[1].iconClass + ' fa-stack-2x rank-progress'"
              :style="[
                isNextRank(rank[1]._id)
                  ? { height: 100 - nextRank.progress + '%' }
                  : isRankLocked(rank[1]._id)
                  ? { height: 100 + '%' }
                  : { height: '0%' }
              ]"
            ></i>
            <i
              v-if="isRankLocked(rank[1]._id)"
              :class="'fas fa-lock fa-stack-1x rank-locked'"
            ></i>
            <i
              v-if="isRankUnlocked(rank[1]._id)"
              :class="
                'fas fa-check-circle fa-stack-1x rank-unlocked text-green'
              "
            ></i>
          </span>
          <h6 class="text-dark mt-1 mb-0">
            {{ rank[1].name }}
          </h6>
          <span class="text-dark">
            <span
              class="rank-date"
              v-if="rankDate(rank[1]._id) && !isNextRank(rank[1]._id)"
              >{{ formatDateTimezone(rankDate(rank[1]._id)) }}</span
            >
            <span v-if="nextRank != undefined && isNextRank(rank[1]._id)">
              Avance:
              <span class="fw-bold"
                >{{ toTwoDecimals(nextRank.progress) }} %
              </span>
            </span>
            <span v-if="isRankLocked(rank[1]._id)" class=""
              >Rango Bloqueado</span
            >
          </span>
        </div>
      </div>
      <a
        class="carousel-control-prev"
        href="#ranksCarousel"
        role="button"
        data-bs-slide="prev"
      >
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
      </a>
      <a
        class="carousel-control-next"
        href="#ranksCarousel"
        role="button"
        data-bs-slide="next"
      >
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
      </a>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { mapGetters } from "vuex";

import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import timezone from "dayjs/plugin/timezone";
import { RankStatus } from "@/store/Auth/AuthInterfaces";
import { Rank } from "@/store/Ranks/RanksInterfaces";
dayjs.extend(timezone);
dayjs.extend(advancedFormat);

export default defineComponent({
  name: "ranks-card",
  props: {
    displayedRank: {
      type: String,
      default: "current"
    },
    cardTitle: {
      type: String,
      default: "Plan de Carrera"
    },
    userRanksCarrerData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      ranksData: new Map<string, Rank>(),
      displayedRankId: "INITIAL"
    };
  },
  methods: {
    isDisplayedRank(rankID: string) {
      return rankID == this.displayedRankId;
    },
    toTwoDecimals(num: number): string {
      return num.toLocaleString(undefined, {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2
      });
    },
    formatDateTimezone(milliseconds: number) {
      return dayjs(milliseconds).format("YYYY/MM/DD HH:mm:ss z");
    },
    isRank(rankID: string, status: string): boolean {
      if (this.ranksCarrerData instanceof Map) {
        const r: RankStatus = this.ranksCarrerData.get(rankID) as RankStatus;
        return (r || false) && r.status == status;
      } else {
        return false;
      }
    },
    isCurrentRank(rankID: string) {
      return this.isRank(rankID, "current");
    },
    isNextRank(rankID: string) {
      const r = this.isRank(rankID, "next");
      return r;
    },
    isRankLocked(rankID: string) {
      return this.isRank(rankID, "locked");
    },
    isRankUnlocked(rankID: string) {
      return this.isRank(rankID, "unlocked");
    },
    rankDate(rankID: string) {
      if (this.ranksCarrerData instanceof Map) {
        const _rankCarrerData: RankStatus = this.ranksCarrerData.get(
          rankID
        ) as RankStatus;
        return _rankCarrerData?.date;
      }
      return undefined;
    },
    setRanks() {
      this.ranksData = this.allRanks();
    },
    clearRanks() {
      this.ranksData = new Map<string, Rank>();
    }
  },
  computed: {
    ...mapGetters("ranks", ["rankById", "allRanks"]),
    // displayedRankId() {

    // },
    ranksCarrerData() {
      // this.clearRanks();
      // this.setRanks();
      const ranks = this.ranksData; //this.allRanks() as Map<string, Rank>;
      const ranksCarrerData = new Map<string, RankStatus>();
      const carrerData = this.userRanksCarrerData;
      let previousStatus = "";
      ranks.forEach((r, k) => {
        let c = carrerData[k];
        if (c == undefined) {
          c = {
            _id: k,
            progress: 0,
            status: previousStatus == "current" ? "next" : "locked",
            priority: 0
          };
        }
        const rankStatus: RankStatus = {
          _id: k,
          priority: r.priority,
          progress: c.progress,
          status: c.status,
          date: c.date ? c.date?.toDate() : undefined
        };
        ranksCarrerData.set(k, rankStatus);
        previousStatus = rankStatus.status;
      });
      return ranksCarrerData;
    },
    currentRank(): RankStatus | undefined {
      if (this.ranksCarrerData instanceof Map) {
        for (const rank of this.ranksCarrerData.values()) {
          if (rank.status === "current") {
            return rank;
          }
        }
      }
      return undefined;
    },
    nextRank(): RankStatus | undefined {
      if (this.ranksCarrerData instanceof Map) {
        for (const rank of this.ranksCarrerData.values()) {
          if (rank.status === "next") {
            return rank;
          }
        }
      }
      return undefined;
    }
  },
  mounted() {
    this.setRanks();
    let rankObj;
    switch (this.displayedRank.toLowerCase()) {
      case "next":
        rankObj = this.nextRank;
        break;
      case "current":
        rankObj = this.currentRank;
        break;
      default:
        rankObj = this.rankById(this.displayedRank);
    }
    rankObj = rankObj != undefined ? rankObj : this.currentRank;
    this.displayedRankId = rankObj ? rankObj._id : "INITIAL";
  }
});
</script>
<style lang="scss" scoped>
.rank-base {
  color: $secondary;
}
.rank-progress {
  color: $gray-200;
  overflow: hidden;
}
.rank-unlocked {
  font-size: 2rem;
  margin-top: 3.5rem;
  margin-left: 3rem;
}
.rank-unlocked:before {
  box-shadow: 0 0 1rem $black;
  background-color: $white;
  border-radius: 50%;
  padding: 1px;
}
.rank-date {
  font-size: 0.75rem !important;
}
</style>
