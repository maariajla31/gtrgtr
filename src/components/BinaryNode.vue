<template>
  <div class="col text-center px-0" v-if="node?.username != ''">
    <div
      class="col-6 offset-3 d-flex flex-column align-items-stretch justify-content-start my-3 px-1"
    >
      <div
        :class="
          'node border rounded text-truncate overflow-hidden ' +
            UserAcademyStatusClass +
            ' flex-column p-2'
        "
        @click="changeTreeRoot(node.username)"
      >
        <div class="node-profile-pic">
          <img
            :src="profilePic"
            :alt="node.nickname"
            class="img-fluid rounded-circle border border-1"
          />
        </div>
        <span
          :class="'distributor-status ' + UserDistributorStatusClass"
          :title="UserDistributorRemainingDays.toLocaleString() + ' días'"
        >
          <i class="fas fa-briefcase"></i>
        </span>
        <span
          :class="'user-status badge rounded-pill ' + UserAcademyStatusClass"
          :title="UserAcademyRemainingDays.toLocaleString() + ' días'"
        >
          {{ UserAcademyRemainingDays.toLocaleString() }}
        </span>

        <div
          class="node-data d-flex justify-content-center small text-nowrap overflow-hidden mb-1"
        >
          <div class="d-flex align-items-center me-1">
            <i :class="UserRank?.iconClass + ' fs-5 fa-fw'"></i>
          </div>
          <div class="">
            <div class=" fw-bold mb-0">
              {{ node.nickname }}
            </div>
            <div class="">{{ node.username }}</div>
          </div>
          <div class=" ms-1">
            <i :class="' fab fs-5 fa-fw'"></i>
          </div>
        </div>
      </div>
      <div class="node-detail">
        <div class="collapse" :id="'n_' + nodeId() + '_details'">
          <div
            class=" d-flex flex-column border border-top-0 border-bottom-0 py-1 px-2"
          >
            <div class="d-flex flex-row justify-content-center">
              <div class="d-flex flex-column fw-bold text-truncate">
                Puntos Pendientes
              </div>
            </div>
            <div class="d-none d-flex flex-row justify-content-around">
              <div class="d-flex flex-column">
                Izquiedo
              </div>
              <div class="d-flex flex-column">
                Derecho
              </div>
            </div>
            <div class="d-flex flex-row justify-content-stretch">
              <div class="d-flex flex-column col-6 border-end">
                {{ node.points.left.pending.toLocaleString() }}
              </div>
              <div class="d-flex flex-column col-6">
                {{ node.points.right.pending.toLocaleString() }}
              </div>
            </div>
            <div class="d-flex flex-row align-items-stretch">
              <div class="d-flex flex-column flex-fill">
                <div title="Patrocinador">
                  <i class="fas fa-user-circle fa-fw"></i> {{ node.enroller }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          class="details-handler collapsed d-flex flex-row justify-content-center border rounded-bottom py-1"
          data-bs-toggle="collapse"
          :data-bs-target="'#n_' + nodeId() + '_details'"
        >
          <div class="d-flex flex-column">
            <i class="fas fa-angle-double-down"></i>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="level < maxLevelsToDisplay"
      :class="[
        'binary-level-' + (level * 1 + 1),
        'd-flex row-nowrap mx-0',
        node.childLeft == null ? 'no-left-child' : '',
        node.childRight == null ? 'no-right-child' : ''
      ]"
    >
      <binary-node
        v-if="node.childLeft != null"
        :username="node.childLeft"
        :level="level * 1 + 1"
      ></binary-node>
      <div v-else class="col text-center">
        <div class="d-flex justify-content-center my-3 me-1">
          <div
            class="node empty-leaf border rounded text-truncate px-1 py-2 w-50"
          >
            <i class="far fa-user d-block mb-1"></i>
          </div>
        </div>
      </div>
      <binary-node
        v-if="node.childRight != null"
        :username="node.childRight"
        :level="level * 1 + 1"
      ></binary-node>
      <div v-else class="col text-center">
        <div class="d-flex justify-content-center my-3 ms-1">
          <div
            class="node empty-leaf border rounded text-truncate px-1 py-2 w-50"
          >
            <i class="far fa-user d-block mb-1"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { images } from "@/mixins/images";
import { Rank } from "@/store/Ranks/RanksInterfaces";
// import {
//   BinaryTreeNodeUser,
//   UserSubStatus
// } from "@/../store/src/Users/UsersInterfaces";
import {
  doGetUserTree,
  setRootUsername,
  GetUserTreeRequest
} from "@/store/UserNetwork/UserNetworkInterfaces";
import { defineComponent } from "vue";
import { mapGetters } from "vuex";

export default defineComponent({
  name: "binary-node",
  data() {
    return {
      maxLevelsToDisplay: 4,
      profilePic: "",
      random: Math.floor(Math.random() * 1000) + 1
    };
  },
  props: {
    username: { type: String, default: "" },
    level: { type: Number, default: 1 }
  },
  computed: {
    ...mapGetters("ranks", ["rankById"]),
    ...mapGetters("userNetwork", ["getTreeForUser"]),
    UserAcademyRemainingDays(): number {
      return this.SubscriptionRemainingDays("trading-academy");
    },
    UserAcademyStatusClass() {
      if (this.UserAcademyRemainingDays <= 0) return "user-inactive";
      else if (this.UserAcademyRemainingDays < 5) return "user-danger";
      else if (this.UserAcademyRemainingDays < 10) return "user-warning";
      else return "user-active";
    },
    UserDistributorRemainingDays(): number {
      return this.SubscriptionRemainingDays("distributor-license");
    },
    UserDistributorStatusClass() {
      if (this.UserDistributorRemainingDays <= 0) return "distributor-inactive";
      else if (this.UserDistributorRemainingDays < 10)
        return "distributor-danger";
      else if (this.UserDistributorRemainingDays < 20)
        return "distributor-warning";
      else return "distributor-active";
    },
    UserRank(): Rank {
      return this.rankById("");
    },
    // node():
    // BinaryTreeNodeUser {
    //   const n = this.getTreeForUser(this.username) as BinaryTreeNodeUser;
    //   this.updateProfilePicture(n.pictureUrl);
    //   return this.getTreeForUser(this.username) as BinaryTreeNodeUser;
    // }
  },
  methods: {
    SubscriptionRemainingDays(subscriptionId: string): number {
      if ("" != undefined) {
        const subs = "";
        // const academySubs = subs.find((s) => {
        //   return s.subscriptionId == subscriptionId;
        // });
        // if (
        //   academySubs == undefined ||
        //   academySubs.remainingDays == undefined ||
        //   academySubs.remainingDays <= 0
        // ) {
        //   return 0;
        // } else {
        //   return academySubs.remainingDays;
        // }
      }
      return 0;
    },
    changeTreeRoot(newUsername: string) {
      // if (
      //   this.node.loadedLevels < 4 &&
      //   this.username != null &&
      //   this.username != ""
      // ) {
      //   const req: GetUserTreeRequest = {
      //     username: this.username,
      //     levels: 4
      //   };
      //   // console.log("load tree for user:" + this.username);
      //   this.$store.dispatch("userNetwork/" + doGetUserTree, req);
      // }
      this.$store.dispatch("userNetwork/" + setRootUsername, newUsername);
    },
    updateProfilePicture(url: string) {
      this.getProfilePicture(url).then((response) => {
        this.profilePic = response;
      });
    },
    nodeId(): string {
      return "";
    }
    // }
  },
  setup() {
    const getProfilePicture = images.methods.getProfilePicture;
    return {
      getProfilePicture
    };
  }
});
</script>
<style lang="scss" scoped>
[class^="binary-level-"]::before,
[class^="binary-level-"]::after {
  content: "";
  height: 33px;
  border: solid 2px $gray-600;

  top: -16px;
  position: relative;
}
.binary-level-2::before {
  left: 28%;
}
.binary-level-3::before {
  left: 30%;
}
.binary-level-4::before {
  left: 35%;
}

.binary-level-2::after {
  right: 28%;
}
.binary-level-3::after {
  right: 30%;
}
.binary-level-4::after {
  right: 35%;
}

.binary-level-4.d-flex {
  display: none !important;
}

.node {
  background-color: $body-bg !important;
  line-height: 1rem;
  min-width: 80px;
  font-size: 0.75rem;
  > i {
    font-size: 2rem;
  }
}
.node:hover {
  cursor: pointer;
  z-index: 3;
}
.node.border.empty-leaf {
  border-style: dashed !important;
  color: $gray-500;
}
.no-left-child::before,
.no-right-child::after {
  border-width: 1px;
  border-style: dashed;
  border-color: $gray-300;
}

.node-profile-pic {
  max-width: 50px;
  margin: auto;
}
.user-status {
  position: relative;
  margin-left: auto;
  margin-right: auto;
  left: 15px;
  top: -10px;
  box-shadow: 0 0 0.18rem rgba(0, 0, 0, 0.75);
}
.user-status.user-active {
  background-color: $green;
}
.user-status.user-warning {
  background-color: $yellow;
}
.user-status.user-danger {
  background-color: $red;
}
.user-status.user-inactive {
  background-color: $gray-500;
}

.distributor-status {
  position: relative;
  margin-left: auto;
  margin-right: auto;
  left: -10px;
  top: -8px;
  font-size: 1rem;
}
.distributor-status.distributor-active {
  color: $cyan;
}
.distributor-status.distributor-warning {
  color: $yellow;
}
.distributor-status.distributor-danger {
  color: $red;
}
.distributor-status.distributor-inactive {
  display: none;
}

.node.user-inactive {
  color: $gray-500;
  img {
    filter: grayscale(1);
  }
}

.node-data {
  margin-top: -0.3rem;
}

.node-detail {
  height: 0px;
  z-index: 1;
  div:first-child {
    background-color: $white;
  }
  > div {
    width: 75%;
    min-width: 80px;
    max-width: 140px;
    margin: auto;
    position: relative;
    font-size: 0.75em;
  }
}
.details-handler:hover {
  cursor: pointer;
  background-color: $white;
}
div.details-handler {
  background-color: $gray-100;
}
div.details-handler.collapsed {
  border-top: 0 !important;
}
.details-handler.collapsed i {
  transition: 0.3s transform ease-in-out;
}
.details-handler:not(.collapsed) i {
  transform: rotate(180deg);
}

@include media-breakpoint-up(sm) {
  .binary-level-4.d-flex {
    display: flex !important;
  }
}
@include media-breakpoint-up(xl) {
  .node {
    min-width: 110px;
    font-size: 0.9rem;
    > i {
      font-size: 2rem;
    }
  }
}
</style>
