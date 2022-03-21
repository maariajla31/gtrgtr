<template>
  <div class="row">
    <div class="col-sm-12 col-md-5 col-lg-3">
      <select
        class="form-control  w-100"
        v-model="currentUser.userPK"
        @change="changeUser(currentUser.userPK)"
      >
        <template v-for="user in Users" :key="user.userPK">
          <option :value="user.userPK">{{ user.userPK }}</option>
        </template>
      </select>
    </div>
    <div class="col-sm-12 col-md-5 col-lg-3">
      <button @click="updatePermissions()" class="btn btn-primary w-100">
        Actualizar
        <i v-if="loading" class="fas fa-spinner fa-spin"></i>
      </button>
    </div>
  </div>
  <br class="m-5" />
  <div class="row">
    <div class="col-sm-12 col-md-5 col-lg-4">
      <div class="form-check" v-for="item in Profiles" :key="item.profileId">
        <input type="checkbox" class="form-check-input" :id="item.profileId" />
        <label class="form-check-label" :for="item.profileId">
          {{ item.profileId }}
        </label>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { ProfilePermissions } from "@/store/System/SystemConfigInterfaces";

export default defineComponent({
  name: "UserProfilesConfiguration",
  data() {
    return {
      loading: false,
      Profiles: Array<ProfilePermissions>(),
      Users: [{ userPK: "", roles: [""] }],
      currentUser: { userPK: "", roles: [""] }
    };
  },
  created() {
    this.$store
      .dispatch("sys/doGetAllProfiles")
      .then((response) => {
        this.Profiles = response;
      })
      .catch((error) => {
        console.log(error);
      });

    this.$store
      .dispatch("sys/doGetAllUsers")
      .then((response) => {
        this.Users = response;
        this.currentUser.userPK = response[0].userPK;
        this.changeUser(this.currentUser.userPK);
      })
      .catch((error) => {
        console.log(error);
      });
  },
  methods: {
    isChecked(key: string) {
      return this.currentUser.roles.includes(key);
    },
    changeUser(userPK: string) {
      this.currentUser.roles = [""];

      const data = this.Users.find((x) => x.userPK == userPK)?.roles;
      if (data != undefined) {
        this.currentUser.roles = data;
      }

      this.Profiles.forEach((item: any) => {
        const element = document.getElementById(
          item.profileId
        ) as HTMLInputElement;
        element.checked = this.isChecked(item.profileId);
      });
    },
    updatePermissions() {
      this.loading = true;
      const checked = [...document.querySelectorAll("input:checked")].map(
        (e) => e.id
      );
      this.currentUser.roles = checked;

      this.$store
        .dispatch("sys/updateUserProfiles", this.currentUser)
        .then((response) => {
          const user = this.Users.find(
            (x) => x.userPK == this.currentUser.userPK
          );
          if (user != undefined) {
            user.roles = this.currentUser.roles;
          }
          alert(response.message);
        })
        .catch((error) => {
          alert("Error: " + error.message);
        })
        .finally(() => {
          this.loading = false;
        });
    }
  }
});
</script>
