<template>
  <div
    class="modal fade"
    id="code-confirmation-modal"
    data-bs-backdrop="--static"
    data-bs-keyboard="false"
    tabindex="-1"
    aria-labelledby="codeConfirmation"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header bg-secondary text-light">
          <h5 class="modal-title">
            <i class="fas fa-user-shield fa-fw me-2"></i>
            Verificación de Identidad
          </h5>
          <button
            type="button"
            class="btn-close btn-close-white"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <!-- <p>
            Por tu seguridad y la de tus datos confidenciales, es necesaria la
            validación de tu identidad mediante tu correo previamente
            registrado.
          </p> -->
          <p>
            Para guardar los cambios debes ingresar el código de
            <span class="fw-bold">5 números</span> que hemos
            <span class="fw-bold">
              enviado a tu correo electrónico registrado
            </span>
            y que coincida con este código de identificación:
            <span class="col d-block text-center fs-5 fw-bold">
              {{ requestTag }}
            </span>
          </p>
          <div class="row flex-row">
            <div class="d-flex col col-sm-9 mx-auto">
              <input
                class="form-control form-control-lg px-1 me-1 mx-sm-2 text-center fw-bold"
                id="code-1"
                type="text"
                v-on:keyup="autoTab($event)"
                v-on:keydown="autoBackspace($event)"
                @paste="pasteCode"
                ref="code-1"
                maxlength="1"
                aria-label="Primer dígito"
                v-model="code[0]"
                autofocus
              />
              <input
                class="form-control form-control-lg px-1 me-1 mx-sm-2 text-center fw-bold"
                id="code-2"
                type="text"
                v-on:keyup="autoTab($event)"
                v-on:keydown="autoBackspace($event)"
                ref="code-2"
                maxlength="1"
                v-model="code[1]"
                aria-label="Segundo dígito"
              />
              <input
                class="form-control form-control-lg px-1 me-1 mx-sm-2 text-center fw-bold"
                id="code-3"
                type="text"
                v-on:keyup="autoTab($event)"
                v-on:keydown="autoBackspace($event)"
                ref="code-3"
                maxlength="1"
                v-model="code[2]"
                aria-label="Tercer dígito"
              />
              <input
                class="form-control form-control-lg px-1 me-1 mx-sm-2 text-center fw-bold"
                id="code-4"
                type="text"
                v-on:keyup="autoTab($event)"
                v-on:keydown="autoBackspace($event)"
                ref="code-4"
                maxlength="1"
                v-model="code[3]"
                aria-label="Cuarto dígito"
              />
              <input
                class="form-control form-control-lg px-1 me-0 mx-sm-2 text-center fw-bold"
                id="code-5"
                type="text"
                v-on:keyup="autoTab($event)"
                v-on:keydown="autoBackspace($event)"
                ref="code-5"
                maxlength="1"
                v-model="code[4]"
                aria-label="Quinto dígito"
              />
            </div>
          </div>
          <div class="row mt-4">
            <div class="col col-sm-10 offset-sm-1 small" v-if="hasError">
              <div
                class="alert alert-danger alert-dismissible fade show text-center"
                role="alert"
              >
                <i class="fas fa-exclamation-triangle fa-fw me-1"></i>
                {{ errorMessage }}
                <button
                  type="button"
                  class="btn-close btn-sm"
                  data-bs-dismiss="alert"
                  aria-label="Close"
                ></button>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer justify-content-end">
          <button type="button" class="btn btn-outline-info d-none" disabled>
            Reenviar Código
          </button>
          <button
            type="button"
            class="btn btn-outline-secondary"
            :disabled="!canSave || isSaving"
            @click="save()"
          >
            Aceptar
            <i v-if="isSaving" class="fas fa-spinner fa-spin"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ProcessSecuredDataRequest } from "@/store/Profile/ProfileInterfaces";
import { defineComponent } from "vue";
const numbers = /^[0-9]$/;

export default defineComponent({
  name: "code-confirmation-modal",
  data() {
    return {
      code: ["", "", "", "", ""],
      isSaving: false
    };
  },
  props: {
    requestTag: {
      type: String,
      required: true
    },
    errorMessage: {
      type: String,
      default: ""
    },
    updated: {
      type: Boolean,
      default: false,
      required: true
    }
  },
  emits: ["processSecuredData"],
  computed: {
    canSave(): boolean {
      return this.code.join("").trim().length == 5;
    },
    hasError(): boolean {
      return this.errorMessage != "";
    }
  },
  methods: {
    save() {
      const req: ProcessSecuredDataRequest = {
        requestTag: this.requestTag,
        confirmationCode: this.code.join("")
      };
      this.isSaving = true;
      this.$emit("processSecuredData", req);
    },
    autoTab(e: KeyboardEvent) {
      const input = e.target as HTMLInputElement;
      const inputIndex = Number(input.id.split("-")[1]);
      if (!input.value.match(numbers)) {
        input.value = "";
        this.code[inputIndex - 1] = "";
        return;
      } else if (e.key.match(numbers)) {
        if (inputIndex !== 5 && input.value.length === input.maxLength) {
          (this.$refs[`code-${inputIndex + 1}`] as HTMLInputElement).select();
        }
      }
    },
    autoBackspace(e: KeyboardEvent) {
      const input = e.target as HTMLInputElement;
      const inputIndex = Number(input.id.split("-")[1]);
      switch (e.key) {
        case "Backspace":
          if (inputIndex !== 1 && input.value.length === 0) {
            (this.$refs[`code-${inputIndex - 1}`] as HTMLInputElement).select();
          }
          break;
      }
    },
    pasteCode(e: ClipboardEvent) {
      const value = e.clipboardData?.getData("text").trim();
      if (value?.length === 5 && value.match(/^[0-9]{5}$/)) {
        this.code = value.trim().split("");
      }
    }
  },
  watch: {
    errorMessage(value) {
      if (value) {
        this.code = ["", "", "", "", ""];
        this.isSaving = false;
      }
    },
    updated(newValue: boolean) {
      if (newValue) {
        this.code = ["", "", "", "", ""];
        this.isSaving = false;
      }
    }
  }
});
</script>
