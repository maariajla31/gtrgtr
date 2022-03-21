<template>
  <div class="row" id="schedule">
    <div class="col-12">
      <week-schedule
        scheduleId="gtr-system"
        title="Programación Semanal"
        titleIcon="fas fa-broadcast-tower"
      ></week-schedule>
    </div>
  </div>
  <div class="gtr-system row" v-if="false">
    <h1>Sistema GTR</h1>
    <ul>
      <li>
        Calendario de Actividades
        <ul>
          <li>
            Al dar click mostrar el flyer completo (datos extra): Speaker,
            edificación...)
          </li>
        </ul>
      </li>
      <li>Videos de inicio rapido</li>
      <li>Archivos: presentacion, plan servilleta</li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import WeekSchedule from "./WeekSchedule.vue";

export default defineComponent({
  name: "GTRSystem",
  components: { WeekSchedule }
});
</script>
