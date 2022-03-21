<template>
  <div class="modal-backdrop">
    <div
      class="modal"
      role="dialog"
      aria-labelledby="modalTitle"
      aria-describedby="modalDescription"
    >
      <header class="modal-header" id="modalTitle">
        <slot name="header">
          <span> Detalles de la clase </span>

          <button
            type="button"
            class="btn-close"
            @click="close"
            aria-label="Close modal"
          >
            x
          </button>
        </slot>
      </header>
      <section class="modal-body cropModal" id="modalDescription">
        <div class="row" v-if="!edit">
          <div class="col-sm-12 col-lg-6">
            <div class="form-group">
              <label class="form-control-label"><strong>Día</strong></label>
              <div class="has-label">
                <select
                  id="dayOfWeek"
                  class="form-control"
                  v-model="dayOfWeek"
                  placeholder="Día"
                >
                  <option value="monday">Lunes</option>
                  <option value="tuesday">Martes</option>
                  <option value="wednesday">Miércoles</option>
                  <option value="thursday">Jueves</option>
                  <option value="friday">Viernes</option>
                  <option value="saturday">Sábado</option>
                  <option value="sunday">Domingo</option>
                </select>
              </div>
            </div>
          </div>

          <div class="col-sm-12 col-lg-6">
            <div class="form-group">
              <label class="form-control-label"><strong>Hora</strong></label>
              <div class="has-label">
                <input
                  class="form-control"
                  type="time"
                  id="appt"
                  name="appt"
                  step="1800"
                  v-model="time"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-sm-12 col-lg-6">
            <div class="form-group">
              <label class="form-control-label"><strong>Título</strong></label>
              <div class="has-label">
                <input
                  id="title"
                  type="text"
                  placeholder="Título"
                  class="form-control"
                  v-model="classInfo.title"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-sm-12 col-lg-6">
            <div class="form-group">
              <label class="form-control-label"><strong>Enlace</strong></label>
              <div class="has-label">
                <input
                  id="link"
                  type="text"
                  placeholder="Enlace"
                  class="form-control"
                  v-model="classInfo.link"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-sm-12 col-lg-12">
            <div class="form-group">
              <label class="form-control-label"><strong>Imagen</strong></label>
              <br />
              <div class="has-label">
                <input
                  hidden
                  type="file"
                  id="inUploadPicture"
                  class="btn btn-outline-primary"
                  @change="uploadImage($event)"
                  accept="image/png, image/jpeg, image/jpg"
                />
                <div class="row">
                  <div class="col-sm-12 col-lg-6" style="padding-left: 0px;">
                    <button
                      type="button"
                      class="btn btn-outline-primary"
                      style="width:100%"
                      @click="selectImage()"
                    >
                      <i class="fa fa-upload" aria-hidden="true"></i>
                      Subir desde el dispositivo
                    </button>
                  </div>
                  <div class="col-sm-12 col-lg-6">
                    <label v-if="hasImage" class="text-success"
                      >La imagen ha sido cargada exitosamente</label
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <footer class="modal-footer">
        <slot name="footer">
          <button
            v-if="edit"
            class="btn btn-outline-primary"
            @click="deleteClass()"
          >
            <i class="bi bi-trash"></i> &nbsp; Eliminar
          </button>
          <button
            type="button"
            class="btn btn-secondary"
            @click="close"
            aria-label="Close modal"
          >
            Cancelar
          </button>
          <button
            type="button"
            class="btn btn-primary"
            @click="save()"
            :disabled="invalidFields()"
          >
            Guardar
          </button>
        </slot>
      </footer>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import moment from "moment";

export default defineComponent({
  name: "ClassEditModal",
  data() {
    return {
      classInfo: {
        imageUrl: "",
        link: "",
        registrationOpen: false,
        title: ""
      },
      edit: false,
      hasImage: false,
      time: "",
      dayOfWeek: ""
    };
  },
  props: {
    timeKey: Number,
    day: String,
    index: Number,
    info: Object,
    mode: String,
    program: String
  },
  mounted() {
    this.edit = this.mode == "edit" ? true : false;

    if (this.edit) {
      this.classInfo.imageUrl = this.info?.imageUrl;
      this.classInfo.link = this.info?.link;
      this.classInfo.registrationOpen = this.info?.registrationOpen;
      this.classInfo.title = this.info?.title;
    }
  },
  methods: {
    invalidFields() {
      if (this.edit) {
        if (!this.classInfo.link || !this.classInfo.title) {
          return true;
        } else {
          return false;
        }
      } else {
        if (
          !this.classInfo.link ||
          !this.classInfo.title ||
          !this.dayOfWeek ||
          !this.time
        ) {
          return true;
        } else {
          return false;
        }
      }
    },
    close() {
      this.$emit("close");
    },
    deleteClass() {
      this.$store.dispatch("loading", true);
      const week = moment().format("WW");
      const year = moment().format("YYYY");
      this.$store
        .dispatch("classes/deleteClass", {
          week: week,
          year: year,
          program: this.program,
          class: {
            hour: this.timeKey,
            day: this.day,
            index: this.index
          }
        })
        .then((response) => {
          alert(response.message);
          this.$store
            .dispatch("classes/doGetSchedules", {
              year: year,
              week: week,
              program: this.program
            })
            .catch((error) => {
              alert(error);
            });
          this.close();
        })
        .catch((error) => {
          alert(error);
        })
        .finally(() => {
          this.$store.dispatch("loading", false);
        });
    },
    save() {
      this.$store.dispatch("loading", true);
      const week = moment().format("WW");
      const year = moment().format("YYYY");

      if (this.edit) {
        this.$store
          .dispatch("classes/updateClass", {
            week: week,
            year: year,
            program: this.program,
            class: {
              hour: this.timeKey,
              day: this.day,
              index: this.index,
              info: this.classInfo
            }
          })
          .then((response) => {
            alert(response.message);
            this.$store
              .dispatch("classes/doGetSchedules", {
                year: year,
                week: week,
                program: this.program
              })
              .catch((error) => {
                alert(error);
              });
            this.close();
          })
          .catch((error) => {
            alert(error);
          })
          .finally(() => {
            this.$store.dispatch("loading", false);
          });
      } else {
        this.$store
          .dispatch("classes/addClass", {
            week: week,
            year: year,
            program: this.program,
            class: {
              hour: moment(this.time, "HH:mm").format("hh:mma"),
              day: this.dayOfWeek,
              index: 0,
              info: this.classInfo
            }
          })
          .then((response) => {
            alert(response.message);
            this.$store
              .dispatch("classes/doGetSchedules", {
                year: year,
                week: week,
                program: this.program
              })
              .catch((error) => {
                alert(error);
              });
            this.close();
          })
          .catch((error) => {
            alert(error);
          })
          .finally(() => {
            this.$store.dispatch("loading", false);
          });
      }
    },
    selectImage() {
      const inputImage = document.getElementById(
        "inUploadPicture"
      ) as HTMLInputElement;
      inputImage.click();
    },
    uploadImage(e: any) {
      if (e.target.files.length) {
        if (e.target.files[0].size > 5000000) {
          alert("Seleccione una imagen de máximo 5 MB");
          return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
          if (e?.target?.result) {
            this.classInfo.imageUrl = e.target.result as string;
            this.hasImage = true;
          }
        };
        reader.readAsDataURL(e.target.files[0]);
      }
    }
  }
});
</script>

<style lang="scss" scoped>
.row {
  padding: 0px 10px 15px 10px !important;
}

.modal-backdrop {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.8) !important;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000 !important;
}

.modal {
  background: #ffffff;
  /*box-shadow: 2px 2px 20px 1px;
  overflow-x: auto;*/
  display: flex !important;
  flex-direction: column;
  height: auto !important;
  //height: 50% !important;
  /*width: 80% !important;
  margin: 5% 25% 5% 25%;*/
}

@media screen and (max-width: 700px) {
  .modal {
    width: 80% !important;
    margin: 5% 10% 5% 10%;
  }
}

@media screen and (min-width: 701px) {
  .modal {
    width: 50% !important;
    margin: 5% 25% 5% 25%;
  }
}

.modal-header,
.modal-footer {
  padding: 15px;
  display: flex;
}

.modal-header {
  border-bottom: 1px solid #eeeeee;
  justify-content: space-between;
  /*color: $gray-700;*/
}

.modal-footer {
  border-top: 1px solid #eeeeee;
  justify-content: flex-end;
}

.modal-body {
  position: relative;
  padding: 20px 10px;
}

.btn-close {
  border: none;
  font-size: 20px;
  padding: 20px;
  cursor: pointer;
  font-weight: bold;
  color: #4aae9b;
  background: transparent;
}
</style>
