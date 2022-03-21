<template>
  <div class="main-image">
    <router-link to="/login">
      <img
        class="logo-gtr fade-in-image"
        :src="require('@/assets/img/logo-gtr-white.png')"
      />
    </router-link>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "front-page"
});
</script>

<style lang="scss">
.main-image {
  height: 100vh;
  background-color: black;
  text-align: center;
}
.main-image {
  padding-top: 15vh;
  padding-left: 10vw;
  padding-right: 10vw;
}
.main-image > a > img {
  max-width: 100%;
  height: auto;
}
@media only screen and (min-width: 500px) {
  .main-image > a > img {
    max-width: 100%;
    height: 70vh;
  }
}

.fade-in-image {
  animation: fadeIn 5s;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
