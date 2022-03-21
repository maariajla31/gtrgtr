<template>
  <div
    class="modal fade"
    id="error-modal"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
    tabindex="-1"
    aria-labelledby="messageModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header bg-danger bg-gradient text-light py-2">
          <h5 class="modal-title">
            <i class="fas fa-exclamation-triangle fa-fw me-2"></i>
            {{ title }}
          </h5>
          <button
            type="button"
            class="btn-close btn-sm btn-close-white"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body text-center">
          <span v-html="message"></span>
        </div>
        <div class="modal-footer justify-content-center">
          <button
            type="button"
            class="btn btn-outline-secondary btn-sm"
            data-bs-dismiss="modal"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "error-modal",
  props: {
    title: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    }
  }
});
</script>
