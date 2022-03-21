<template>
  <div class="card flex-fill justify-self-stretch">
    <div class="card-header" v-if="cardHeader && cardHeader != ''">
      {{ cardHeader }}
    </div>
    <img
      v-if="topImage && imgUrl != ''"
      :src="imgUrl"
      :alt="imgAlt"
      class="card-img-top"
    />
    <div
      class="card-body"
      v-if="imgUrl == '' || cardTitle || topImage == false"
    >
      <h5 v-if="cardTitle && cardTitle != ''" class="card-title">
        {{ cardTitle }}
      </h5>
      <img
        v-if="!topImage && imgUrl != ''"
        :src="imgUrl"
        :alt="imgAlt"
        class="img-fluid"
      />
      <div v-if="imgUrl == ''" class="text-center mt-5">
        <i class="fas fa-spinner fa-spin fa-5x mx-auto"></i>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { images } from "@/mixins/images";

export default defineComponent({
  name: "image-card",
  props: {
    fromBucket: { required: false, type: Boolean, default: false },
    topImage: { required: false, type: Boolean, default: false },
    cardHeader: { required: false, type: String },
    cardTitle: { required: false, type: String },
    imgSrc: { required: true, type: String },
    imgAlt: { required: false, type: String }
  },
  data() {
    return {
      imgUrl: ""
    };
  },
  created() {
    const defaultImage = "GTR-No-Picture.png";
    if (this.fromBucket) {
      const url = "" + this.imgSrc;
      this.getImage(url).then((r) => {
        this.imgUrl = r;
      });
    } else {
      try {
        this.imgUrl = require(`../assets/img/${this.imgSrc}`);
      } catch {
        this.imgUrl = require(`../assets/img/${defaultImage}`);
      }
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
