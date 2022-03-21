<template>
  <div class="w-100 bg-light rounded border">
    <div
      id="noticeCarousel"
      class="carousel carousel-fade slide loading-background rounded"
      data-bs-ride="carousel"
    >
      <div
        v-if="noticeList.length > 1"
        class="carousel-indicators --carousel-bottom-indicators mb-0"
      >
        <button
          v-for="(img, index) in noticeList"
          :key="index"
          type="button"
          data-bs-target="#noticeCarousel"
          :class="{ active: index === activeSlide }"
          :data-bs-slide-to="index"
          :aria-label="'Slide ' + index"
        ></button>
      </div>
      <div class="carousel-inner rounded">
        <div
          v-for="(img, index) in noticeList"
          :key="index"
          :class="'carousel-item' + (index === 0 ? ' active' : '')"
          data-bs-interval="8000"
        >
          <div class="ratio ratio-16x9 loading-background">
            <img :src="img" class="img-fluid border-0 rounded" alt="" />
          </div>
        </div>
      </div>
      <button
        v-if="noticeList.length > 1"
        class="carousel-control-prev w-auto"
        type="button"
        data-bs-target="#noticeCarousel"
        data-bs-slide="prev"
      >
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previa</span>
      </button>
      <button
        v-if="noticeList.length > 1"
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
import { mapGetters } from "vuex";
import { images } from "@/mixins/images";
import * as bootstrap from "bootstrap";
import { NoticeParams } from "@/store/System/SystemConfigInterfaces";

export default defineComponent({
  name: "wide-notice-carousel",
  data() {
    return {
      noticeList: [""],
      activeSlide: 0
    };
  },
  computed: {
    ...mapGetters("sys", ["getWideNotices"])
  },
  created() {
    this.getWideNotices.forEach((img: NoticeParams, index: number) => {
      this.getImage(img.src).then((r) => {
        this.noticeList[index] = r;
      });
    });
  },
  watch: {
    getWideNotices() {
      this.getWideNotices.forEach((img: NoticeParams, index: number) => {
        this.getImage(img.src).then((r) => {
          this.noticeList[index] = r;
        });
      });
    }
  },
  mounted() {
    const myCarousel = document.querySelector("#noticeCarousel");
    const carousel = new bootstrap.Carousel(myCarousel);
    carousel.cycle();
    if (myCarousel) {
      myCarousel.addEventListener("slide.bs.carousel", (par: any) => {
        this.activeSlide = par.to;
      });
    }
  },
  setup() {
    const getImage = images.methods.getImage;
    return {
      getImage
    };
  }
});
</script>
