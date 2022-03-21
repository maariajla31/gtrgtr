<template>
  <div class="w-100 bg-light rounded border">
    <div
      id="carouselVideos"
      class="carousel carousel-dark carousel-fade slide"
      data-bs-ride="carousel"
      data-bs-interval="10000"
    >
      <div class="carousel-inner">
        <div class="carousel-item active px-5 pt-1 pb-5 pb-xl-0">
          <div class="ratio ratio-16x9">
            <iframe
              width="1920"
              height="1080"
              src="https://player.vimeo.com/video/663267953?h=79f08e4a8e"
              title="Recuento 2021 - GTR Academy"
              frameborder="0"
              allow="autoplay; fullscreen; picture-in-picture"
              allowfullscreen
            ></iframe>
          </div>
          <div class=" d-none">
            <div class="flex-fill d-flex justify-content-center mt-1 mb-2">
              <a
                href="https://zenith3gtr.eventbrite.com.mx/"
                target="_blank"
                type="button"
                class="btn btn-outline-primary btn-sm mt-1"
              >
                <i class="fas fa-ticket-alt me-2"></i>Comprar Boletos
              </a>
            </div>
          </div>
        </div>
        <div class="carousel-item px-5 pt-0">
          <div class="ratio ratio-16x9">
            <iframe
              width="1920"
              height="1080"
              src="https://player.vimeo.com/video/653488052?h=b2f043c1fb"
              title="Zenith 3"
              frameborder="0"
              allow="autoplay; fullscreen; picture-in-picture"
              allowfullscreen
            ></iframe>
          </div>
          <div class=" d-flex">
            <div class="flex-fill d-flex justify-content-center mt-0 mb-1">
              <a
                href="https://zenith3gtr.eventbrite.com.mx/"
                target="_blank"
                type="button"
                class="btn btn-outline-primary btn-sm mt-1"
              >
                <i class="fas fa-ticket-alt me-2"></i>Comprar Boletos
              </a>
            </div>
          </div>
        </div>
        <div class="carousel-item px-5 pt-1 pb-5 pb-xl-0">
          <div class="ratio ratio-16x9">
            <iframe
              width="1920"
              height="1080"
              src="https://player.vimeo.com/video/653487390?h=f4428e977a"
              title="GTR Cryptospace - Estreno Servicio GTR Academy"
              frameborder="0"
              allow="autoplay; fullscreen; picture-in-picture"
              allowfullscreen
            ></iframe>
          </div>
          <div class=" d-none">
            <div class="flex-fill d-flex justify-content-center mt-1 mb-2">
              <a
                href="https://zenith3gtr.eventbrite.com.mx/"
                target="_blank"
                type="button"
                class="btn btn-outline-primary btn-sm mt-1"
              >
                <i class="fas fa-ticket-alt me-2"></i>Comprar Boletos
              </a>
            </div>
          </div>
        </div>
      </div>
      <button
        class="carousel-control-prev w-auto"
        type="button"
        data-bs-target="#carouselVideos"
        data-bs-slide="prev"
      >
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previo</span>
      </button>
      <button
        class="carousel-control-next w-auto"
        type="button"
        data-bs-target="#carouselVideos"
        data-bs-slide="next"
      >
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Siguiente</span>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import * as bootstrap from "bootstrap";

export default defineComponent({
  name: "videos-carousel",
  mounted() {
    const myCarousel = document.querySelector("#carouselVideos");
    const carousel = new bootstrap.Carousel(myCarousel);
    carousel.cycle();
  }
});
</script>
