<template>
  <div class="card">
    <div class="card-header">
      <span class="h5"
        ><i :class="titleIcon + ' me-2'" v-if="titleIcon != undefined"></i
        >{{ title }}</span
      >
    </div>
    <div class=" table-responsive ms-3">
      <table class="table schedule-table text-center">
        <thead class="">
          <tr>
            <th class="col-1 text-nowrap">Hora \ Día</th>
            <th class="col-1">Lunes</th>
            <th class="col-1">Martes</th>
            <th class="col-1">Miércoles</th>
            <th class="col-1">Jueves</th>
            <th class="col-1">Viernes</th>
            <th class="col-1">Sábado</th>
            <th class="col-1">Domingo</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="time in schedule" :key="time">
            <tr>
              <th class="col-1 text-center text-nowrap">
                {{ getLocalizedHour(time[0]) }}
              </th>
              <td class="col-1">
                <template v-for="c in time[1].monday" :key="c">
                  <class-card
                    :classData="c"
                    :classTitle="c.title"
                    :imageUrl="c.imageUrl"
                    :registrationOpen="c.registrationOpen"
                    :classDate="getClassDate(1, time[0])"
                  ></class-card>
                </template>
              </td>
              <td class="col-1">
                <template v-for="c in time[1].tuesday" :key="c">
                  <class-card
                    :classData="c"
                    :classTitle="c.title"
                    :imageUrl="c.imageUrl"
                    :registrationOpen="c.registrationOpen"
                    :classDate="getClassDate(2, time[0])"
                  ></class-card>
                </template>
              </td>
              <td class="col-1">
                <template v-for="c in time[1].wednesday" :key="c">
                  <class-card
                    :classData="c"
                    :classTitle="c.title"
                    :imageUrl="c.imageUrl"
                    :registrationOpen="c.registrationOpen"
                    :classDate="getClassDate(3, time[0])"
                  ></class-card>
                </template>
              </td>
              <td class="col-1">
                <template v-for="c in time[1].thursday" :key="c">
                  <class-card
                    :classData="c"
                    :classTitle="c.title"
                    :imageUrl="c.imageUrl"
                    :registrationOpen="c.registrationOpen"
                    :classDate="getClassDate(4, time[0])"
                  ></class-card>
                </template>
              </td>
              <td class="col-1">
                <template v-for="c in time[1].friday" :key="c">
                  <class-card
                    :classData="c"
                    :classTitle="c.title"
                    :imageUrl="c.imageUrl"
                    :registrationOpen="c.registrationOpen"
                    :classDate="getClassDate(5, time[0])"
                  ></class-card>
                </template>
              </td>
              <td class="col-1">
                <template v-for="c in time[1].saturday" :key="c">
                  <class-card
                    :classData="c"
                    :classTitle="c.title"
                    :imageUrl="c.imageUrl"
                    :registrationOpen="c.registrationOpen"
                    :classDate="getClassDate(6, time[0])"
                  ></class-card>
                </template>
              </td>
              <td class="col-1">
                <template v-for="c in time[1].sunday" :key="c">
                  <class-card
                    :classData="c"
                    :classTitle="c.title"
                    :imageUrl="c.imageUrl"
                    :registrationOpen="c.registrationOpen"
                    :classDate="getClassDate(7, time[0])"
                  ></class-card>
                </template>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { mapGetters } from "vuex";
import ClassCard from "./ClassCard.vue";
import dayjs from "dayjs";
import IsoWeek from "dayjs/plugin/isoWeek";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { TimeWeekDefinition } from "@/store/Classes/ClassesInterfases";
dayjs.extend(IsoWeek);
dayjs.extend(utc);
dayjs.extend(timezone);

export default defineComponent({
  name: "WeekSchedule",
  props: {
    scheduleId: { type: String, required: true },
    title: { type: String, required: true },
    titleIcon: { type: String }
  },
  components: { ClassCard },
  methods: {
    getClassDate(day: number, hourString: string) {
      const parts = hourString.split(":");
      const minutes = Number(parts[1].substring(0, 2));
      const mod = parts[1].substring(2, 4);
      let hour = Number(parts[0]);
      hour = mod == "pm" && hour != 12 ? hour + 12 : hour;
      const date = dayjs()
        .isoWeekday(day)
        .hour(hour)
        .minute(minutes)
        .second(0);

      const dateString = date.format("YYYY-MM-DD HH:mm:ss");
      const localizedDate = dayjs.tz(dateString, "America/Mexico_city");
      return localizedDate;
    },
    getLocalizedHour(hourString: string) {
      const parts = hourString.split(":");
      const minutes = Number(parts[1].substring(0, 2));
      const mod = parts[1].substring(2, 4);
      let hour = Number(parts[0]);
      hour = mod == "pm" && hour != 12 ? hour + 12 : hour;
      const date = dayjs()
        .hour(hour)
        .minute(minutes)
        .second(0);

      const dateString = date.format("YYYY-MM-DD HH:mm:ss");
      const localizedDate = dayjs.tz(dateString, "America/Mexico_city");
      const localizedHourString = localizedDate
        .tz(dayjs.tz.guess())
        .format("h:mm a")
        .toString();
      return localizedHourString;
    }
  },
  computed: {
    ...mapGetters("classes", ["getSchedule"]),
    schedule(): Map<string, TimeWeekDefinition> | undefined {
      return this.getSchedule(this.scheduleId);
    }
  }
});
</script>
