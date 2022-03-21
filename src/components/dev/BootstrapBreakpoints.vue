<template>
  <div
    class="alert alert-light show fade border screen-size-toolbar p-1 ms-2 d-flex flex-column"
  >
    <div>
      <button
        type="button"
        class="btn-close btn-sm float-end mb-2"
        aria-label="Close"
        data-togle="collapse"
        data-target=".screen-size-toolbar"
        data-bs-dismiss="alert"
      ></button>
    </div>
    <div class="d-flex flex-column">
      <div class="input-group input-group-sm d-flex mb-1 flex-fill">
        <div class="input-group-text font-monospace col">
          <span class="mx-auto" id="min-size"></span>
        </div>
        <div class="input-group-text font-monospace col">
          <span class="mx-auto" id="current-name"></span>
        </div>
        <div class="input-group-text font-monospace col">
          <span class="mx-auto" id="max-size"></span>
        </div>
      </div>
      <div class="input-group input-group-sm d-flex mb-1 flex-fill">
        <div class="input-group-text col">
          <span class="mx-auto" id="current-size">{{ windowWidth }}px</span>
        </div>
      </div>
      <div class="d-flex alight-items-center">
        <div class="col">
          <div class="progress border col" style="height: 25px;">
            <div
              class="progress-bar progress-bar-striped bg-info"
              role="progressbar"
              :style="{ width: widthPercentage + '%' }"
              :aria-valuenow="widthPercentage"
              aria-valuemin="0"
              aria-valuemax="100"
            >
              <div class="small mx-1 text-nowrap my-auto">
                {{ widthPercentage }} %
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "bootstrap-breakpoints",
  data() {
    return {
      windowWidth: 0
    };
  },
  computed: {
    widthPercentage(): number {
      const breaks = [0, 576, 768, 992, 1200, 1400];
      let b = 1;
      const wwidth = this.windowWidth;
      if (wwidth >= 576) {
        b = 2;
      }
      if (wwidth >= 768) {
        b = 3;
      }
      if (wwidth >= 992) {
        b = 4;
      }
      if (wwidth >= 1200) {
        b = 5;
      }
      if (wwidth >= 1400) {
        return 0;
      }
      return Math.floor(
        ((wwidth - breaks[b - 1]) / (breaks[b] - breaks[b - 1])) * 100
      );
    }
  },
  methods: {
    onWidthChange() {
      this.windowWidth = window.innerWidth;
    }
  },
  created() {
    this.windowWidth = window.innerWidth;
    window.addEventListener("resize", this.onWidthChange);
  },
  unmounted() {
    window.removeEventListener("resize", this.onWidthChange);
  }
});
</script>

<style lang="scss">
.alert.screen-size-toolbar {
  z-index: 3000;
  position: fixed;
  bottom: 15px;
  width: 200px;
}
@each $name, $value in $grid-breakpoints {
  @include media-breakpoint-up($name) {
    #min-size:after {
      content: "#{breakpoint-min($name)}";
    }
    #current-name:after {
      content: "#{$name}";
    }
    #max-size:after {
      content: "#{breakpoint-min(breakpoint-next($name))}";
    }
  }
}
</style>
