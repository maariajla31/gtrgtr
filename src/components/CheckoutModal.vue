<template>
  <div
    class="modal fade"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
    id="checkout-modal"
  >
    <div class="modal-dialog">
      <div class="modal-content" v-if="isPaid">
        <div class="modal-header">
          <h5 class="modal-title">
            <i class="fas fa-check-circle me-2 text-success"></i>Pago exitoso
          </h5>
          <button
            type="button"
            class="btn-close btn-sm"
            data-bs-dismiss="modal"
            aria-label="Close"
            @click="close()"
          ></button>
        </div>
        <div class="modal-body">
          <div class="row mb-4">
            <div class="row">
              <div class="col-4 col-sm-3 text-end">Usuario:</div>
              <div class="col-8 col-sm-9 fw-bold">
                <span v-if="paidQuoteData.username != ''">
                  {{ paidQuoteData.username }}
                </span>
                <i v-else class="fas fa-spinner fa-pulse"></i>
              </div>
            </div>
            <div class="row">
              <div class="col-4 col-sm-3 text-end">Suscripción:</div>
              <div class="col-8 col-sm-9 fw-bold">
                <span v-if="paidQuoteData.subscriptionName != ''">{{
                  paidQuoteData.subscriptionName
                }}</span>
                <i v-else class="fas fa-spinner fa-pulse"></i>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col text-center">
              <img
                class="tick-image"
                :src="
                  require('@/assets/img/green-tick.gif') + '?r=' + refreshFlag
                "
              />
            </div>
          </div>
          <div class="row mt-4">
            <div class="col text-center">
              <h6 class="text-success fw-bold fs-5">
                ¡Felicidades! Su pago ha sido confirmado
              </h6>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <div class="m-0 flex-grow-1 d-flex flex-row">
            <button
              v-if="replay"
              type="button"
              class="btn btn-outline-secondary my-1"
              aria-label="Replay Bitcoin Party"
              @click="bitcoinParty()"
            >
              <i class="fas fa-redo"></i>
            </button>
            <div class="countdown">
              <div v-if="paymentReceived" class="circle-wrap">
                <div class="circle">
                  <div class="mask full">
                    <div class="fill"></div>
                  </div>
                  <div class="mask half">
                    <div class="fill"></div>
                  </div>
                </div>
                <div class="inside-circle">{{ countdownBP }}</div>
              </div>
            </div>
          </div>
          <button
            type="button"
            class="btn btn-outline-secondary"
            data-bs-dismiss="modal"
            aria-label="Close"
            @click="close()"
          >
            Cerrar
          </button>
        </div>
      </div>
      <div class="modal-content" v-else>
        <div class="modal-header">
          <h5 class="modal-title">
            <i class="fas fa-coins me-2 text-yellow"></i>Detalles del pago
          </h5>
          <!-- <button
            type="button"
            class="btn btn-outline-secondary btn-sm"
            @click="confetti()"
          >
            Confetti
          </button> -->
          <button
            type="button"
            class="btn-close btn-sm"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col-4 col-sm-3 text-end">Usuario:</div>
            <div class="col-8 col-sm-9 fw-bold">
              <span v-if="SubscriptionConfig">{{ quote.username }}</span>
              <i v-else class="fas fa-spinner fa-pulse"></i>
            </div>
          </div>
          <div class="row">
            <div class="col-4 col-sm-3 text-end">Suscripción:</div>
            <div class="col-8 col-sm-9 fw-bold">
              <span v-if="SubscriptionConfig">{{
                SubscriptionConfig.displayName
              }}</span>
              <i v-else class="fas fa-spinner fa-pulse"></i>
            </div>
          </div>
          <div class="row">
            <div class="col-4 col-sm-3 text-end">Duración:</div>
            <div class="col-8 col-sm-9 fw-bold">
              <span v-if="quote.duration">
                {{ quote.duration }} {{ durationUnitString }}
              </span>
              <i v-else class="fas fa-spinner fa-pulse"></i>
            </div>
          </div>
          <div class="row">
            <div class="col-4 col-sm-3 text-end">Total:</div>
            <div class="col-8 col-sm-9 fw-bold">
              <span v-if="quote.fromAmount">
                $ {{ quote.fromAmount }}
                {{ quote.fromCurrency }}
              </span>
              <i v-else class="fas fa-spinner fa-pulse"></i>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <a v-bind:href="paymentRef" target="_blank">
                <div id="qrcontainer" class="qr_code m-auto">
                  <canvas id="qrCanvas"></canvas></div
              ></a>
            </div>
          </div>
          <div class="row mb-1">
            <div class="col input-group">
              <span class="input-group-text"
                ><i class="fas fa-wallet fa-fw"></i
              ></span>
              <input
                type="text"
                class="form-control bg-light"
                placeholder="Wallet destino"
                id="txt-wallet"
                :value="quote.address"
                readonly
              />
              <button
                class="btn btn-outline-secondary"
                type="button"
                @click="copyToClipboard('txt-wallet')"
                :disabled="!quote.address"
              >
                <i
                  class="far fa-copy"
                  id="buttonCopyWallet"
                  data-bs-toggle="tooltip"
                  title="Copiar"
                ></i>
              </button>
            </div>
          </div>
          <div class="row mb-4">
            <div class="col-sm-5 mb-1 order-2 order-sm-1">
              <div class="input-group">
                <span class="input-group-text"
                  ><i class="fas fa-hourglass-half fa-fw"></i
                ></span>
                <input
                  type="text"
                  class="form-control text-center bg-light"
                  placeholder="Expiración"
                  :value="expiration.string"
                  disabled
                />
              </div>
            </div>
            <div class="col-sm-7 mb-1 order-1 order-sm-2">
              <div class="input-group">
                <span class="input-group-text"
                  ><i class="fab fa-btc fa-fw"></i
                ></span>
                <input
                  type="text"
                  class="form-control text-end border-end-0 bg-light"
                  placeholder="Total"
                  id="txt-total"
                  :value="quote.paymentAmount"
                  readonly
                />
                <span
                  class="input-group-text text-center bg-light"
                  id="txt-currency"
                  >{{ quote.paymentCurrency }}</span
                >
                <button
                  class="btn btn-outline-secondary"
                  type="button"
                  @click="copyToClipboard('txt-total')"
                  :disabled="!quote.paymentAmount"
                >
                  <i
                    class="far fa-copy"
                    id="buttonCopyTotal"
                    data-bs-toggle="tooltip"
                    title="Copiar"
                  ></i>
                </button>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col text-center" v-if="quote.confirms_needed">
              Todos los paquetes son activados despues de <br />
              <strong>{{ quote.confirms_needed }}</strong> confirmaciones en el
              blockchain.<br />
              Recibirás un correo cuando el pago se haya acreditado.
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <div class="m-0 flex-grow-1">
            <div class="countdown">
              <div v-if="paymentReceived" class="circle-wrap">
                <div class="circle">
                  <div class="mask full">
                    <div class="fill"></div>
                  </div>
                  <div class="mask half">
                    <div class="fill"></div>
                  </div>
                </div>
                <div class="inside-circle">{{ countdownBP }}</div>
              </div>
            </div>
          </div>
          <button
            type="button"
            class="btn btn-outline-primary"
            @click="renewQuote"
            v-if="quote.tx_id && expiration.difference < 600000"
          >
            Calcular de nuevo
          </button>
          <button
            type="button"
            class="btn btn-outline-secondary"
            data-bs-dismiss="modal"
            aria-label="Close"
            @click="close()"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import * as fb from "@/firebase";
import { defineComponent } from "vue";
import { mapGetters } from "vuex";
// import { Quote } from "functions/src/Payments/PaymentsInterfaces";
import QRCode from "qrcode";
// import {
//   QuoteSubscriptionRequest,
//   SubscriptionInfo
// };
//  from "functions/src/Subscriptions/SubscriptionsInterfaces";
import * as bs from "bootstrap";
import { confettiKit } from "@/assets/js/confettiKit";

export default defineComponent({
  name: "checkout-modal",
  // props: {
  //   quote: {
  //     type: Object as () => Quote,
  //     required: true
  //   }
  // },
  emits: ["clearQuote", "renewQuote", "paid"],
  data() {
    return {
      unsubscribe: () => {
        return;
      },
      expiration: {
        days: "",
        hours: "",
        minutes: "",
        seconds: "",
        difference: 0,
        string: ""
      },
      timer: setInterval(() => {
        return;
      }, 10000),
      paymentRef: "bitcoin:?amount=",
      refreshFlag: 0,
      refreshTimer: setInterval(() => {
        return;
      }, 10000),
      bitcoinPartyTimeout: setTimeout(() => {
        return;
      }, 10000),
      replayTimeout: setTimeout(() => {
        return;
      }, 10000),
      paymentReceived: false,
      countdownBP: 3,
      replay: false,
      isPaid: false,
      paidQuoteData: {
        username: "",
        subscriptionName: ""
      },
      modalObject: {}
    };
  },
  computed: {
    ...mapGetters("auth", ["getUsernamePK"]),
    ...mapGetters("subs", ["getSubscriptionConfig", "durationUnitLocalized"]),
    SubscriptionConfig(): string{
      return '';
    },
    durationUnitString(): string {
      return this.durationUnitLocalized(
        // this.quote.duration,
        // this.quote.durationUnit
      );
    }
  },
  methods: {
    startCountdown(toDate: Date) {
      this.timer = setInterval(() => this.countdown(toDate), 1000);
    },
    countdown(toDate: Date) {
      const dateEntered = toDate;
      const now = new Date();
      const difference = dateEntered.getTime() - now.getTime();

      if (difference <= 0) {
        // Timer done
        clearInterval(this.timer);
        //this.$emit("clearQuote");
      } else {
        let seconds = Math.floor(difference / 1000);
        let minutes = Math.floor(seconds / 60);
        let hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        hours %= 24;
        minutes %= 60;
        seconds %= 60;

        const t = {
          difference: difference,
          days: days.toString(),
          hours: hours.toString(),
          minutes: ("00" + minutes.toString()).slice(-2),
          seconds: ("00" + seconds.toString()).slice(-2),
          string: ""
        };

        let exp = "";
        exp +=
          days > 0
            ? days == 1
              ? days.toString() + " día "
              : days.toString() + " días "
            : "";
        exp += t.hours + ":" + t.minutes + ":" + t.seconds;
        t.string = exp;
        this.expiration = t;
      }
    },
    renderQr() {
      QRCode.toCanvas(
        document.getElementById("qrCanvas"),
        this.paymentRef,
        {
          width: 246,
          height: 246
        },
        (error: any) => {
          if (error) alert(error);
        }
      );
    },
    renewQuote() {
      clearInterval(this.timer);
      this.expiration.string = "";
      const canvas = document.getElementById("qrCanvas") as HTMLCanvasElement;
      const context = canvas.getContext("2d");
      context?.clearRect(0, 0, canvas.width, canvas.height);

      this.paidQuoteData = {
        username: "",
        subscriptionName: ""
      };

      this.$emit("clearQuote");
      // const request: ""//QuoteSubscriptionRequest = {
      //   // subscriptionId: this.quote.subscriptionId,
      //   // duration: this.quote.duration,
      //   // durationUnit: this.quote.durationUnit,
      //   // username: this.quote.username,
      //   // email: this.quote.email,
      //   // isDirectAffiliate: false
      // ;//};
      this.$emit("renewQuote", "request");
    },
    copyToClipboard(inputId: string) {
      const input = document.getElementById(inputId) as HTMLInputElement;
      if (input) {
        input.select();
        input.setSelectionRange(0, 99999);
        document.execCommand("copy");
      }
    },
    close() {
      setTimeout(() => {
        this.paidQuoteData = {
          username: "",
          subscriptionName: ""
        };
        this.$emit("clearQuote");
        this.isPaid = false;
        this.replay = false;
        this.paymentReceived = false;
        clearTimeout(this.replayTimeout);
        clearTimeout(this.bitcoinPartyTimeout);
      }, 1000);
    },
    confetti() {
      new confettiKit({
        //colors: [],
        confettiCount: 100,
        position: "bottomLeftRight",
        angle: 0,
        decay: 0.9,
        spread: 60,
        startVelocity: 120,
        elements: {
          confetti: {
            direction: "down",
            rotation: true
          },
          star: {
            count: 20,
            direction: "down",
            rotation: true
          },
          ribbon: {
            count: 20,
            direction: "down",
            rotation: true
          },
          custom: [
            {
              count: 10,
              width: 30,
              textSize: 165,
              content: require("@/assets/img/confetti/Bitcoin.png"),
              contentType: "image",
              direction: "down",
              rotation: true
            },
            {
              count: 10,
              width: 25,
              textSize: 165,
              content: require("@/assets/img/confetti/Bitcoin-coin-2.png"),
              contentType: "image",
              direction: "down",
              rotation: true
            },
            {
              count: 10,
              width: 15,
              textSize: 165,
              content: require("@/assets/img/confetti/Bitcoin-coin-2.png"),
              contentType: "image",
              direction: "down",
              rotation: true
            },
            {
              count: 10,
              width: 20,
              textSize: 165,
              content: require("@/assets/img/confetti/Bitcoin-vector.png"),
              contentType: "image",
              direction: "down",
              rotation: true
            },
            {
              count: 10,
              width: 25,
              textSize: 165,
              content: require("@/assets/img/confetti/GTR-Logo-Confetti.png"),
              contentType: "image",
              direction: "up",
              rotation: true
            },
            {
              count: 10,
              width: 20,
              textSize: 165,
              content: require("@/assets/img/confetti/GTR-Logo-Confetti.png"),
              contentType: "image",
              direction: "down",
              rotation: true
            },
            {
              count: 10,
              width: 40,
              textSize: 165,
              content: require("@/assets/img/confetti/GTR-Logo-Confetti.png"),
              contentType: "image",
              direction: "down",
              rotation: true
            }
          ]
        }
      });
      // X-mas confetti
      // const now = new Date();
      // if (
      //   (now.getMonth() === 12 && now.getDate() > 10) ||
      //   (now.getMonth() === 1 && now.getDate() < 15)
      // ) {
      //   new confettiKit({
      //     confettiCount: 300,
      //     position: "topLeftRight",
      //     angle: 0,
      //     decay: 0.9,
      //     spread: 40,
      //     startVelocity: 80,
      //     elements: {
      //       confetti: {
      //         direction: "down",
      //         rotation: true
      //       },
      //       star: {
      //         count: 0,
      //         direction: "down",
      //         rotation: true
      //       },
      //       ribbon: {
      //         count: 0,
      //         direction: "down",
      //         rotation: true
      //       },
      //       custom: [
      //         {
      //           count: 15,
      //           width: 30,
      //           textSize: 165,
      //           content: require("@/assets/img/confetti/xmas/cane.png"),
      //           contentType: "image",
      //           direction: "down",
      //           rotation: true
      //         },
      //         {
      //           count: 10,
      //           width: 30,
      //           textSize: 165,
      //           content: require("@/assets/img/confetti/xmas/hat.png"),
      //           contentType: "image",
      //           direction: "down",
      //           rotation: true
      //         },
      //         {
      //           count: 20,
      //           width: 30,
      //           textSize: 165,
      //           content: require("@/assets/img/confetti/xmas/snowflake-1.png"),
      //           contentType: "image",
      //           direction: "down",
      //           rotation: true
      //         },
      //         {
      //           count: 20,
      //           width: 25,
      //           textSize: 165,
      //           content: require("@/assets/img/confetti/xmas/snowflake-2.png"),
      //           contentType: "image",
      //           direction: "down",
      //           rotation: true
      //         },
      //         {
      //           count: 15,
      //           width: 30,
      //           textSize: 165,
      //           content: require("@/assets/img/confetti/xmas/snowflake-1.png"),
      //           contentType: "image",
      //           direction: "down",
      //           rotation: true
      //         },
      //         {
      //           count: 10,
      //           width: 45,
      //           textSize: 165,
      //           content: require("@/assets/img/confetti/xmas/snowflake-1.png"),
      //           contentType: "image",
      //           direction: "down",
      //           rotation: true
      //         },
      //         {
      //           count: 20,
      //           width: 12,
      //           textSize: 165,
      //           content: require("@/assets/img/confetti/xmas/snowflake-2.png"),
      //           contentType: "image",
      //           direction: "down",
      //           rotation: true
      //         },
      //         {
      //           count: 10,
      //           width: 18,
      //           textSize: 165,
      //           content: require("@/assets/img/confetti/xmas/snowflake-2.png"),
      //           contentType: "image",
      //           direction: "down",
      //           rotation: true
      //         }
      //       ]
      //     }
      //   });
      // }
    },
    bitcoinParty() {
      this.paymentReceived = true;
      this.replay = false;
      this.countdownBP = 3;
      setTimeout(() => {
        this.countdownBP--;
        setTimeout(() => {
          this.countdownBP--;
          setTimeout(() => {
            this.paymentReceived = false;
          }, 1500);
        }, 1500);
      }, 1500);
      this.bitcoinPartyTimeout = setTimeout(() => {
        this.confetti();
        this.replayTimeout = setTimeout(() => {
          this.replay = true;
        }, 8000);
      }, 5000);
    }
  },
  watch: {
    "quote.expirationTime": function(newValue) {
      // if (this.quote.expirationTime) {
      //   clearInterval(this.timer);
      //   this.countdown(newValue);
      //   this.startCountdown(newValue);
      // } else if (this.quote.expirationTime == undefined) {
      //   clearInterval(this.timer);
      //   this.expiration.string = "";
      //   //this.isPayed = false;
      // }
    },
    "quote.address": function(newValue) {
      if (newValue != undefined) {
        let coin: string;
        switch ("BTC") {
          case "BTC":
            coin = "bitcoin";
            break;
          // case "BTC":
          //   coin = "litecoin";
          //   break;
          default:
            coin = "bitcoin";
        }
        this.paymentRef = "";
          // coin +
          // ":" +
          // this.quote.address +
          // "?amount=" +
          // this.quote.paymentAmount;
        this.renderQr();
      }
    },
    "quote.tx_id": function(newValue) {
      if (newValue != undefined) {
        const _quoteRef = fb.fbfs
          .collection("users/quotes")
          .doc(newValue);
        this.unsubscribe();
        this.unsubscribe = _quoteRef.onSnapshot((docSnapshot) => {
          if (docSnapshot.exists) {
            //console.log(docSnapshot.data()?.status);
            if (
              docSnapshot.data()?.status == "paid" ||
              docSnapshot.data()?.status == "confirmed" ||
              docSnapshot.data()?.status == "complete" ||
              docSnapshot.data()?.status == "paidOver"
            ) {
              //console.log("inside if", docSnapshot.data()?.status);
              this.paidQuoteData = {
                username: "BTC",
                subscriptionName: this.SubscriptionConfig
              };
              this.unsubscribe();
              this.paymentReceived = true;
              this.countdownBP = 3;
              setTimeout(() => {
                this.countdownBP--;
                setTimeout(() => {
                  this.countdownBP--;
                  setTimeout(() => {
                    this.paymentReceived = false;
                  }, 1500);
                }, 1500);
              }, 1500);
              this.bitcoinPartyTimeout = setTimeout(() => {
                this.$emit("clearQuote");
                this.isPaid = true;
                this.$emit("paid");
                this.refreshTimer = setInterval(() => {
                  if (this.isPaid) {
                    this.refreshFlag = Math.random() * 100;
                  } else {
                    clearInterval(this.refreshTimer);
                  }
                }, 6000);
                this.confetti();
                this.replayTimeout = setTimeout(() => {
                  this.replay = true;
                }, 8000);
              }, 5000);
            }
          }
        });
      }
    }
  },
  mounted() {
    if (!this.isPaid) {
      const btnCopyWallet = document.getElementById("buttonCopyWallet");
      const btnCopyTotal = document.getElementById("buttonCopyTotal");
      /*const ttWallet = */ new bs.Tooltip(btnCopyWallet);
      /*const ttTotal  = */ new bs.Tooltip(btnCopyTotal);
      //console.log(ttWallet, ttTotal);
    }
  }
});
</script>
<style lang="scss" scoped>
.qr_code {
  margin-top: 50px;
  width: 246px;
  height: 246px;
  background-image: url("../assets/img/btc-loading.gif");
  background-size: 50% 50%;
  background-position: cover;
  background-position-y: 50%;
  background-position-x: 50%;
  background-repeat: no-repeat;
}

.tick-image {
  animation: grow 0.5s;
}
@keyframes grow {
  from {
    transform: scale(0);
  }
  to {
    transform: scale(1);
  }
}
.countdown {
  height: 46px;
}
.circle-wrap {
  position: relative;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #fff;
  box-shadow: 0 0 0 0.5px #fff;
  overflow: hidden;
}
.circle-wrap .circle .mask,
.circle-wrap .circle .fill {
  width: 40px;
  height: 40px;
  position: absolute;
  border-radius: 50%;
}

.mask .fill {
  clip: rect(0px, 20px, 40px, 0px);
  background-color: #171941;
  background-image: radial-gradient(
    ellipse at top,
    #344675,
    #e14eca,
    #263148,
    #344675,
    #263148
  );
}

.circle-wrap .circle .mask {
  clip: rect(0px, 40px, 40px, 20px);
}

.mask.full,
.circle .fill {
  animation: fill ease-in-out 1.5s 3 forwards;
  transform: rotate(360deg);
}

@keyframes fill {
  0% {
    transform: rotate(0deg);
  }
  85% {
    transform: rotate(180deg);
  }
  100% {
    transform: rotate(180deg);
  }
}

.circle-wrap .inside-circle {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #ffffff;
  line-height: 28px;
  text-align: center;
  margin-top: 5px;
  margin-left: 5px;
  color: #171941;
  position: absolute;
  z-index: 100;
  font-weight: 700;
  font-size: 1em;
}
</style>
