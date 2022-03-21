<template>
  <div class="card  class-card mb-2" v-if="classDate && classData">
    <div class="card-img d-flex align-items-center">
      <img :src="getImage()" alt="" class="card-img" />
      <!-- <img :src="getImage()" alt="" class="card-img" /> -->
    </div>
    <div class="card-img-overlay p-2 text-start d-flex text-white">
      <div class="card-title h6 small mb-0 align-self-end">
        {{ classData.title }}
      </div>
    </div>
    <div class="card-body p-2 mb-0 small text-nowrap text-dark">
      <button
        class="btn btn-outline-primary btn-sm"
        v-if="classStatus == 'current'"
        @click="openClass(classData.link)"
      >
        <i class="fas fa-external-link-alt me-1"></i>Unirse
      </button>
      <div
        class="text-success py-1 px-2 class-done-text"
        v-else-if="classStatus == 'done'"
      >
        <i class="fas fa-check-square me-1"></i>Terminada
      </div>
      <div
        class="text-info py-1 px-2 class-done-text"
        v-else-if="classStatus == 'future'"
      >
        <i class="far fa-clock me-1"></i>Programada
      </div>
      <div
        class="text-muted py-1 px-2 class-done-text"
        title="Solicita el acceso a tu lider"
        v-else-if="classStatus == 'locked'"
      >
        <i class="fas fa-lock me-1"></i>Bloqueada
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";
import isBetween from "dayjs/plugin/isBetween";

dayjs.extend(weekday);
dayjs.extend(isBetween);

export default defineComponent({
  name: "classCard",
  props: {
    classData: { required: true, type: Object },
    //imageUrl: String,
    //classTitle: String,
    //registrationOpen: Boolean,
    classDate: Object
  },
  computed: {
    classStatus(): "done" | "current" | "future" | "locked" {
      const now = dayjs();
      const classTime = dayjs(this.classDate as Date);
      if (
        now.isBetween(
          classTime.subtract(15, "minute"),
          classTime.add(1, "hour")
        )
      ) {
        if (
          this.classData.requiredRank != undefined &&
          this.classData.requiredRank != "INITIAL"
        ) {
          return "locked";
        } else {
          return "current";
        }
      } else if (classTime.isAfter(now)) {
        return "future";
      } else if (classTime.isBefore(now)) {
        return "done";
      }
      return "done";
    }
  },
  methods: {
    getImage() {
      //}: NodeRequire {
      if (
        this.classData.imageUrl &&
        this.classData.imageUrl.startsWith("data:image")
      ) {
        return this.classData.imageUrl;
      } else {
        const defaultImage = "default-card.jpg";
        try {
          return require(`../../assets/img/classes/${this.classData.imageUrl}`);
        } catch {
          return require(`../../assets/img/classes/${defaultImage}`);
        }
      }
    },
    openClass(url: string) {
      const _url =
        url +
        "?s=" +
        new Date()
          .getTime()
          .toString()
          .substring(4);
      // console.log(_url);
      const newWindow = window.open(_url);
      if (
        !newWindow ||
        newWindow.closed ||
        typeof newWindow.closed == "undefined"
      ) {
        alert(
          "Favor de permitir las Ventanas Emergentes (Popups) en su navegador"
        );
      }
    }
  }
});
</script>
<style lang="scss" scoped>
.class-card {
  > .card-img,
  > .card-img-overlay {
    max-height: 3.5rem;
  }
  > .card-img {
    overflow: hidden;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }
  // > img.card-img {
  // }
  > .card-img-overlay {
    background-image: linear-gradient(
      180deg,
      rgba(0, 0, 0, 0) 0%,
      rgba(0, 0, 0, 0.1) 40%,
      rgba(0, 0, 0, 0.8)
    );
  }
  .class-done-text {
    border: 1px solid transparent;
  }
}
</style>
