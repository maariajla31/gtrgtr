<template>
  <div class="container-md mb-4">
    <income-report></income-report>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { incomeReport } from "../components/queries";

export default defineComponent({
  name: "Queries",
  components: { incomeReport }
});
</script>
