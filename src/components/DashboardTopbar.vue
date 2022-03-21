<template>
  <header class="main-header shadow">
    <nav class="navbar navbar-top navbar-dark shadow ps-3 pe-5 p-0">
      <div class="container-fluid">
        <div class="navbar-brand d-flex flex-row flex-grow-1">
          <i class="me-2" :class="icon"></i>
          {{ label }}
        </div>
        <notifications></notifications>
        <profile-menu></profile-menu>
      </div>
    </nav>
  </header>
</template>
<script lang="ts">
/* eslint-disable @typescript-eslint/no-unused-vars */
import { defineComponent } from "vue";
import ProfileMenu from "./ProfileMenu.vue";
import Notifications from "./Notifications.vue";
import { mapGetters } from "vuex";
import { MenuItem } from "@/store/System/SystemConfigInterfaces";

export default defineComponent({
  components: { ProfileMenu, Notifications },
  name: "dashboard-topbar",
  props: ["menuName"],
  data() {
    return {
      name: this.menuName,
      icon: "",
      label: ""
    };
  },
  computed: {
    ...mapGetters("sys", ["getUserMenuItemByRoute"])
  },
  mounted() {
    const menu: MenuItem = this.getUserMenuItemByRoute(this.name) as MenuItem;
    this.icon = menu.Icon;
    this.label = menu.Label;
  },
  watch: {
    $route(to, from) {
      this.name = this.$route.name;
      const menu: MenuItem = this.getUserMenuItemByRoute(this.name) as MenuItem;
      this.icon = menu?.Icon;
      this.label = menu?.Label;
    }
  }
});
</script>
<style lang="scss" scoped>
.navbar {
  //linear-gradient(0deg,#ba54f5,)
  background-image: linear-gradient(
    to top right,
    #344675,
    #263148,
    #263148,
    #344675,
    #e14eca
  );
}

.navbar-brand {
  line-height: 2rem;
  > i:before {
    line-height: 2rem;
  }
}
</style>
