<template>
  <div class="d-flex flex-column">
    <div class="card">
      <div class="ratio ratio-16x9 loading-background">
        <img :src="coverImage" class="card-img-top" alt="Cover image" />
      </div>
      <div class="card-body">
        <div class="mb-2">
          <div
            class="avatar ratio ratio-1x1 w-50 mx-auto text-center align-items-center"
          >
            <div class="profile-picture">
              <img
                class="rounded-circle border border-3 border-light w-100"
                :src="userPicture"
              />
            </div>
            <div
              v-if="canEdit"
              @click="openGalleryModal()"
              class="change-picture-overlay d-flex justify-content-center align-items-center w-100 rounded-circle border-3 border-light bg-dark p-4 text-light border border-3 border-light w-100"
            >
              <div class="">
                <div class="mb-1">
                  <i class="fas fa-camera fa-2x fa-fw"></i>
                </div>
                <div class="lh-1 fs-4 d-xl-none">
                  Cambiar foto de perfil
                </div>
                <div class="lh-1 d-none d-xl-flex">
                  Cambiar foto de perfil
                </div>
              </div>
            </div>
          </div>
          <!-- /avatar -->
        </div>
        <div class="row pb-2 text-center">
          <div>
            <div
              v-if="editMode"
              class="col-12 d-flex flex-column justify-content-center align-items-center mb-2"
            >
              <div class="form-floating">
                <input
                  type="text"
                  class="form-control fs-3 text-center text-dark"
                  placeholder="Nickname"
                  id="nickname"
                  ref="nickname"
                  v-model="localNickname"
                />
                <label for="nickname">Apodo / Nickname</label>
              </div>
              <div class="my-2 d-flex justify-content-between">
                <button
                  :disabled="saving"
                  @click="cancelEdit()"
                  class="btn btn-sm btn-outline-danger me-2"
                >
                  <i class="fas fa-ban fa-fw me-1"></i>Cancelar
                </button>
                <button
                  :disabled="saving"
                  class="btn btn-sm btn-outline-success"
                  @click="save()"
                >
                  <i class="fas fa-save fa-fw me-1"></i>Guardar
                  <i v-if="saving" class="fas fa-spinner fa-spin ms-1"></i>
                </button>
              </div>
            </div>
            <div
              v-else
              class="col-12 d-flex justify-content-center align-items-end mb-2"
            >
              <i v-if="canEdit" class="fas fa-fw fa-xs"></i>
              <h2 class="mb-0 text-dark text-break">{{ user.nickname }}</h2>
              <button v-if="canEdit" @click="editNickname()" class="btn p-0">
                <i class="fas fa-pen fa-fw fa-xs text-muted mb-1"></i>
              </button>
            </div>
          </div>
          <div class="col-12 mb-0">
            <h5 class="text-secondary mb-0">
              <i :class="userRank?.iconClass + ' fa-fw'"></i>
              {{ userRank?.name }}
            </h5>
          </div>
          <div v-if="location != ''" class="col-12 text-muted small">
            <i class="fas fa-map-marker-alt fa-fw"></i>
            {{ location }}
          </div>
          <div
            v-if="
              user.country && user.country != '' && displayedCountry.alpha2Code
            "
            class="col-12 d-flex flex-row justify-content-center align-items-center text-muted small text-truncate"
          >
            <span class="flag-box lh-1">
              <span
                :class="'lh-1 d-block flag ' + displayedCountry.alpha2Code"
              ></span>
            </span>
            <span class="lh-1 country-name fw-bold ms-2">
              {{ displayedCountry.spanish }}
            </span>
          </div>
        </div>
        <div class="row pt-4 pb-2">
          <div class="col text-nowrap d-flex">
            <div class="mx-auto text-truncate">
              <div class="text-truncate">
                <span class="small">
                  <i class="fas fa-user fa-fw"></i>
                  Usuario:
                </span>
                <span class="fw-bold">{{ user.username }}</span>
              </div>
              <div
                v-if="
                  user.contact.email &&
                    user.contact.email.data != '' &&
                    user.contact.email.visible
                "
                class="text-truncate"
              >
                <span class="small">
                  <i class="fas fa-envelope fa-fw"></i>
                  E-mail:
                </span>
                <span class="fw-bold">{{ user.contact.email.data }}</span>
              </div>

              <div
                v-if="
                  user.contact.mobile &&
                    user.contact.mobile.data.number != '' &&
                    user.contact.mobile.visible
                "
                class="text-truncate"
              >
                <span class="small">
                  <i class="fas fa-mobile-alt fa-fw"></i>
                  Celular:
                </span>
                <span class="fw-bold">
                  <span
                    v-if="user.contact.mobile.data.dialCode != ''"
                    class="me-1"
                  >
                    {{ user.contact.mobile.data.dialCode }}
                  </span>
                  <span>
                    {{ user.contact.mobile.data.number }}
                  </span>
                </span>
              </div>
              <div
                v-if="
                  user.contact.whatsapp &&
                    user.contact.whatsapp.data.number != '' &&
                    user.contact.whatsapp.visible
                "
                class="text-truncate"
              >
                <span class="small">
                  <i class="fab fa-whatsapp fa-fw"></i>
                  Whatsapp:
                </span>
                <span class="fw-bold">
                  <span
                    v-if="user.contact.whatsapp.data.dialCode != ''"
                    class="me-1"
                  >
                    {{ user.contact.whatsapp.data.dialCode }}
                  </span>
                  <span>
                    {{ user.contact.whatsapp.data.number }}
                  </span>
                </span>
              </div>
              <div
                v-if="
                  user.contact.telegram &&
                    user.contact.telegram.data.number != '' &&
                    user.contact.telegram.visible
                "
                class="text-truncate"
              >
                <span class="small">
                  <i class="fab fa-telegram fa-fw"></i>
                  Telegram:
                </span>
                <span class="fw-bold">
                  <span
                    v-if="user.contact.telegram.data.dialCode != ''"
                    class="me-1"
                  >
                    {{ user.contact.telegram.data.dialCode }}
                  </span>
                  <span>
                    {{ user.contact.telegram.data.number }}
                  </span>
                </span>
              </div>
              <div
                v-if="
                  user.contact.instagram &&
                    user.contact.instagram.data != '' &&
                    user.contact.instagram.visible
                "
                class="text-truncate"
              >
                <span class="small">
                  <i class="fab fa-instagram fa-fw"></i>
                  Instagram:
                </span>
                <a
                  class="fw-bold link-secondary"
                  :href="
                    'https://www.instagram.com/' + user.contact.instagram.data
                  "
                  target="_blank"
                  >{{ user.contact.instagram.data }}
                  <i class="fas fa-external-link-alt fa-xs fa-fw"></i>
                </a>
              </div>
              <div
                v-if="
                  user.contact.tiktok &&
                    user.contact.tiktok.data != '' &&
                    user.contact.tiktok.visible
                "
                class="text-truncate"
              >
                <span class="small">
                  <i class="fab fa-tiktok fa-fw"></i>
                  Tiktok:
                </span>
                <a
                  class="fw-bold link-secondary"
                  :href="'https://www.tiktok.com/' + tiktokUsername"
                  target="_blank"
                  >{{ tiktokUsername }}
                  <i class="fas fa-external-link-alt fa-xs fa-fw"></i>
                </a>
              </div>
              <div
                v-if="
                  user.contact.facebook &&
                    user.contact.facebook.data != '' &&
                    user.contact.facebook.visible
                "
                class="text-truncate"
              >
                <span class="small">
                  <i class="fab fa-facebook fa-fw"></i>
                  Facebook:
                </span>
                <a
                  class="fw-bold link-secondary"
                  :href="
                    'https://www.facebook.com/' + user.contact.facebook.data
                  "
                  target="_blank"
                >
                  {{ user.contact.facebook.data }}
                  <i class="fas fa-external-link-alt fa-xs fa-fw"></i>
                </a>
              </div>
              <div class="text-truncate">
                <span class="small">
                  <i class="fas fa-handshake fa-fw"></i>
                  Patrocinador:
                </span>
                <span>
                  <strong>{{ user.enroller }}</strong>
                </span>
              </div>
              <div class="text-truncate" v-if="user.metadata">
                <span class="small">
                  <i class="fas fa-flag-checkered fa-fw"></i>
                  Registro:
                </span>
                <span class="fw-bold text-nowrap small">
                  {{
                    formatDateTimezone(user.metadata?.creationTime.getTime())
                  }}
                </span>
              </div>
              <div class="text-truncate" v-if="user.metadata">
                <span class="small">
                  <i class="fas fa-sign-in-alt fa-fw"></i>
                  Última sesión:
                </span>
                <span class="fw-bold small">
                  {{
                    formatDateTimezone(user.metadata?.lastSignInTime.getTime())
                  }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { images } from "@/mixins/images";
import { mapGetters } from "vuex";
import firebase from "firebase/app";
import "firebase/auth";
import * as bs from "bootstrap";

import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import timezone from "dayjs/plugin/timezone";
import { UserProfileCardData } from "@/store/Profile/ProfileInterfaces";
import { Rank } from "@/store/Ranks/RanksInterfaces";
import { Country } from "@/store/System/SystemConfigInterfaces";
dayjs.extend(timezone);
dayjs.extend(advancedFormat);

export default defineComponent({
  name: "profile-card",
  props: {
    user: {
      type: Object as () => UserProfileCardData,
      required: true
    }
  },
  data() {
    return {
      userPicture: "",
      coverImage: "",
      displayedCountry: {} as Country,
      editMode: false,
      localNickname: "",
      galleryModal: {} as any,
      saving: false
    };
  },
  computed: {
    //...mapGetters("auth", ["getUsernamePK", "getUserPicture"]),
    ...mapGetters("ranks", ["rankById"]),
    ...mapGetters("sys", ["getCountryByAlpha3Code"]),
    userRank(): Rank {
      return this.rankById(this.user.currentRank);
    },
    location() {
      let l = "";
      if (
        this.user.city &&
        this.user.state &&
        this.user.city != "" &&
        this.user.state != ""
      ) {
        l = this.user.city + ", " + this.user.state;
      } else if (this.user.city && this.user.city != "") {
        l = this.user.city;
      } else if (this.user.state && this.user.state != "") {
        l = this.user.state;
      }
      return l;
    },
    tiktokUsername(): string {
      return this.user.contact.tiktok?.data.startsWith("@")
        ? this.user.contact.tiktok.data
        : "@" + this.user.contact.tiktok?.data;
    },
    canEdit(): boolean {
      // if ()
      return (
        firebase.auth().currentUser?.email?.toString() ===
          this.user.contact.email?.data.toString() &&
        firebase.auth().currentUser?.displayName?.toString() ===
          this.user.username.toString()
      );
    }
  },
  methods: {
    formatDateTimezone(milliseconds: number): string {
      return dayjs(milliseconds).format("YYYY/MM/DD HH:mm:ss z");
    },
    setDisplayedCountry() {
      this.displayedCountry = {
        ...this.getCountryByAlpha3Code(this.user.country)
      };
    },
    editNickname() {
      this.editMode = true;
      this.$nextTick(() => {
        (this.$refs.nickname as HTMLInputElement).select();
      });
    },
    save() {
      if (this.localNickname != this.user.nickname) {
        this.saving = true;
        this.$store
          .dispatch("profile/doUpdateNickname", this.localNickname.trim())
          .then(() => {
            this.editMode = false;
          })
          .catch((error) => {
            alert(error);
          })
          .finally(() => {
            this.saving = false;
          });
      } else {
        this.editMode = false;
      }
    },
    cancelEdit() {
      this.editMode = false;
      this.localNickname = this.user.nickname;
    },
    openGalleryModal() {
      this.galleryModal.show();
    }
  },
  mounted() {
    const coverImage =
      this.user.coverPictureUrl && this.user.coverPictureUrl != ""
        ? this.user.coverPictureUrl
        : "img/backgrounds/triangles-3d-1.png";
    this.getImage(coverImage).then((r) => {
      this.coverImage = r;
    });

    if (this.user.pictureUrl && this.user.pictureUrl != "") {
      if (!this.user.pictureUrl?.startsWith("http")) {
        this.getProfilePicture(this.user.pictureUrl).then((r) => {
          this.userPicture = r;
        });
      } else {
        this.userPicture = this.user.pictureUrl;
      }
    }
    this.localNickname = this.user.nickname;
    this.setDisplayedCountry();
    // if (this.canEdit) {
    this.galleryModal = bs.Modal.getOrCreateInstance(
      document.getElementById("profile-picture-gallery-modal")
    );
    // }
  },
  watch: {
    "user.pictureUrl": function(newValue: string) {
      if (newValue != "") {
        if (!newValue?.startsWith("http")) {
          this.getProfilePicture(newValue).then((r) => {
            this.userPicture = r;
          });
        } else {
          this.userPicture = newValue;
        }
      }
    },
    "user.coverPictureUrl": function(newValue: string) {
      const coverImage =
        this.user.coverPictureUrl && this.user.coverPictureUrl != ""
          ? newValue
          : "img/backgrounds/triangles-3d-1.png";
      this.getImage(coverImage).then((r) => {
        this.coverImage = r;
      });
    },
    "user.country": function() {
      this.setDisplayedCountry();
    },
    "user.nickname": function(newValue: string) {
      if (newValue != "") {
        this.localNickname = newValue;
      }
    }
  },
  setup() {
    const getImage = images.methods.getImage;
    const getProfilePicture = images.methods.getProfilePicture;
    return {
      getImage,
      getProfilePicture
    };
  }
});
</script>

<style lang="scss" scoped>
.avatar {
  margin-top: -30%;
}

.change-picture-overlay {
  opacity: 0;
  transition: 0.5s;
  &:hover {
    opacity: 0.75;
    cursor: pointer;
  }
}
</style>
