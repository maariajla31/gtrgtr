<template>
  <div class="card flex-fill">
    <h5 class="card-header d-flex flex-row justify-content-between">
      <div>
        <i class="fas fa-clipboard-list text-cyan me-2"></i>Plan de Carrera
      </div>
      <div class="btn-toolbar">
        <div class="input-group input-group-sm me-2 d-none">
          <input type="text" class="form-control" />
          <button class="btn btn-outline-secondary">
            <i class="fas fa-search"></i>
          </button>
        </div>
        <div class="btn-group btn-group-sm">
          <button
            class="btn btn-outline-secondary"
            @click="changeTeamLeader(leader.enroller)"
          >
            <i class="bi bi-chevron-up"></i>
          </button>
          <button class="btn btn-outline-secondary" @click="changeTeamLeader()">
            <i class="bi bi-chevron-double-up"></i>
          </button>
        </div>
      </div>
    </h5>
    <div class="card-body d-flex flex-column flex-md-row">
      <div class="text-center d-flex pe-4 justify-content-center">
        <div class="align-self-center">
          <div class="leader-image">
            <img
              :src="leaderPicture"
              :alt="leader.nickname"
              class="img-fluid rounded-circle border border-1 d-block"
            />
          </div>
          <div
            class="d-flex justify-content-center small text-nowrap overflow-hidden mt-1 mb-2"
          >
            <div class="lh-1">
              <div class="fw-bold mb-0">
                {{ leader.nickname }}
              </div>
              <div class="">{{ leader.username }}</div>
            </div>
          </div>
        </div>
      </div>
      <carrer-summary-table :user-data="leader"></carrer-summary-table>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import {
  setLeaderUsername,
  UnilevelMember
} from "@/store/Unilevel/UnilevelInterfaces";
import { CarrerSummaryTable } from "./";
import { images } from "@/mixins/images";

export default defineComponent({
  name: "carrer-summary-card",
  components: { CarrerSummaryTable },
  props: {
    leader: { required: true, type: Object as () => UnilevelMember }
  },
  data() {
    return {
      leaderPicture: ""
    };
  },
  methods: {
    changeTeamLeader(newLeaderUsername: string) {
      this.$store.dispatch("unilevel/" + setLeaderUsername, newLeaderUsername);
    }
  },
  created() {
    this.getProfilePicture(this.leader.pictureUrl).then((url) => {
      this.leaderPicture = url;
    });
  },
  setup() {
    const getProfilePicture = images.methods.getProfilePicture;
    return {
      getProfilePicture
    };
  },
  watch: {
    "leader.pictureUrl": function(newValue) {
      this.getProfilePicture(newValue).then((url) => {
        this.leaderPicture = url;
      });
    }
  }
});
</script>

<style lang="scss" scoped>
.bg-table-footer {
  background-color: $gray-200;
}
.leader-image {
  max-width: 100px;
  min-width: 100px;
  height: 100px;
  margin: auto;
  > img {
    height: 100%;
  }
}
</style>
