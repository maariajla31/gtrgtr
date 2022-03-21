<template>
  <div class="w-100">
    <div id="leaderboard" class="carousel slide" data-bs-ride="carousel">
      <div class="carousel-indicators carousel-bottom-indicators mb-0">
        <button
          type="button"
          data-bs-target="#leaderboard"
          data-bs-slide-to="0"
          aria-label="Slide 1"
        ></button>
        <button
          type="button"
          data-bs-target="#leaderboard"
          data-bs-slide-to="1"
          class="active"
          aria-current="true"
          aria-label="Slide 2"
        ></button>
        <button
          type="button"
          data-bs-target="#leaderboard"
          data-bs-slide-to="2"
          aria-label="Slide 3"
        ></button>
      </div>
      <div class="carousel-inner">
        <div class="carousel-item" data-bs-interval="5000">
          <img :src="previousMonth" class="d-block w-100 rounded" alt="" />
        </div>
        <div class="carousel-item active" data-bs-interval="5000">
          <img :src="currentMonth" class="d-block w-100 rounded" alt="" />
        </div>
        <div class="carousel-item" data-bs-interval="5000">
          <img :src="xmasbonus" class="d-block w-100 rounded" alt="" />
        </div>
      </div>
      <button
        class="carousel-control-prev w-auto"
        type="button"
        data-bs-target="#leaderboard"
        data-bs-slide="prev"
      >
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previa</span>
      </button>
      <button
        class="carousel-control-next w-auto"
        type="button"
        data-bs-target="#leaderboard"
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
  name: "leaderboard-carousel",
  data() {
    return {
      previousMonth: "",
      currentMonth: "",
      xmasbonus: ""
    };
  },
  created() {
    const previousMonth = "img/home/00_firmas_previous.jpg";
    const currentMonth = "img/home/05_firmas_current.jpg";
    const xmasbonus = "img/home/10_bono.jpg";
    const defaultImage = "GTR-No-Picture.png";

    this.previousMonth = require(`../../assets/img/${defaultImage}`);
    this.currentMonth = require(`../../assets/img/${defaultImage}`);
    this.xmasbonus = require(`../../assets/img/${defaultImage}`);

    this.getImage(previousMonth).then((r) => {
      this.previousMonth = r;
    });
    this.getImage(currentMonth).then((r) => {
      this.currentMonth = r;
    });
    this.getImage(xmasbonus).then((r) => {
      this.xmasbonus = r;
    });
  },
  mounted() {
    const myCarousel = document.querySelector("#leaderboard");
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

<style lang="scss" scoped>
.carousel-bottom-indicators [data-bs-target] {
  width: 30px;
  height: 4px;
  border-bottom: 3px solid transparent;
  border-top: 2px solid transparent;
}
</style>
