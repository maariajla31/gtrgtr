<template>
  <div class="d-flex flex-column">
    <div class="card">
      <div class="card-header d-flex justify-content-between">
        <h5 class="card-title text-info mb-0">
          <i class="fas fa-home fa-fw me-2"></i>
          <span>Dirección</span>
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
                class="form-control text-center"
                :class="readOnlyClasses"
                id="street"
                ref="street"
                placeholder="Calle y Número"
                v-model="localAddress.street"
                :disabled="!editMode"
                :readonly="!editMode"
              />
              <label for="street" class="opacity-100">Calle y Número</label>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-12 col-md-6 mb-3">
            <div class="form-floating">
              <input
                type="text"
                class="form-control text-center"
                :class="readOnlyClasses"
                id="neighborhood"
                placeholder="Colonia"
                v-model="localAddress.neighborhood"
                :disabled="!editMode"
                :readonly="!editMode"
              />
              <label for="neighborhood" class="opacity-100">Colonia</label>
            </div>
          </div>
          <div class="col-12 col-md-6 mb-3">
            <div class="form-floating">
              <input
                type="text"
                class="form-control text-center"
                :class="readOnlyClasses"
                id="city"
                placeholder="Ciudad"
                v-model="localAddress.city"
                :disabled="!editMode"
                :readonly="!editMode"
              />
              <label for="city" class="opacity-100">Ciudad</label>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-12 col-md-4 mb-3">
            <div v-if="!editMode">
              <div class="form-floating d-flex">
                <input
                  type="text"
                  class="form-control text-center"
                  :class="readOnlyClasses"
                  style="color: transparent !important;"
                  id="country"
                  placeholder="País"
                  v-model="displayedCountry.spanish"
                  :disabled="!editMode"
                  :readonly="!editMode"
                />
                <label for="country" class="opacity-100">País</label>
                <div
                  v-if="displayedCountry.alpha2Code"
                  class="position-absolute col-12 px-2 d-flex flex-row justify-content-center mt-4 overflow-hidden"
                >
                  <div
                    class="d-flex flex-row align-items-center text-secondary text-truncate"
                  >
                    <span class="flag-box mt-1">
                      <span
                        :class="'d-block flag ' + displayedCountry.alpha2Code"
                      ></span>
                    </span>
                    <span class="country-name ms-2 ">
                      {{ displayedCountry.spanish }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="form-floating btn-group flex-fill d-flex">
              <input
                class="form-control flex-fill d-flex rounded-0 rounded-start text-center"
                :class="readOnlyClasses"
                type="text"
                id="address-country"
                style="color: transparent !important;"
                placeholder="País"
                v-model="displayedCountry.spanish"
              />
              <div
                v-if="displayedCountry.alpha2Code"
                class="position-absolute col-10 px-2 d-flex flex-row justify-content-center mt-4 overflow-hidden"
              >
                <div
                  class="d-flex flex-row align-items-center text-secondary text-truncate"
                >
                  <span class="flag-box mt-1">
                    <span
                      :class="'d-block flag ' + displayedCountry.alpha2Code"
                    ></span>
                  </span>
                  <span class="country-name ms-2">
                    {{ displayedCountry.spanish }}
                  </span>
                </div>
              </div>

              <button
                type="button"
                class="col-2 btn btn-outline-secondary dropdown-toggle dropdown-toggle-split d-flex justify-content-center align-items-center"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <span class="visually-hidden">Abrir Lista de Paises</span>
              </button>
              <ul class="dropdown-menu scrollable-menu dropdown-menu-end">
                <li @click="setDisplayedCountry({})">
                  <button
                    class="dropdown-item country text-muted"
                    id="item-tlgm-clear"
                  >
                    <span class="row">
                      <span class="dial-code text-center col-2 ps-0">
                        <i class="far fa-trash-alt fa-fw"></i>
                      </span>
                      <span
                        class="col d-flex flex-row align-items-center fw-lighter ps-0"
                      >
                        <span class="country-name ms-2 ">
                          Limpiar
                        </span>
                      </span>
                    </span>
                  </button>
                </li>
                <template
                  v-for="country in starredCountries"
                  :key="country.alpha3code"
                >
                  <li @click="setDisplayedCountry(country)">
                    <button
                      class="dropdown-item country"
                      :id="
                        'item-' +
                          country.alpha2Code.toLowerCase() +
                          '-preferred'
                      "
                    >
                      <span
                        class="col d-flex flex-row align-items-center fw-lighter ps-0"
                      >
                        <span class="flag-box mt-1">
                          <span
                            :class="'d-block flag ' + country.alpha2Code"
                          ></span>
                        </span>
                        <span class="country-name ms-2 ">
                          {{ country.spanish }}
                        </span>
                      </span>
                    </button>
                  </li>
                </template>
              </ul>
              <label for="country" class="opacity-100">País</label>
            </div>
          </div>
          <div class="col-12 col-md-4 mb-3">
            <div class="form-floating">
              <input
                type="text"
                class="form-control text-center"
                :class="readOnlyClasses"
                id="state"
                placeholder="Estado"
                v-model="localAddress.state"
                :disabled="!editMode"
                :readonly="!editMode"
              />
              <label for="state" class="opacity-100">Estado</label>
            </div>
          </div>
          <div class="col-12 col-md-4 mb-3">
            <div class="form-floating">
              <input
                type="text"
                class="form-control text-center"
                :class="readOnlyClasses"
                id="zipcode"
                placeholder="Código Postal"
                v-model="localAddress.zipCode"
                :disabled="!editMode"
                :readonly="!editMode"
              />
              <label for="zipcode" class="opacity-100">Código Postal</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Address } from "@/store/Profile/ProfileInterfaces";
import { Country } from "@/store/System/SystemConfigInterfaces";
import { defineComponent } from "vue";
import { mapActions, mapGetters } from "vuex";

export default defineComponent({
  name: "profile-address",
  props: {
    addressInfo: {
      type: Object as () => Address,
      default: {} as Address,
      required: true
    }
  },
  data() {
    return {
      editMode: false,
      localAddress: {} as Address,
      displayedCountry: {} as Country,
      saving: false
    };
  },
  computed: {
    ...mapGetters("sys", [
      "getEnabledCountries",
      "getStarredCountries",
      "getCountryByAlpha3Code"
    ]),
    readOnlyClasses(): any {
      return {
        "bg-light": this.editMode,
        "bg-body": !this.editMode,
        "bg-gradient": !this.editMode,
        "text-secondary": !this.editMode
      };
    },
    starredCountries(): Array<Country> {
      const starred = this.getStarredCountries
        .filter((country: Country) => {
          return country.enabled === true;
        })
        .sort((a: Country, b: Country) => {
          if (a.priority === b.priority) {
            return a.spanish.localeCompare(b.spanish);
          } else {
            return a.priority - b.priority;
          }
        });
      return starred;
    },
    enabledCountries(): Array<Country> {
      const enabled = this.getEnabledCountries
        .filter((country: Country) => {
          return country.enabled === true;
        })
        .sort((a: Country, b: Country) => {
          return a.spanish.localeCompare(b.spanish);
        });
      return enabled;
    }
  },
  methods: {
    ...mapActions("profile", ["doUpdateUserAddressInfo"]),
    edit() {
      this.editMode = true;
      this.$nextTick(() => (this.$refs.street as HTMLInputElement).select());
    },
    save() {
      //call Save Address Info function
      this.saving = true;
      this.doUpdateUserAddressInfo(this.localAddress)
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
      this.localAddress = { ...this.addressInfo };
      this.displayedCountry = {
        ...this.getCountryByAlpha3Code(this.localAddress.country)
      };
    },
    setDisplayedCountry(country: Country) {
      this.localAddress.country = country.alpha3Code;
      this.displayedCountry = { ...country };
    }
  },
  mounted() {
    this.localAddress = { ...this.addressInfo };
    this.displayedCountry = {
      ...this.getCountryByAlpha3Code(this.localAddress.country)
    };
  },
  watch: {
    addressInfo: {
      handler(newValue: Address) {
        this.localAddress = { ...newValue };
        this.displayedCountry = {
          ...this.getCountryByAlpha3Code(this.localAddress.country)
        };
      },
      immediate: true
    }
  }
});
</script>
