<template>
  <ul class="navbar-nav">
    <li class="nav-item dropdown">
      <div
        class="nav-link dropdown-toggle d-flex align-items-center"
        data-bs-toggle="dropdown"
        href="#"
        role="button"
        aria-expanded="false"
      >
        <div class="me-2" style="max-width: 36px">
          <img
            class="avatar-shadow rounded-circle img-fluid border border-1 border-secondary"
            alt="Profile picture"
            :src="getUserPicture"
          />
        </div>
        <div>{{ getUserNickname }}</div>
      </div>
      <ul class="dropdown-menu dropdown-menu-end">
        <li v-if="canAccess('profile')">
          <router-link to="/profile">
            <a href="#" class="dropdown-item">
              <i class="bi bi-person text-blue me-2"></i>
              <span class="nav-link-text">Mi Perfil</span>
            </a>
          </router-link>
        </li>
        <li>
          <a @click="logout()" class="dropdown-item">
            <i class="bi bi-power text-red me-2"></i>
            <span class="nav-link-text">Salir</span>
          </a>
        </li>
      </ul>
    </li>
  </ul>
</template>
<script lang="ts">
import router from "@/router";
import { defineComponent } from "vue";
import { mapGetters } from "vuex";

export default defineComponent({
  name: "profile-menu",
  computed: {
    ...mapGetters("auth", ["getUserNickname"]),
    ...mapGetters("auth", ["getUserPicture"]),
    ...mapGetters("auth", ["getUsernamePK"]),
    ...mapGetters("auth", ["getUserPermissions"])
  },
  methods: {
    logout() {
      this.$store.dispatch("auth/logout");
      router.push({ name: "login" });
    },
    canAccess(screenKey: string) {
      return (
        (this.getUserPermissions.includes &&
          this.getUserPermissions.includes(screenKey)) ||
        false
      );
    }
  }
});
</script>
<style lang="scss" scoped>
.navbar .dropdown-menu {
  position: absolute;
}
.avatar-shadow {
  box-shadow: 0 0 0.6rem $black;
}
.dropdown-menu {
  li > a > i:before {
    line-height: 1.5rem;
    vertical-align: top;
  }
  li > a:hover > i {
    color: unset !important;
  }
}
</style>
