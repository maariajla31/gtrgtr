<template>
  <div class="tabs-container">
    <ul class="nav nav-tabs ps-5">
      <li class="nav-item">
        <router-link
          :to="'trading-academy?w=' + randomQuery()"
          class="nav-link"
        >
          <i class="fas fa-chalkboard-teacher "></i>
          Academia Virtual
        </router-link>
      </li>
      <li class="nav-item" v-if="isActive">
        <router-link :to="'gtr-system?w=' + randomQuery()" class="nav-link">
          <i class="fas fa-brain "></i>
          Sistema GTR Academy
        </router-link>
      </li>
      <li class="nav-item">
        <router-link to="distributor-license" class="nav-link">
          <i class="bi bi-briefcase-fill"></i>
          Distribuidor
        </router-link>
      </li>
    </ul>
    <div class="container subscription-container">
      <router-view></router-view>
    </div>
  </div>
</template>

<script lang="ts">
// import { UserSubscription } from "functions/src/Users/UsersInterfaces";
import { defineComponent } from "vue";
import { mapGetters } from "vuex";

export default defineComponent({
  name: "Subscriptions",
  // computed: {
  //   ...mapGetters("subs", ["getUserSubscription"]),
  //   UserStatus(): UserSubscription {
  //     return this.getUserSubscription("trading-academy");
  //   },
  //   isActive(): boolean {
  //     const status =
  //       this.UserStatus.endDate != undefined &&
  //       this.UserStatus.startDate != undefined &&
  //       this.UserStatus.endDate > new Date();
  //     this.$emit("isActive", status);
  //     return status;
  //   }
  // },
  methods: {
    randomQuery(): string {
      return Math.floor(Math.random() * 1000).toString();
    }
  },
  created() {
    this.$store.dispatch("subs/doGetUserSubscriptions").catch((error) => {
      alert(error);
    });
    this.$store.dispatch("subs/doGetSubscriptionsConfig").catch((error) => {
      alert(error);
    });
  }
});
</script>
<style lang="scss" scoped>
.tabs-container {
  margin-left: -($spacer * 1.5) !important;
  margin-right: -($spacer * 1.5) !important;
}
.subscription-container {
  margin-top: $spacer;
  padding-left: ($spacer * 1.5) !important;
  padding-right: ($spacer * 1.5) !important;
}
</style>
