<template>
  <div class="row mb-4 mt-4">
    <div class="col-2">
      <button
        class="btn btn-primary w-100"
        :disabled="isCalculating.binary"
        @click="calculateBinary()"
      >
        Calcular Binario
        <i v-if="isCalculating.binary" class="fas fa-spinner fa-spin"></i>
      </button>
    </div>
  </div>
  <div class="row mb-4">
    <div class="col-2">
      <button
        class="btn btn-primary w-100"
        :disabled="isCalculating.payout"
        @click="calculatePayouts()"
      >
        Calcular Pagos
        <i v-if="isCalculating.payout" class="fas fa-spinner fa-spin"></i>
      </button>
    </div>
  </div>
  <div class="row mb-4">
    email:
    <input
      type="text"
      class="form-control input-sm"
      placeholder="Correo electrónico"
      aria-label="Correo electrónico"
      id="txtEmail"
      v-model.trim="registrationForm.email"
    />
    username:
    <input
      type="text"
      class="form-control input-sm"
      placeholder="Nombre de Usuario"
      aria-label="Nombre de Usuario"
      id="txtUsername"
      v-model.trim="registrationForm.username"
    />
    <div class="col-2 mt-3">
      <button
        class="btn btn-primary w-100"
        :disabled="isCalculating.activating"
        @click="registerWithNoVolume()"
      >
        Activar SIN Volumen
      </button>
    </div>
  </div>
</template>
<script>
import { defineComponent } from "vue";
import * as fb from "../../firebase";

export default defineComponent({
  name: "payouts",
  data() {
    return {
      isCalculating: {
        binary: false,
        payout: false,
        quote: false,
        activating: false
      },
      registrationForm: {
        email: "",
        username: ""
      }
    };
  },
  methods: {
    calculateBinary() {
      this.isCalculating.binary = true;
      const calculateBinaryPoints = fb.func.httpsCallable(
        "System-calculateBinaryPoints"
      );
      calculateBinaryPoints()
        .then((response) => {
          console.log(response);
        })
        .finally(() => {
          this.isCalculating.binary = false;
        });
    },
    calculatePayouts() {
      this.isCalculating.payout = true;
      const calculatePayouts = fb.func.httpsCallable("System-calculatePayouts");
      calculatePayouts()
        .then((response) => {
          console.log(response);
        })
        .finally(() => {
          this.isCalculating.payout = false;
        });
    },
    registerWithNoVolume() {
      this.isCalculating.activating = true;
      const subscriptionRequest = {
        subscriptionId: "both",
        //duration: 30,
        //durationUnit: "days",
        username: this.registrationForm.username.toLowerCase(),
        email: this.registrationForm.email,
        isDirectAffiliate: false,
        noVolume: true
      };
      const UpdateSubscription = fb.func.httpsCallable(
        "Subscriptions-UpdateSubscriptionWithoutVolume"
      );
      UpdateSubscription(subscriptionRequest)
        .then((response) => {
          if (response.data.OPCODE == "SUCCESS") {
            alert("Activado correctamente");
          } else if (response.data.OPCODE == "ERROR") {
            alert(response.data.message);
          }
        })
        .finally(() => {
          this.isCalculating.activating = false;
        });
    }
  }
});
</script>
