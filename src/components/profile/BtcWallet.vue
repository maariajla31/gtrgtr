<template>
  <div class="d-flex flex-column">
    <div class="card">
      <div class="card-header d-flex justify-content-between">
        <h5 class="card-title text-warning mb-0">
          <i class="fab fa-bitcoin fa-fw me-2"></i>
          <span>Cartera de Bitcoin (BTC)</span>
        </h5>
        <div>
          <div v-if="editMode">
            <button
              @click="cancelEdit()"
              class="btn btn-sm btn-outline-danger me-2"
            >
              <i class="fas fa-ban fa-fw me-1"></i>Cancelar
            </button>
            <button
              class="btn btn-sm btn-outline-success"
              :disabled="!canSave || saving"
              @click="save()"
            >
              <i class="fas fa-save fa-fw me-1"></i>Guardar
              <i v-if="saving" class="fas fa-spinner fa-spin ms-1"></i>
            </button>
          </div>
          <div v-else>
            <button @click="edit()" class="btn btn-sm btn-outline-secondary">
              <i class="fas fa-pen fa-fw"></i>
            </button>
          </div>
        </div>
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-12">
            <div class="input-group text-nowrap">
              <span
                class="input-group-text text-center col-2 col-sm-1"
                :class="readOnlyClasses"
                id="btc-icon"
              >
                <i class="fab fa-btc fa-fw mx-auto"></i>
              </span>
              <div class="form-floating col">
                <input
                  type="text"
                  class="form-control text-center rounded-0"
                  :class="readOnlyClasses"
                  id="btc-wallet"
                  ref="btcWallet"
                  placeholder="Wallet de Bitcoin (BTC)"
                  v-model="localFinancialInfo.btcWallet.address"
                  :disabled="!editMode"
                  :readonly="!editMode"
                />
                <label for="btc-wallet" class="opacity-100">
                  Wallet de Bitcoin (BTC)
                </label>
              </div>
              <div class="form-floating col-3">
                <input
                  type="text"
                  class="form-control fs-6 text-center rounded-0 rounded-end"
                  :class="readOnlyClasses"
                  id="wallet-label"
                  placeholder="Etiqueta"
                  v-model="localFinancialInfo.btcWallet.label"
                  :disabled="!editMode"
                  :readonly="!editMode"
                />
                <label for="wallet-label" class="opacity-100">
                  <i class="fas fa-tag fa-fw "></i>
                  Etiqueta
                </label>
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
import {
  Financial,
  WalletInfo,
  SecuredDataRequest
} from "@/store/Profile/ProfileInterfaces";
import { mapActions } from "vuex";

export default defineComponent({
  name: "btc-wallet",
  props: {
    financialInfo: {
      type: Object as () => Financial,
      default: {} as Financial,
      required: true
    },
    updated: {
      type: Boolean,
      default: false,
      required: true
    },
    error: {
      type: Boolean,
      default: false,
      required: true
    }
  },
  data() {
    return {
      editMode: false,
      localFinancialInfo: {
        btcWallet: {
          address: "",
          label: ""
        }
      } as Financial,
      saving: false
    };
  },
  emits: ["saveSecuredData"],
  computed: {
    canSave(): boolean {
      return (
        this.localFinancialInfo.btcWallet?.address !==
          this.financialInfo.btcWallet?.address ||
        this.localFinancialInfo.btcWallet?.label !==
          this.financialInfo.btcWallet?.label
      );
    },
    readOnlyClasses(): any {
      return {
        "bg-light": this.editMode,
        "bg-body": !this.editMode,
        "bg-gradient": !this.editMode,
        "text-secondary": !this.editMode
      };
    }
  },
  methods: {
    ...mapActions("profile", ["doUpdateUserFinancialInfo"]),
    edit() {
      this.editMode = true;
      // Patch because this.$nextTick() doesn't work when emits are used
      setTimeout((): void => {
        (this.$refs.btcWallet as HTMLInputElement).select();
      }, 200);
    },
    save() {
      this.saving = true;
      this.$emit("saveSecuredData", {
        type: "btcWallet",
        data: this.localFinancialInfo.btcWallet,
        requestId: "",
        requestTag: ""
      } as SecuredDataRequest);
    },
    cancelEdit() {
      this.setLocalFinancialInfo(this.financialInfo);
      this.editMode = false;
      this.saving = false;
    },
    setLocalFinancialInfo(newValue: Financial) {
      if (newValue.btcWallet) {
        // if (typeof newValue.btcWallet === typeof "") {
        //   this.localFinancialInfo.btcWallet = {
        //     address: newValue.btcWallet.toString() + ""
        //   } as WalletInfo;
        // } else {
        this.localFinancialInfo.btcWallet = {
          ...(newValue.btcWallet as WalletInfo)
        };
        this.saving = false;
        // }
      }
    }
  },
  mounted() {
    this.setLocalFinancialInfo(this.financialInfo);
  },
  watch: {
    financialInfo: {
      handler(newValue: Financial) {
        this.setLocalFinancialInfo(newValue);
      },
      deep: true
    },
    updated: {
      handler(newValue: boolean) {
        if (newValue) {
          this.editMode = false;
          this.saving = false;
        }
      }
    },
    error: {
      handler(newValue: boolean) {
        if (newValue) {
          this.saving = false;
        }
      }
    }
  }
});
</script>
