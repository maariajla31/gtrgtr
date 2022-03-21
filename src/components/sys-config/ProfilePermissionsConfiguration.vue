<template>
  <div class="row" v-if="addMode">
    <div class="col-sm-12 col-md-5 col-lg-3">
      <input
        type="text"
        placeholder="Perfil"
        class="form-control w-100"
        v-model="this.newProfile.profileId"
      />
    </div>
    <div class="col-sm-12 col-md-5 col-lg-3">
      <button @click="saveProfile()" class="btn btn-primary w-100">
        Guardar
        <i v-if="loading" class="fas fa-spinner fa-spin"></i>
      </button>
    </div>
    <div class="col-sm-12 col-md-5 col-lg-3">
      <button @click="cancel()" class="btn btn-secondary w-100">
        Cancelar
      </button>
    </div>
  </div>

  <div class="row" v-if="!addMode">
    <div class="col-sm-12 col-md-5 col-lg-3">
      <select
        class="form-control  w-100"
        v-model="currentProfile.profileId"
        @change="changeProfile(currentProfile.profileId)"
      >
        <template v-for="profile in profiles" :key="profile.profileId">
          <option :value="profile.profileId">{{ profile.profileId }}</option>
        </template>
      </select>
    </div>
    <div class="col-sm-12 col-md-5 col-lg-3">
      <button @click="updatePermissions()" class="btn btn-primary w-100">
        Actualizar
        <i v-if="loading" class="fas fa-spinner fa-spin"></i>
      </button>
    </div>

    <div class="col-sm-12 col-md-5 col-lg-3">
      <button @click="createProfile()" class="btn btn-secondary w-100">
        Crear nuevo perfil
      </button>
    </div>
  </div>

  <br class="m-5" />
  <div class="row">
    <div class="col-sm-12 col-md-5 col-lg-4">
      <div class="form-check" v-for="item in UserMenu" :key="item.Key">
        <input type="checkbox" class="form-check-input" :id="item.Key" />
        <label class="form-check-label" :for="item.Key">
          {{ item.Label }}
        </label>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { ProfilePermissions } from "@/store/System/SystemConfigInterfaces";
import { mapState } from "vuex";

export default defineComponent({
  name: "ProfilePermissionsConfiguration",
  computed: {
    ...mapState("sys", ["UserMenu"])
  },
  data() {
    return {
      addMode: false,
      loading: false,
      profiles: Array<ProfilePermissions>(),
      newProfile: {
        profileId: "",
        data: Array<string>() || undefined
      },
      currentProfile: { profileId: "", data: [""] }
    };
  },
  created() {
    this.$store
      .dispatch("sys/doGetAllProfiles")
      .then((response) => {
        this.profiles = response;
        this.currentProfile.profileId = response[0].profileId;
        this.changeProfile(this.currentProfile.profileId);
      })
      .catch((error) => {
        console.log(error);
      });
  },
  methods: {
    cleanList() {
      this.UserMenu.forEach((item: any) => {
        const element = document.getElementById(item.Key) as HTMLInputElement;
        element.checked = false;
      });
    },
    changeProfile(profileId: string) {
      this.currentProfile.data = [""];

      const data = this.profiles.find((x) => x.profileId == profileId)?.data;
      if (data != undefined) {
        this.currentProfile.data = data;
      }
      this.UserMenu.forEach((item: any) => {
        const element = document.getElementById(item.Key) as HTMLInputElement;
        element.checked = this.isChecked(item.Key);
      });
    },
    isChecked(key: string) {
      return this.currentProfile.data.includes(key);
    },
    updatePermissions() {
      this.loading = true;
      const checked = [...document.querySelectorAll("input:checked")].map(
        (e) => e.id
      );
      const backup = this.currentProfile;
      this.currentProfile.data = checked;

      this.$store
        .dispatch("sys/updateProfile", this.currentProfile)
        .then((response) => {
          const profile = this.profiles.find(
            (x) => x.profileId == this.currentProfile.profileId
          );
          if (profile != undefined) {
            profile.data = this.currentProfile.data;
          }
          alert(response.message);
        })
        .catch((error) => {
          this.currentProfile = backup;
          alert("Error: " + error.message);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    createProfile() {
      this.addMode = true;
      this.newProfile.profileId = "";
      this.newProfile.data = [];
      this.cleanList();
    },
    saveProfile() {
      this.loading = true;
      const checked = [...document.querySelectorAll("input:checked")].map(
        (e) => e.id
      );

      this.newProfile.data = checked;

      this.$store
        .dispatch("sys/addProfile", this.newProfile)
        .then((response) => {
          this.profiles.push({
            profileId: this.newProfile.profileId,
            data: this.newProfile.data
          });
          this.currentProfile.profileId = this.newProfile.profileId;

          this.loading = false;
          this.addMode = false;

          this.changeProfile(this.currentProfile.profileId);
          alert(response.message);
        })
        .catch((error) => {
          this.loading = false;
          alert("Error: " + error.message);
        });
    },
    cancel() {
      this.addMode = false;
      this.currentProfile.profileId = this.profiles[0].profileId;
      this.changeProfile(this.currentProfile.profileId);
    }
  }
});
</script>
