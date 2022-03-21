<template>
  <div class="d-flex flex-column">
    <div class="card">
      <div class="card-header d-flex justify-content-between">
        <h5 class="card-title text-secondary mb-0">
          <i class="fas fa-user-circle fa-fw me-2"></i>
          <span>Información Personal</span>
        </h5>
        <div>
          <div v-if="editMode">
            <button
              @click="cancelEdit()"
              class="btn btn-sm btn-outline-danger me-2"
            >
              <i class="fas fa-ban fa-fw me-1"></i>Cancelar
            </button>
            <button
              @click="save()"
              :disabled="saving"
              class="btn btn-sm btn-outline-success"
            >
              <i class="fas fa-save fa-fw me-1"></i>Guardar
              <i v-if="saving" class="fas fa-spinner fa-spin ms-1"></i>
            </button>
          </div>
          <div v-else>
            <button @click="edit()" class="btn btn-sm btn-outline-secondary">
              <i class="fas fa-pen fa-fw"></i>
            </button>
          </div>
        </div>
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-12 mb-3">
            <div class="form-floating">
              <input
                type="text"
                class="form-control fs-3 fw-bold text-center"
                :class="readOnlyClasses"
                id="names"
                ref="names"
                placeholder="Nombre(s)"
                v-model="localPersonalInfo.names"
                :disabled="!editMode"
                :readonly="!editMode"
              />
              <label for="names" class="opacity-100">Nombre(s)</label>
            </div>
          </div>
          <div class="col-12 col-md-6 mb-3">
            <div class="form-floating">
              <input
                type="text"
                class="form-control fs-3 fw-bold text-center"
                :class="readOnlyClasses"
                id="lastName"
                placeholder="Apellido Paterno"
                v-model="localPersonalInfo.lastName"
                :disabled="!editMode"
                :readonly="!editMode"
              />
              <label for="lastName" class="opacity-100">Apellido Paterno</label>
            </div>
          </div>
          <div class="col-12 col-md-6 mb-3">
            <div class="form-floating">
              <input
                type="text"
                class="form-control fs-3 fw-bold text-center"
                :class="readOnlyClasses"
                id="motherSurname"
                placeholder="Apellido Materno"
                v-model="localPersonalInfo.motherLastname"
                :disabled="!editMode"
                :readonly="!editMode"
              />
              <label for="motherSurname" class="opacity-100">
                Apellido Materno
              </label>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-12 col-md-6 mb-3">
            <div class="input-group">
              <input
                type="radio"
                class="btn-check"
                name="gender"
                id="male"
                autocomplete="off"
                value="male"
                v-model="localPersonalInfo.gender"
                :disabled="!editMode"
                :readonly="!editMode"
              />
              <label
                class="btn btn-outline-info rounded-start py-2 col"
                :class="{ 'opacity-100': localPersonalInfo.gender == 'male' }"
                for="male"
              >
                <i class="fas fa-male fa-fw"></i>
                <div class="lh-1 text-truncate">
                  Masculino
                </div>
              </label>
              <button
                v-if="editMode"
                class="btn btn-outline-secondary px-0 col-2"
                type="button"
                id="clear-gender"
                @click="localPersonalInfo.gender = ''"
                :disabled="!editMode"
                :readonly="!editMode"
              >
                <i class="far fa-times-circle fa-fw"></i>
              </button>
              <input
                type="radio"
                class="btn-check"
                name="gender"
                id="female"
                autocomplete="off"
                value="female"
                v-model="localPersonalInfo.gender"
                :disabled="!editMode"
                :readonly="!editMode"
              />
              <label
                class="btn btn-outline-pink py-2 col"
                :class="{ 'opacity-100': localPersonalInfo.gender == 'female' }"
                for="female"
              >
                <i class="fas fa-female fa-fw ms-1 mb-0"></i>
                <div class="lh-1 text-truncate">
                  Femenino
                </div>
              </label>
            </div>
          </div>
          <div class="col-12 col-md-6 mb-3">
            <div class="form-floating">
              <input
                type="date"
                class="form-control text-center"
                :class="readOnlyClasses"
                id="dateOfBirth"
                placeholder="Fecha de Nacimiento"
                v-model="localPersonalInfo.dateOfBirth"
                :disabled="!editMode"
                :readonly="!editMode"
              />
              <label for="dateOfBirth" class="opacity-100"
                >Fecha de Nacimiento</label
              >
            </div>
          </div>
        </div>
        <div class="row d-none">
          <div class="col-12">
            <div class="form-floating">
              <input
                type="text"
                class="form-control text-center"
                :class="readOnlyClasses"
                id="curp"
                placeholder="CURP"
                v-model="localPersonalInfo.curp"
                :disabled="!editMode"
                :readonly="!editMode"
              />
              <label for="curp" class="opacity-100">CURP</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { PersonalInfo } from "@/store/Profile/ProfileInterfaces";
import { defineComponent } from "vue";
import { mapActions } from "vuex";

export default defineComponent({
  name: "peronsal-info",
  props: {
    personalInfo: {
      type: Object as () => PersonalInfo,
      default: {} as PersonalInfo,
      required: true
    }
  },
  data() {
    return {
      editMode: false,
      localPersonalInfo: {},
      saving: false
    };
  },
  computed: {
    readOnlyClasses(): any {
      return {
        "bg-light": this.editMode,
        "bg-body": !this.editMode,
        "bg-gradient": !this.editMode,
        "text-secondary": !this.editMode
      };
    }
  },
  methods: {
    ...mapActions("profile", ["doUpdateUserPersonalInfo"]),
    edit() {
      this.editMode = true;
      this.$nextTick(() => (this.$refs.names as HTMLInputElement).select());
    },
    save() {
      //call Save Personal Info function
      this.saving = true;
      const dob = (this.localPersonalInfo as PersonalInfo).dateOfBirth || "";
      if (dob != "") {
        const date = new Date(dob);
        (this
          .localPersonalInfo as PersonalInfo).dateOfBirth = date
          .toISOString()
          .substring(0, 10);
      }

      this.doUpdateUserPersonalInfo(this.localPersonalInfo)
        .then(() => {
          this.editMode = false;
        })
        .catch((error: any) => {
          alert(error);
        })
        .finally(() => {
          this.saving = false;
        });
    },
    cancelEdit() {
      this.editMode = false;
      this.localPersonalInfo = { ...this.personalInfo };
    }
  },
  mounted() {
    this.localPersonalInfo = { ...this.personalInfo };
  },
  watch: {
    personalInfo: {
      handler(newValue: PersonalInfo) {
        this.localPersonalInfo = { ...newValue };
      },
      immediate: true
    }
  }
});
</script>
