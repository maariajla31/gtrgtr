<template>
  <div class="row" v-if="localUserProfileData">
    <div class="col-12 col-xl-4 order-lg-last">
      <div class="mb-3">
        <profile-card v-if="userCardData" :user="userCardData"> </profile-card>
      </div>
      <div class="col-12 mb-3 text-center">
        <button
          @click="showChangePasswordModal()"
          type="button"
          class="btn btn-secondary"
        >
          <i class="fas fa-key me-2"></i>Cambiar Contraseña
        </button>
      </div>
      <div class="col-12 mb-3 text-center">
        <button
          @click="showChangeProfilePicModal()"
          type="button"
          class="btn btn-secondary"
        >
          <i class="fas fa-camera me-2"></i>Cambiar Foto de Perfil
        </button>
      </div>
    </div>
    <div class="col-12 col-xl-8 mb-3 mb-xl-0">
      <div class="mb-3">
        <personal-info
          :personalInfo="localUserProfileData.personal"
        ></personal-info>
      </div>
      <div class="mb-3">
        <btc-wallet
          :financialInfo="localUserProfileData.financial"
          :updated="updated"
          :error="error"
          @save-secured-data="saveSecuredData"
        >
        </btc-wallet>
      </div>
      <div class="mb-3">
        <contact
          :contactInfo="localUserProfileData?.contact"
          :registration-date="localUserProfileData?.metadata?.creationTime"
          :updated="updated"
          :error="error"
          @save-secured-data="saveSecuredData"
          @error="showError"
        ></contact>
      </div>
      <div class="mb-3">
        <profile-address
          :addressInfo="localUserProfileData?.address"
        ></profile-address>
      </div>
    </div>
    <change-password-modal
      @error="showError"
      @password-changed="showInformation"
    >
    </change-password-modal>
    <code-confirmation-modal
      :requestTag="securedDataRequest.requestTag || ''"
      :errorMessage="errorMessage"
      :updated="updated"
      @process-secured-data="processSecuredData"
    ></code-confirmation-modal>
    <information-modal
      :title="informationTitle"
      :message="informationMessage"
    ></information-modal>
    <error-modal :title="errorTitle" :message="errorMessage"></error-modal>
    <profile-picture-gallery-modal></profile-picture-gallery-modal>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapActions, mapGetters } from "vuex";
import * as bs from "bootstrap";
import {
  btcWallet,
  codeConfirmationModal,
  contact,
  profileAddress,
  profileCard,
  personalInfo,
  profilePictureGalleryModal
} from "@/components/profile";
import {
  UserProfileData,
  UserProfileCardData,
  SecuredDataRequest,
  requestSecuredDataUpdate,
  getUserProfileDetail,
  doGetUserProfileData,
  ProcessSecuredDataRequest,
  processSecuredDataUpdate,
  doGetUserBasicProfileData
} from "@/store/Profile/ProfileInterfaces";
import { generateDateKey } from "@/mixins/tools";
import { informationModal, errorModal } from "@/components/modals";
import ChangePasswordModal from "@/components/profile/ChangePassword.vue";

export default defineComponent({
  name: "Profile",
  components: {
    profileAddress,
    btcWallet,
    contact,
    profileCard,
    personalInfo,
    codeConfirmationModal,
    errorModal,
    informationModal,
    ChangePasswordModal,
    profilePictureGalleryModal
  },
  data: () => ({
    userCard: {} as UserProfileData,
    localUserProfileData: {} as UserProfileData,
    codeConfirmationModal: {} as any,
    informationModal: {} as any,
    changePasswordModal: {} as any,
    changeProfilePicModal: {} as any,
    errorModal: {} as any,
    securedDataRequest: {} as SecuredDataRequest,
    updated: false,
    error: false,
    errorTitle: "",
    errorMessage: "",
    informationTitle: "",
    informationMessage: ""
  }),
  methods: {
    ...mapActions("profile", [
      doGetUserProfileData,
      requestSecuredDataUpdate,
      processSecuredDataUpdate,
      doGetUserBasicProfileData
    ]),
    pretty(obj: any) {
      return JSON.stringify(obj, null, 2);
    },
    saveSecuredData(request: any) {
      this.error = false;
      // this.securedDataRequest = this.createSecureDataRequest(request);
      this.requestSecuredDataUpdate(this.securedDataRequest)
        .then(() => {
          this.errorMessage = "";
          this.updated = false;
          this.codeConfirmationModal.show();
        })
        .catch((error: any) => {
          alert(error);
          console.log(error);
          this.error = true;
        });
    },
    createSecureDataRequest(request: SecuredDataRequest) {
      return {
        data: request.data,
        type: request.type,
        requestId: generateDateKey()//,
        // requestTag: generateShortGUID()
      };
    },
    processSecuredData(request: ProcessSecuredDataRequest) {
      this.errorMessage = "";
      this.updated = false;

      this.processSecuredDataUpdate(request)
        .then(() => {
          this.codeConfirmationModal.hide();
          this.informationTitle = "Información Actualizada";
          this.informationMessage =
            "Se han actualizado los datos correctamente!";
          this.informationModal.show();
          this.updated = true;
          this.errorMessage = "";
          this.securedDataRequest = {} as SecuredDataRequest;
          this.doGetUserProfileData().then(() => {
            this.localUserProfileData = this.user;
            this.userCard = this.user;
          });
        })
        .catch((error: any) => {
          if (error.name && error.name != "") {
            if (error.name == "INVALID_CODE") {
              this.errorMessage = error.message;
            } else {
              this.codeConfirmationModal.hide();
              this.showError(error);
              this.error = true;
            }
          } else {
            this.codeConfirmationModal.hide();
            this.showError(error);
            this.error = true;
          }
        });
    },
    showInformation(title: string, message: string) {
      this.informationTitle = title;
      this.informationMessage = message;
      this.informationModal.show();
    },
    showError(error: Error) {
      this.errorTitle = "Error";
      this.errorMessage = error.message;
      this.errorModal.show();
      console.log(error);
    },
    showChangePasswordModal() {
      this.changePasswordModal.show();
    },
    showChangeProfilePicModal() {
      this.changeProfilePicModal.show();
    }
  },
  computed: {
    ...mapGetters("auth", ["getUsernamePK"]),
    ...mapGetters("profile", {
      user: getUserProfileDetail
    }),
    userCardData(): UserProfileCardData | undefined {
      if (this.userCard) {
        const r: UserProfileCardData = {
          currentRank: this.userCard.currentRank,
          enroller: this.localUserProfileData.enroller,
          nickname: this.localUserProfileData.nickname,
          pictureUrl: this.localUserProfileData.pictureUrl,
          coverPictureUrl: this.localUserProfileData.coverPictureUrl,
          username: this.localUserProfileData.username,
          city: this.localUserProfileData.address?.city || undefined,
          state: this.localUserProfileData.address?.state || undefined,
          country: this.localUserProfileData.address?.country || undefined,
          contact: {
            email: this.localUserProfileData.contact?.email,
            mobile: this.localUserProfileData.contact?.mobile
              ? this.localUserProfileData.contact?.mobile
              : undefined,
            telegram: this.localUserProfileData.contact?.telegram
              ? this.localUserProfileData.contact?.telegram
              : undefined,
            whatsapp: this.localUserProfileData.contact?.whatsapp
              ? this.localUserProfileData.contact?.whatsapp
              : undefined,
            facebook: this.localUserProfileData.contact?.facebook
              ? this.localUserProfileData.contact?.facebook
              : undefined,
            instagram: this.localUserProfileData.contact?.instagram
              ? this.localUserProfileData.contact?.instagram
              : undefined,
            tiktok: this.localUserProfileData.contact?.tiktok
              ? this.localUserProfileData.contact?.tiktok
              : undefined
          },
          metadata: this.localUserProfileData.metadata
        };
        return r;
      } else {
        return undefined;
      }
    }
  },
  async mounted() {
    await this.doGetUserProfileData();
    this.localUserProfileData = this.user;
    this.userCard = this.user;
    this.codeConfirmationModal = new bs.Modal(
      document.getElementById("code-confirmation-modal")
    );
    this.informationModal = new bs.Modal(
      document.getElementById("information-modal")
    );
    this.errorModal = new bs.Modal(document.getElementById("error-modal"));
    this.changePasswordModal = bs.Modal.getOrCreateInstance(
      document.getElementById("change-password-modal")
    );
    this.changeProfilePicModal = bs.Modal.getOrCreateInstance(
      document.getElementById("profile-picture-gallery-modal")
    );
  },
  watch: {
    "user.nickname": {
      handler(newValue: string, oldValue: string) {
        if (newValue != oldValue) {
          this.userCard.nickname = newValue;
        }
      }
    },
    "user.pictureUrl": {
      handler(newValue: string, oldValue: string) {
        if (newValue != oldValue) {
          this.userCard.pictureUrl = newValue;
        }
      }
    }
  }
});
</script>
