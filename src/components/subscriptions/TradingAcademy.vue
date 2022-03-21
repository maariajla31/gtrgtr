<template>
  <div>
    <div class="row">
      <div class="col-12 col-md-6 col-xl-4 d-flex flex-row mb-4">
        <status-card
          :subscription-id="'trading-academy'"
          :lastQuote="quote"
          :isQuoting="isQuoting"
          @isActive="setIsActive"
          @clear-quote="clearQuote"
          @request-quote="createQuote"
        ></status-card>
      </div>
      <div v-show="isActive" class="col-12 col-md-6 col-xl-4 mb-4">
        <div class="d-flex flex-row">
          <div class="card flex-fill justify-self-stretch">
            <h5 class="card-header">
              <i class="fas fa-video me-2"></i>Aula Virtual
            </h5>
            <div class="card-body d-flex align-items-center text-center">
              <div class="">
                Aprende de nuestros traders profesionales desde lo más básico
                hasta técnicas avanzadas de trading en forex, operaciones
                binarias y trading deportivo.
              </div>
            </div>
            <div class="card-footer text-center">
              <form ref="formClassroom" target="_blank" method="POST">
                <input
                  type="hidden"
                  id="username"
                  name="username"
                  ref="username"
                />
                <input
                  type="hidden"
                  id="password"
                  name="password"
                  ref="password"
                />
                <div v-show="isClassroomActive">
                  <div class="d-flex align-items-center">
                    <div class="flex-grow-1">
                      <button
                        type="submit"
                        class="d-none"
                        ref="btnSubmit"
                      ></button>
                      <button
                        class="btn btn-primary"
                        role="button"
                        @click.prevent="classroomLogin()"
                      >
                        Clases Grabadas<i
                          class="fas fa-external-link-alt ms-2"
                        ></i>
                      </button>
                    </div>
                    <button
                      class="btn p-0"
                      data-bs-toggle="popover"
                      title="Permitir Ventanas Emergentes"
                      data-bs-content="Para poder accesar a sus clases grabadas, debe permitir al navegador el abrir ventanas emergentes (Popups)."
                      data-bs-trigger="focus"
                      @click.prevent
                      ref="popups"
                    >
                      <i class="fas fa-info-circle fa-fw"></i>
                    </button>
                  </div>
                </div>
                <div v-show="!isClassroomActive">
                  <div class="d-flex align-items-center">
                    <div class="flex-grow-1">
                      <button class="btn btn-primary" role="button" disabled>
                        Activando Clases Grabadas<i
                          class="fas fa-cog fa-spin fa-fw ms-2"
                        ></i>
                      </button>
                    </div>
                    <a
                      tabindex="0"
                      class="btn p-0"
                      role="button"
                      data-bs-toggle="popover"
                      data-bs-html="true"
                      title="Activación de Clases Grabadas"
                      data-bs-content="<p>La activación de las clases grabadas toma entre <strong>30 y 60 minutos</strong>
                        después de que su academia fue activada.</p>
                        <p>En caso de que haya pasado más de ese tiempo favor de envíar un
                        correo a soporte técnico: <a href='mailto:soporte@gtr.academy'>soporte@gtr.academy</a></p>"
                      data-bs-trigger="focus"
                      ref="activando"
                    >
                      <i class="fas fa-info-circle fa-fw"></i>
                    </a>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div class="col-4"></div>
    </div>
    <div class="row" id="schedule" v-if="isActive">
      <div class="col-12">
        <week-schedule
          scheduleId="trading-academy"
          title="Clases en vivo"
          titleIcon="fas fa-broadcast-tower"
        ></week-schedule>
      </div>
    </div>
  </div>
  <checkout-modal
    :quote="quote"
    @clear-quote="clearQuote"
    @renew-quote="createQuote"
  ></checkout-modal>
</template>

<script lang="ts">
import { defineComponent } from "vue";
// import StatusCard from "./StatusCard.vue";
import WeekSchedule from "./WeekSchedule.vue";
import CheckoutModal from "../CheckoutModal.vue";
// import { Quote } from "functions/src/Payments/PaymentsInterfaces";
// import { QuoteSubscriptionRequest } from "functions/src/Subscriptions/SubscriptionsInterfaces";
import { quoteSubscription } from "@/store/Subscriptions/SubscriptionsConsts";
import { mapActions, mapGetters } from "vuex";
import * as fb from "../../firebase";
import * as bs from "bootstrap";

export default defineComponent({
  name: "TradingAcademy",
  // components: { StatusCard, WeekSchedule, CheckoutModal },
  data() {
    return {
      isLoaded: false,
      isActive: false,
      isQuoting: false,
      // quote: {} as Quote,
      modalObj: {} as any,
      popovers: [] as any
    };
  },
  computed: {
    ...mapGetters("auth", ["getUsernamePK"]),
    ...mapGetters("sys", ["isOffline"]),
    ...mapGetters("profile", { weknowData: "getUserWeknowData" }),
    isClassroomActive(): boolean {
      return this.weknowData ? this.weknowData.status === "active" : false;
    }
  },
  methods: {
    ...mapActions("profile", ["doGetUserWeknowData"]),
    clearQuote() {
      // this.quote = {} as Quote;
    },
    createQuote(request: "QuoteSubscriptionRequest") {
      if (!this.isOffline) {
        this.isQuoting = true;
        this.$store.dispatch("subs/" + quoteSubscription, request).then((q) => {
          if (q.OPCODE == "ERROR") {
            alert(q.message);
          } else {
            // this.quote = q;

            if (!this.modalObj._isShown) {
              this.modalObj.show();
            }
          }
          this.isQuoting = false;
        });
      }
    },
    setIsActive(status: boolean) {
      this.isActive = status;
    },
    classroomLogin() {
      const classroomInfoRequest = {
        username: this.getUsernamePK
      };

      const GetClassroomInfo = fb.func.httpsCallable("Users-getClassroomInfo");
      GetClassroomInfo(classroomInfoRequest).then((response) => {
        const info = response.data;
        if (info.OPCODE == "SUCCESS") {
          (this.$refs.username as HTMLInputElement).value = info.data.username;
          (this.$refs.password as HTMLInputElement).value = info.data.password;
          (this.$refs.formClassroom as HTMLFormElement).action =
            info.data.url + "login/index.php";
          (this.$refs.btnSubmit as HTMLButtonElement).click();
          (this.$refs.username as HTMLInputElement).value = "";
          (this.$refs.password as HTMLInputElement).value = "";
        } else {
          alert(
            "No se pudo obtener la información para acceder a las clases grabadas."
          );
        }
      });
    }
  },
  mounted() {
    this.modalObj = new bs.Modal(document.getElementById("checkout-modal"));
    //this.$nextTick(() => {
    new bs.Popover(this.$refs.popups);
    new bs.Popover(this.$refs.activando);

    // const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
    // console.log("list: ", popoverTriggerList);
    // this.popovers = popoverTriggerList.map(function(popoverTriggerEl) {
    //   console.log(popoverTriggerEl);
    //   return new bs.Popover(popoverTriggerEl);
    // });
    //});
    this.doGetUserWeknowData(this.getUsernamePK);
  }
});
</script>
<style lang="scss" scoped>
.schedule-table {
  th:first-child,
  td:first-child {
    padding-right: 1rem;
    position: sticky;
    left: 0px;
    z-index: 1;
    background-image: linear-gradient(
      90deg,
      rgba(255, 255, 255, 1),
      rgba(255, 255, 255, 1) 80%,
      rgba(255, 255, 255, 0)
    );
  }
}
.added-duration {
  text-align: center;
  min-width: unset;
  width: 3rem;
}
</style>
