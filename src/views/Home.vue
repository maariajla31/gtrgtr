<template>
  <div
    class="row row-cols-1 row-cols-sm-2 row-cols-xl-3 g-4 d-none d-lg-flex justify-content-center"
  >
    <commissions-summary :summary="summary"></commissions-summary>
  </div>
  <div class="row mt-4">
    <div
      class="col-12 col-lg-12 col-xl-6 order-1 order-lg-3 d-flex flex-row mb-4 mb-xl-0"
    >
      <videos-carousel></videos-carousel>
    </div>
    <!-- <div
      class="col-12 col-xl-6 order-2 order-lg-1 d-flex flex-row mb-4 mb-xl-0"
    >
      <wide-notice-carousel></wide-notice-carousel> -->
    <div
      class="col-12 col-lg-6 col-xl-3 order-2 order-lg-1 d-flex flex-row mb-4 mb-xl-0"
    >
      <image-card
        img-src="img/tabla_firmas.jpg"
        top-image
        from-bucket
      ></image-card>
    </div>
    <div
      class="col-12 col-lg-6 col-xl-3 order-3 order-lg-1 d-flex flex-row mb-4 mb-xl-0"
    >
      <image-card
        img-src="img/firmas_ganadores.jpg"
        top-image
        from-bucket
      ></image-card>
    </div>
  </div>
  <div
    class="row row-cols-1 row-cols-sm-2 row-cols-xl-3 g-4 d-lg-none justify-content-center"
  >
    <commissions-summary :summary="summary"></commissions-summary>
  </div>
  <div class="row mt-4">
    <div class="col-12 col-md-6 col-xl-4 mb-4">
      <account-summary></account-summary>
    </div>
    <div class="col-12 col-md-6 col-xl-4 mb-4">
      <div class="mb-4 d-none">
        <ul class="list-group">
          <li
            class="list-group-item d-flex justify-content-between align-items-center"
          >
            <div>
              <i class="fas fa-user-graduate text-indigo me-2"></i>
              Academia
            </div>
            <span class="badge bg-danger rounded-pill">7</span>
          </li>
          <li
            class="list-group-item d-flex justify-content-between align-items-center"
          >
            <div>
              <i class="bi bi-briefcase-fill text-info me-2"></i>
              Licencia de Distribuidor
            </div>
            <span class="badge bg-info rounded-pill">233</span>
          </li>
          <li
            class="list-group-item d-flex justify-content-between align-items-center"
          >
            <div>
              <i class="bi bi-diagram-3 text-orange me-2"></i>
              Afiliados Directos
            </div>
            <span class="badge bg-success rounded-pill">27</span>
          </li>
          <li
            class="list-group-item d-flex justify-content-between align-items-center"
          >
            <div>
              <i class="bi bi-diagram-2 text-purple me-2"></i>
              Bono de Red Binaria
            </div>
            <i class="bi bi-x-circle-fill text-red"></i>
          </li>
          <li
            class="list-group-item d-flex justify-content-between align-items-center"
          >
            <div>
              <i class="fab fa-bitcoin text-yellow me-2"></i>
              Bitcoin Wallet Configurada
            </div>
            <i class="bi bi-check-circle-fill text-green"></i>
          </li>
        </ul>
      </div>
      <ranks-card :user-ranks-carrer-data="ranksCarrerData"> </ranks-card>
    </div>
    <div class="col-12 col-md-6 col-xl-4 mb-4">
      <registration-link-card></registration-link-card>
    </div>
    <div class="col-12 col-md-6 col-xl-4 d-none">
      <leader-board-card></leader-board-card>
    </div>
  </div>

  <div class="modal fade" id="resendEmail" tabindex="-1" role="dialog">
    <div class="vertical-alignment-helper">
      <div class="modal-dialog vertical-align-center">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title">Favor de verificar tu cuenta</h4>
            <button
              type="button"
              class="btn btn-close"
              data-dismiss="modal"
              @click="close"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <span
              >Para disfrutar todos los beneficios de la plataforma, es
              necesario que verifiques el correo electrónico ligado a tu cuenta
            </span>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-primary"
              @click="resendEmail()"
              :disabled="loading"
            >
              Reenviar correo de confirmación
              <i v-if="loading" class="fas fa-spinner fa-spin"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  doGetCommissions,
  unsubscribeListener
} from "@/store/Commissions/CommissionsInterfaces";
import { defineComponent } from "vue";
import { mapGetters } from "vuex";
import {
  LeaderBoardCard,
  RanksCard,
  RegistrationLinkCard,
  ImageCard
} from "../components";
import { CommissionsSummary } from "../components/commissions";
import { AccountSummary } from "../components/account";
import * as bs from "bootstrap";
import { VideosCarousel /*, WideNoticeCarousel */ } from "../components/home";

export default defineComponent({
  components: {
    LeaderBoardCard,
    RanksCard,
    RegistrationLinkCard,
    CommissionsSummary,
    AccountSummary,
    VideosCarousel,
    // WideNoticeCarousel
    ImageCard
  },
  name: "Home",
  data() {
    return {
      loading: false,
      modalHandler: {
        show() {
          return;
        },
        hide() {
          return;
        }
      }
    };
  },
  mounted() {
    this.$store.dispatch("loading", false);

    if (!this.emailVerified) {
      const element: HTMLElement = document.getElementById(
        "resendEmail"
      ) as HTMLElement;
      this.modalHandler = new bs.Modal(element);
      this.openModal();
    }
  },
  computed: {
    ...mapGetters("commissions", {
      summary: "getSummary"
    }),
    ...mapGetters("auth", {
      emailVerified: "getUserVerifiedStatus",
      email: "getUseremail",
      ranksCarrerData: "getRanksCarrerData"
    })
  },
  methods: {
    requestCommissions() {
      this.$store.dispatch("commissions/" + doGetCommissions);
    },
    resendEmail() {
      this.loading = true;
      this.$store
        .dispatch("auth/validateEmail", this.email)
        .then((response) => {
          if (response.data.OPCODE == "SUCCESS") {
            this.loading = false;
            this.close();
          }
        })
        .catch((error) => {
          alert("Error: " + error.message);
          this.loading = false;
        });
    },
    close() {
      this.modalHandler.hide();
    },
    openModal() {
      this.modalHandler.show();
    }
  },
  created() {
    this.requestCommissions();
  },
  beforeUnmount() {
    this.$store.dispatch("commissions/" + unsubscribeListener);
  }
});
</script>
<style lang="scss" scoped>
.last-updated-text {
  font-size: 0.75rem !important;
}
</style>
