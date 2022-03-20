<template>
  <div class="container mb-4" v-if="loaded">
    <div class="row mb-2">
      <div
        class="col-12 col-lg-8 col-xxl-7 offset-xxl-1 d-flex align-items-stretch mb-2"
      >
        <carrer-summary-card :leader="leader"></carrer-summary-card>
      </div>
      <div class="col-12 col-lg-4 col-xxl-3 d-flex align-items-stretch mb-2">
        <ranks-card
          cardTitle="Rangos"
          displayedRank="next"
          :user-ranksCarrerData="UnilevelTeam.leader.ranksCarrerData"
          class="flex-fill"
        ></ranks-card>
      </div>
    </div>
    <div class="row">
      <div class="col-12 col-xxl-10 offset-xxl-1">
        <team :team="UnilevelTeam"></team>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import {
  initializeTeam,
  setLeaderUsername
} from "@/store/Unilevel/UnilevelInterfaces";
import { mapGetters } from "vuex";
import { defineComponent } from "vue";
import { RanksCard } from "../components";
import { CarrerSummaryCard, Team } from "../components/unilevel";
// import { UnilevelMember } from "functions/src/Unilevel/UnilevelInterfaces";

export default defineComponent({
  name: "unilevel",
  components: {
    RanksCard,
    CarrerSummaryCard,
    Team
  },
  data() {
    return {
      loaded: false,
      nextRank: {}
    };
  },
  computed: {
    ...mapGetters("unilevel", {
      UnilevelTeam: "getCurrentTeam"
    })
    // ,
    // leader(): UnilevelMember {
    //   const l: UnilevelMember = { ...this.UnilevelTeam.leader };
    //   return l;
    // }
  },
  methods: {
    async initializeTeam() {
      await this.$store.dispatch("unilevel/" + initializeTeam);
      this.loaded = true;
    },
    changeTeamLeader(newLeaderUsername: string) {
      //console.log(newLeaderUsername);
      if (newLeaderUsername != undefined)
        this.$store.dispatch(
          "unilevel/" + setLeaderUsername,
          newLeaderUsername
        );
    },
    setNextRank(rank: {}) {
      this.nextRank = rank;
    }
  },
  async created() {
    await this.initializeTeam();
  }
});
</script>
<style lang="scss" scoped>
.unilevel-top-card {
  > img {
    --width: 100%;
  }
}
.unilevel-top-avatar {
  margin-top: -65%;
}
</style>
