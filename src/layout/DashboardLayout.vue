<template>
  <div v-if="isLoading" class="loading">
    <i class="fas fa-spinner fa-spin fa-5x"></i>
  </div>
  <dashboard-sidebar></dashboard-sidebar>
  <div class="content-area">
    <dashboard-topbar v-bind:menuName="currentPage"></dashboard-topbar>
    <main class="container-fluid my-4">
      <router-view></router-view>
    </main>
  </div>
</template>
<script>
import DashboardTopbar from "../components/DashboardTopbar.vue";
import DashboardSidebar from "../components/DashboardSidebar.vue";
import { mapGetters } from "vuex";

export default {
  components: {
    DashboardSidebar,
    DashboardTopbar
  },
  computed: {
    ...mapGetters(["isLoading"])
  },
  data() {
    return {
      currentPage: ""
    };
  },
  created() {
    this.currentPage = this.$route.name;
  }
};
</script>
<style lang="scss" scoped>
@include media-breakpoint-up(md) {
  .content-area {
    margin-left: 250px;
  }
}
.content-area {
  position: relative;
  min-height: 200px;
}

.loading {
  display: block;
  visibility: visible;
  position: fixed;
  z-index: 999;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.836);
  text-align: center;
  padding-top: 20%;
  filter: alpha(opacity=75);
  opacity: 0.75;
  font-size: large;
  color: rgb(175, 24, 24);
  font-style: italic;
  font-weight: 400;
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-position: center;
}
</style>
