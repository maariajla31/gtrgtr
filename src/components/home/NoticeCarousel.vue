<template>
  <div class="w-100">
    <div id="noticeCarousel" class="carousel slide" data-bs-ride="carousel">
      <div class="carousel-indicators carousel-bottom-indicators mb-0">
        <button
          type="button"
          data-bs-target="#noticeCarousel"
          data-bs-slide-to="0"
          aria-label="Slide 1"
        ></button>
        <button
          type="button"
          data-bs-target="#noticeCarousel"
          data-bs-slide-to="1"
          class="active"
          aria-current="true"
          aria-label="Slide 2"
        ></button>
        <button
          type="button"
          data-bs-target="#noticeCarousel"
          data-bs-slide-to="2"
          aria-label="Slide 3"
        ></button>
        <!-- <button
          type="button"
          data-bs-target="#noticeCarousel"
          data-bs-slide-to="3"
          aria-label="Slide 4"
        ></button> -->
      </div>
      <div class="carousel-inner">
        <div class="carousel-item" data-bs-interval="5000">
          <img :src="notice01" class="d-block w-100 rounded" alt="" />
        </div>
        <div class="carousel-item active" data-bs-interval="5000">
          <img :src="notice02" class="d-block w-100 rounded" alt="" />
        </div>
        <div class="carousel-item" data-bs-interval="5000">
          <img :src="notice03" class="d-block w-100 rounded" alt="" />
        </div>
        <!-- <div class="carousel-item" data-bs-interval="5000">
          <img :src="notice04" class="d-block w-100 rounded" alt="" />
        </div> -->
      </div>
      <button
        class="carousel-control-prev w-auto"
        type="button"
        data-bs-target="#noticeCarousel"
        data-bs-slide="prev"
      >
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previa</span>
      </button>
      <button
        class="carousel-control-next w-auto"
        type="button"
        data-bs-target="#noticeCarousel"
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
import { images } from "@/mixins/images";
import * as bootstrap from "bootstrap";

export default defineComponent({
  name: "notice-carousel",
  data() {
    return {
      notice01: "",
      notice02: "",
      notice03: "",
      notice04: ""
    };
  },
  created() {
    const notice01 = "img/home/20_firmas_ganadores.jpg";
    const notice02 = "img/home/30_aguinaldo.jpg";
    const notice03 = "img/home/25_bono.jpg";
    // const notice04 = "img/home/35_licencia.jpg";
    const defaultImage = "GTR-No-Picture.png";

    this.notice01 = require(`../../assets/img/${defaultImage}`);
    this.notice02 = require(`../../assets/img/${defaultImage}`);
    this.notice03 = require(`../../assets/img/${defaultImage}`);
    this.notice04 = require(`../../assets/img/${defaultImage}`);

    this.getImage(notice01).then((r) => {
      this.notice01 = r;
    });
    this.getImage(notice02).then((r) => {
      this.notice02 = r;
    });
    this.getImage(notice03).then((r) => {
      this.notice03 = r;
    });
    // this.getImage(notice04).then((r) => {
    //   this.notice04 = r;
    // });
  },
  mounted() {
    const myCarousel = document.querySelector("#noticeCarousel");
    const carousel = new bootstrap.Carousel(myCarousel);
    carousel.cycle();
  },
  setup() {
    const getImage = images.methods.getImage;
    return {
      getImage
    };
  }
});
</script>
