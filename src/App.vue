<template>
  <router-view />
  <bootstrap-breakpoints class="visually-hidden"></bootstrap-breakpoints>
</template>
<script>
import { defineComponent } from "vue";
import { doGetRanksInfo } from "@/store/Ranks/RanksInterfaces";
import BootstrapBreakpoints from "./components/dev/BootstrapBreakpoints";

export default defineComponent({
  async created() {
    this.$store.dispatch("ranks/" + doGetRanksInfo);
    this.$store.dispatch("sys/doGetMenu");
    this.$store.dispatch("sys/doGetSystemConfig");
    this.$store.dispatch("classes/doGetSchedules");
  },
  unmounted() {
    this.$store.dispatch("sys/clearConfigListener");
  },
  components: { BootstrapBreakpoints }
});
</script>
<style lang="scss">
#app {
  overflow: hidden;
}
</style>
