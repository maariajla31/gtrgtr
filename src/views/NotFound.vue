<template>
  <div class="container">
    <div class="row">
      <div class="col-xl-1"></div>
      <div class="col-xl-4 text-404">
        <span>404</span>
      </div>
      <div class="col-xl-6 not-found-text">
        <span>No pudimos encontrar esta página</span>
      </div>
    </div>
    <div class="row">
      <div class="text-center p-4">
        <img
          src="../assets/img/gtr_metal-300x115.png"
          alt="Genera tu Riqueza"
        />
      </div>
    </div>
    <div class="row">
      <div class="text-center">
        <router-link to="/home">
          <button type="primary" class="btn btn-primary">
            Ir a inicio
          </button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "Not-Found"
});
</script>

<style lang="scss" scoped>
.text-404 {
  color: $gray-900;
  font-size: 200px;
  font-weight: bold;
}

.not-found-text {
  font-size: 60px;
  font-weight: 600;
  padding-top: 70px;
  color: $gray-600;
}
</style>
