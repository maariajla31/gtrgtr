<template>
  <class-edit-modal
    v-if="isModalVisible"
    @close="closeModal()"
    v-bind:mode="mode"
    v-bind:timeKey="modalKey"
    v-bind:day="modalDay"
    v-bind:index="modalIndex"
    v-bind:info="modalInfo"
    v-bind:program="program"
  />
  <div class="row">
    <div class="col-sm-12 col-md-5 col-lg-3">
      <select
        id="program"
        class="form-control"
        v-model="program"
        @change="search()"
      >
        <option value="trading-academy" selected>Academia Trading</option>
        <option value="gtr-system">Sistema GTR</option>
      </select>
    </div>
    <div class="col-sm-12 col-md-7 col-lg-9">
      <button
        style="margin-right:10px"
        class="btn btn-primary"
        @click="addSchedule()"
      >
        <i class="bi bi-calendar-plus"></i> &nbsp; Añadir clase
      </button>
      <button
        class="btn btn-outline-dark"
        @click="cloneSchedule()"
        :disabled="scheduleObject.size != 0"
      >
        <i class="bi bi-clipboard"></i> &nbsp; Clonar semana previa
      </button>
    </div>
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
        <template v-for="time in getClasses" :key="time">
          <tr>
            <th class="col-1 text-center text-nowrap">{{ time[0] }}</th>
            <td class="col-1">
              <template v-for="(c, index) in time[1].monday" :key="c">
                <class-card
                  :classTitle="c.title"
                  :imageUrl="c.imageUrl"
                  @click="showModal(time[0], 'monday', index, c, 'edit')"
                  class="class-selected"
                ></class-card>
              </template>
            </td>
            <td class="col-1">
              <template v-for="(c, index) in time[1].tuesday" :key="c">
                <class-card
                  :classTitle="c.title"
                  :imageUrl="c.imageUrl"
                  :registrationOpen="c.registrationOpen"
                  @click="showModal(time[0], 'tuesday', index, c, 'edit')"
                  class="class-selected"
                ></class-card>
              </template>
            </td>
            <td class="col-1">
              <template v-for="(c, index) in time[1].wednesday" :key="c">
                <class-card
                  :classTitle="c.title"
                  :imageUrl="c.imageUrl"
                  :registrationOpen="c.registrationOpen"
                  @click="showModal(time[0], 'wednesday', index, c, 'edit')"
                  class="class-selected"
                ></class-card>
              </template>
            </td>
            <td class="col-1">
              <template v-for="(c, index) in time[1].thursday" :key="c">
                <class-card
                  :classTitle="c.title"
                  :imageUrl="c.imageUrl"
                  :registrationOpen="c.registrationOpen"
                  @click="showModal(time[0], 'thursday', index, c, 'edit')"
                  class="class-selected"
                ></class-card>
              </template>
            </td>
            <td class="col-1">
              <template v-for="(c, index) in time[1].friday" :key="c">
                <class-card
                  :classTitle="c.title"
                  :imageUrl="c.imageUrl"
                  :registrationOpen="c.registrationOpen"
                  @click="showModal(time[0], 'friday', index, c, 'edit')"
                  class="class-selected"
                ></class-card>
              </template>
            </td>
            <td class="col-1">
              <template v-for="(c, index) in time[1].saturday" :key="c">
                <class-card
                  :classTitle="c.title"
                  :imageUrl="c.imageUrl"
                  :registrationOpen="c.registrationOpen"
                  @click="showModal(time[0], 'saturday', index, c, 'edit')"
                  class="class-selected"
                ></class-card>
              </template>
            </td>
            <td class="col-1">
              <template v-for="(c, index) in time[1].sunday" :key="c">
                <class-card
                  :classTitle="c.title"
                  :imageUrl="c.imageUrl"
                  :registrationOpen="c.registrationOpen"
                  @click="showModal(time[0], 'sunday', index, c, 'edit')"
                  class="class-selected"
                ></class-card>
              </template>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import moment from "moment";
import { defineComponent } from "vue";
import ClassCard from "../subscriptions/ClassCard.vue";
import ClassEditModal from "./ClassEditModal.vue";
import { mapGetters } from "vuex";

export default defineComponent({
  name: "SchedulesConfiguration",
  components: { ClassCard, ClassEditModal },
  data() {
    return {
      scheduleObject: {},
      isModalVisible: false,
      modalKey: "",
      modalDay: "",
      modalIndex: 0,
      modalInfo: {},
      mode: "",
      program: "trading-academy"
    };
  },
  computed: {
    ...mapGetters("classes", ["getClasses"])
  },
  created() {
    this.search();
  },
  methods: {
    search() {
      const week = moment().format("WW");
      const year = moment().format("YYYY");

      this.$store
        .dispatch("classes/doGetSchedules", {
          year: year,
          week: week,
          program: this.program
        })
        .catch((error) => {
          alert(error);
        });
    },
    showModal(
      key: string,
      day: string,
      index: number,
      info: object,
      mode: string
    ) {
      //console.log(key, day, index);
      this.modalKey = key;
      this.modalDay = day;
      this.modalIndex = index;
      this.modalInfo = info;
      this.isModalVisible = true;
      this.mode = mode;

      const menu = document.getElementById("sidebarMenu") as HTMLElement;
      menu.classList.add("navbar-modal-active");
    },
    closeModal() {
      this.isModalVisible = false;
      this.modalKey = "";
      this.modalDay = "";
      this.modalIndex = 0;
      this.modalInfo = {};
      const menu = document.getElementById("sidebarMenu") as HTMLElement;
      menu.classList.remove("navbar-modal-active");
    },
    addSchedule() {
      const info = {};
      this.showModal("", "", 0, info, "add");
    },
    cloneSchedule() {
      this.$store.dispatch("loading", true);
      const week = moment().format("WW");
      const year = moment().format("YYYY");
      this.$store
        .dispatch("classes/cloneClasses", {
          week: week,
          year: year
        })
        .then((response) => {
          alert(response.message);
          this.$store
            .dispatch("classes/doGetSchedules", { year: year, week: week })
            .catch((error) => {
              alert(error);
            });
        })
        .catch((error) => {
          alert(error);
        })
        .finally(() => {
          this.$store.dispatch("loading", false);
        });
    }
  }
});
</script>
<style lang="scss" scoped>
.navbar-modal-active {
  z-index: 0 !important;
}

.class-selected:hover {
  cursor: pointer;
  box-shadow: 0px 0px 10px 3px #6897fd;
}

.add-schedule {
  font-size: x-large;
}

.add-schedule:hover {
  cursor: pointer;
  color: $primary;
}
</style>
