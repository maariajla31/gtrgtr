<template>
  <div class="card flex-fill justify-self-stretch">
    <div class="card-header">
      <span
        ><i class="fas fa-umbrella-beach me-2 text-orange"></i> Bootcamp
        2021</span
      >
    </div>
    <div class="card-body row">
      <div class="col-12 col-lg-4">
        <img
          data-bs-toggle="modal"
          data-bs-target="#bootcamp-modal"
          class="img-fluid"
          src="../../../assets/img/bootcamp-2021/bootcamp-2021.jpeg"
          atl="Bootcamp 2021"
        />
      </div>
      <div class="col-12 col-lg-8 mt-4 mt-lg-0">
        <div class="ratio ratio-16x9">
          <iframe
            width="1920"
            height="1080"
            src="https://www.youtube.com/embed/aH3rd1b5wOo?w=1920&h=1080"
            title="BOOTCAMP GTR Academy 2021 Que tanto estas dispuesto a pelear por tus sueños"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
        </div>
      </div>
    </div>
  </div>
  <div class="modal fade" id="bootcamp-modal" role="dialog">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="">
          <button
            type="button"
            class="btn-close btn-sm float-end m-2"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
          <img
            class="img-fluid"
            src="../../../assets/img/bootcamp-2021/bootcamp-2021.jpeg"
            atl="Bootcamp 2021"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Bootcamp2021"
});
</script>
