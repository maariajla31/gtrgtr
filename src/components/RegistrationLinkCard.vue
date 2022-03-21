<template>
  <div class="card">
    <h5 class="card-header d-flex align-items-center">
      <span
        ><i class="bi bi-vector-pen me-2 text-blue"></i>Enlace de registro
      </span>
    </h5>
    <div class="card-body">
      <input
        type="text"
        class="form-control"
        id="referralUrl"
        data-bs-toggle="tooltip"
        data-bs-trigger="manual"
        data-bs-placement="top"
        title="Copiado al Portapapeles"
        :placeholder="registrationLink"
        readonly
      />
    </div>
    <div class="card-footer text-center flex-column d-flex">
      <h6 class="small">Copiar enlace de registro:</h6>
      <div class="btn-group" role="group">
        <button
          type="button"
          :class="linkbuttonClass('left')"
          @click="copyToClipboard('izq')"
        >
          <i class="far fa-copy me-1"></i>
          Izquierda
        </button>
        <button
          type="button"
          :class="linkbuttonClass('right')"
          @click="copyToClipboard('der')"
          mouseout="outFunc('der')"
        >
          Derecha
          <i class="far fa-copy ms-1"></i>
        </button>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { mapGetters } from "vuex";
import * as bs from "bootstrap";
import { AccountSummary } from "@/store/Account/AccountInterface";

export default defineComponent({
  name: "registration-link-card",
  data() {
    return {
      linkToCopy: "",
      copiedTooltip: {
        show() {
          return;
        },
        hide() {
          return;
        }
      }
    };
  },
  computed: {
    ...mapGetters("auth", ["getUsernamePK"]),
    ...mapGetters("account", ["getAccountSummary"]),
    accountSummary(): AccountSummary {
      return this.getAccountSummary;
    },
    linkBase(): string {
      const hrefArray = window.location.href.split("/");
      return hrefArray[0] + "//" + hrefArray[2] + "/registro/";
    },
    registrationLink(): string {
      return this.linkBase + this.getUsernamePK + "/";
    },
    binarySide(): string {
      return this.accountSummary?.binarySide
        ? this.accountSummary?.binarySide
        : "";
    },
    innerLegUnlocked(): boolean {
      if (this.accountSummary?.innerLegUnlocked == undefined) {
        return true;
      }
      return this.accountSummary?.innerLegUnlocked
        ? this.accountSummary?.innerLegUnlocked
        : false;
    }
  },
  mounted() {
    const txtReferralUrl = document.getElementById("referralUrl");
    this.copiedTooltip = new bs.Tooltip(txtReferralUrl);
  },
  methods: {
    copyToClipboard(side: string) {
      this.linkToCopy = this.registrationLink + side;
      const el = document.getElementById("referralUrl") as HTMLInputElement;
      el.value = this.linkToCopy;
      el.select();
      el.setSelectionRange(0, 99999);
      document.execCommand("copy");
      this.copiedTooltip.show();
      setTimeout(() => this.copiedTooltip.hide(), 2000);
    },
    linkbuttonClass(btnSide: "right" | "left"): string {
      let classes = "btn btn-outline-info";
      if (
        btnSide == "left" &&
        this.binarySide == "right" &&
        this.innerLegUnlocked == false
      ) {
        classes += " d-none";
      } else if (
        btnSide == "right" &&
        this.binarySide == "left" &&
        this.innerLegUnlocked == false
      ) {
        classes += " d-none";
      }
      return classes;
    }
  }
});
</script>
