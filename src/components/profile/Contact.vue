<template>
  <div class="d-flex flex-column" v-if="localContactInfo">
    <div class="card">
      <div class="card-header d-flex justify-content-between">
        <h5 class="card-title text-success mb-0">
          <i class="far fa-comment fa-fw me-2"></i>
          <span>Datos de Contacto</span>
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
              class="btn btn-sm btn-outline-success"
              :disabled="!canSave || saving"
              @click="save()"
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
          <!-- Email -->
          <div class="col-12 mb-2">
            <div class="input-group">
              <div class="form-floating col">
                <input
                  type="text"
                  class="form-control fw-bold text-center rounded-0 rounded-start"
                  :class="readOnlyClasses"
                  id="email"
                  placeholder="E-mail"
                  ref="email"
                  v-model="localContactInfo.email.data"
                  :disabled="!editMode"
                  :readonly="!editMode"
                />
                <label for="email" class="opacity-100">
                  <i class="far fa-envelope fa-fw me-1"></i>
                  <span class="">
                    E-mail
                  </span>
                </label>
              </div>
              <div
                class="input-group-text text-center flex-column pb-0"
                :class="readOnlyClasses"
                id="share-email"
              >
                <label class="form-check-label small" for="share-email">
                  Visible
                </label>
                <div class="form-check form-switch ps-0">
                  <input
                    class="form-check-input mt-0 ms-0 secondary"
                    type="checkbox"
                    role="switch"
                    id="share-email"
                    v-model="localContactInfo.email.visible"
                    :disabled="!editMode"
                    :readonly="!editMode"
                  />
                </div>
              </div>
            </div>
          </div>
          <!-- Celular -->
          <div class="col-12 mb-2">
            <div class="input-group" id="celuar-input-group">
              <div
                v-if="!editMode"
                class="input-group-text text-center col-3 col-sm-2"
                :class="readOnlyClasses"
                id="mobile-dial-code-label"
              >
                <span class="w-100 small">
                  {{ localContactInfo.mobile.data.dialCode }}
                </span>
              </div>
              <button
                v-else
                class="btn btn-outline-secondary dropdown-toggle col-3 col-sm-2 pe-xl-1"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                id="celular-intl-code"
              >
                <span class="small d-inline-block w-75">
                  {{ localContactInfo.mobile.data.dialCode }}
                </span>
              </button>
              <ul class="dropdown-menu scrollable-menu">
                <li @click="localContactInfo.mobile.data.dialCode = ''">
                  <button
                    class="country text-muted dropdown-item"
                    id="item-mobile-clear"
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
                  v-for="country in countriesWithDialCodes"
                  :key="country.alpha3code"
                >
                  <li
                    @click="
                      localContactInfo.mobile.data.dialCode = country.dialCode
                    "
                  >
                    <button
                      class="dropdown-item country"
                      :id="
                        'item-' +
                          country.alpha2Code.toLowerCase() +
                          '-preferred'
                      "
                    >
                      <span class="row">
                        <span class="dial-code text-end col-2 ps-0">
                          {{ country.dialCode }}
                        </span>
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
                      </span>
                    </button>
                  </li>
                </template>
              </ul>
              <div class="form-floating col-9 col-sm">
                <input
                  type="text"
                  class="form-control fw-bold text-center rounded-0"
                  :class="readOnlyClasses"
                  id="celular-number"
                  placeholder="Celular"
                  v-model="localContactInfo.mobile.data.number"
                  :disabled="!editMode"
                  :readonly="!editMode"
                />
                <label for="mobile" class="opacity-100">
                  <i class="fas fa-mobile-alt fa-fw me-1"></i>
                  <span class="">
                    Celular
                  </span>
                </label>
              </div>
              <div
                class="input-group-text col col-sm-3 flex-column py-0 justify-content-center align-items-start"
                :class="readOnlyClasses"
                id="same-number"
              >
                <div class="form-check form-switch text-truncate mb-0 lh-sm">
                  <input
                    class="form-check-input whatsapp-color"
                    type="checkbox"
                    role="switch"
                    id="whatsapp"
                    v-model="localContactInfo.mobile.whatsapp"
                    :disabled="!editMode"
                    :readonly="!editMode"
                    @click="sameForWhatsapp()"
                  />
                  <label
                    class="form-check-label small opacity-100"
                    for="whatsapp"
                    >Whatsapp</label
                  >
                </div>
                <div class="form-check form-switch text-truncate mb-0 lh-sm">
                  <input
                    class="form-check-input telegram-color"
                    type="checkbox"
                    role="switch"
                    id="whatsapp"
                    v-model="localContactInfo.mobile.telegram"
                    :disabled="!editMode"
                    :readonly="!editMode"
                    @click="sameForTelegram()"
                  />
                  <label
                    class="form-check-label small opacity-100"
                    for="telegram"
                    >Telegram</label
                  >
                </div>
              </div>
              <div
                class="input-group-text text-center flex-column pb-0"
                :class="readOnlyClasses"
                id="share-mobile"
              >
                <label class="form-check-label small" for="share-mobile">
                  Visible
                </label>
                <div class="form-check form-switch ps-0">
                  <input
                    class="form-check-input mt-0 ms-0 secondary"
                    type="checkbox"
                    role="switch"
                    id="share-mobile"
                    v-model="localContactInfo.mobile.visible"
                    :disabled="!editMode"
                    :readonly="!editMode"
                  />
                </div>
              </div>
            </div>
          </div>
          <!-- Whatsapp -->
          <div class="col-12 col-xxl-6 mb-2">
            <div class="input-group">
              <div
                v-if="!editMode || localContactInfo.mobile.whatsapp"
                class="input-group-text text-center col-3 col-sm-2"
                :class="readOnlyClassesExtra"
                id="mobile-dial-code-label"
              >
                <span class="w-100 small">
                  {{ localContactInfo.whatsapp.data.dialCode }}
                </span>
              </div>
              <button
                v-else
                class="btn btn-outline-secondary dropdown-toggle col-3 col-sm-2 col-xxl-3 pe-xl-1"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <span class="small d-inline-block w-75">
                  {{ localContactInfo.whatsapp.data.dialCode }}
                </span>
              </button>
              <ul class="dropdown-menu scrollable-menu">
                <li @click="localContactInfo.whatsapp.data.dialCode = ''">
                  <button
                    class="dropdown-item country text-muted"
                    id="item-whats-clear"
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
                  v-for="country in countriesWithDialCodes"
                  :key="country.alpha3code"
                >
                  <li
                    @click="
                      localContactInfo.whatsapp.data.dialCode = country.dialCode
                    "
                  >
                    <button
                      class="dropdown-item country"
                      :id="
                        'item-' +
                          country.alpha2Code.toLowerCase() +
                          '-preferred'
                      "
                    >
                      <span class="row">
                        <span class="dial-code text-end col-2 ps-0">
                          {{ country.dialCode }}
                        </span>
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
                      </span>
                    </button>
                  </li>
                </template>
              </ul>
              <div class="form-floating col">
                <input
                  type="text"
                  class="form-control fw-bold text-center rounded-0"
                  :class="readOnlyClassesExtra"
                  id="whatsapp"
                  placeholder="Whatsapp"
                  v-model="localContactInfo.whatsapp.data.number"
                  :disabled="!editMode || localContactInfo.mobile.whatsapp"
                  :readonly="!editMode || localContactInfo.mobile.whatsapp"
                />
                <label for="whatsapp" class="opacity-100">
                  <i class="fab fa-whatsapp fa-fw me-1"></i>
                  <span class="">
                    Whatsapp
                  </span>
                </label>
              </div>
              <div
                class="input-group-text text-center flex-column pb-0"
                :class="readOnlyClasses"
                id="share-whatsapp"
              >
                <label class="form-check-label small" for="share-whatsapp">
                  Visible
                </label>
                <div class="form-check form-switch ps-0">
                  <input
                    class="form-check-input mt-0 ms-0 secondary"
                    type="checkbox"
                    role="switch"
                    id="share-whatsapp"
                    v-model="localContactInfo.whatsapp.visible"
                    :disabled="!editMode"
                    :readonly="!editMode"
                  />
                </div>
              </div>
            </div>
          </div>
          <!-- Telegram -->
          <div class="col-12 col-xxl-6 mb-2">
            <div class="input-group">
              <div
                v-if="!editMode || localContactInfo.mobile.telegram"
                class="input-group-text text-center col-3 col-sm-2"
                :class="readOnlyClassesExtra"
                id="mobile-dial-code-label"
              >
                <span class="w-100 small">
                  {{ localContactInfo.telegram.data.dialCode }}
                </span>
              </div>
              <button
                v-else
                class="btn btn-outline-secondary dropdown-toggle col-3 col-sm-2 col-xxl-3 pe-xl-1"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <span class="small d-inline-block w-75">
                  {{ localContactInfo.telegram.data.dialCode }}
                </span>
              </button>
              <ul class="dropdown-menu scrollable-menu">
                <li @click="localContactInfo.telegram.data.dialCode = ''">
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
                <li @click="localContactInfo.telegram.data.dialCode = '@'">
                  <button class="dropdown-item country" id="item-tlgm-username">
                    <span class="row">
                      <span class="dial-code text-center col-2 ps-0">
                        @
                      </span>
                      <span
                        class="col d-flex flex-row align-items-center fw-lighter ps-0"
                      >
                        <span class="country-name ms-2 ">
                          Nombre de usuario
                        </span>
                      </span>
                    </span>
                  </button>
                </li>
                <template
                  v-for="country in countriesWithDialCodes"
                  :key="country.alpha3code"
                >
                  <li
                    @click="
                      localContactInfo.telegram.data.dialCode = country.dialCode
                    "
                  >
                    <button
                      class="dropdown-item country"
                      :id="
                        'item-' +
                          country.alpha2Code.toLowerCase() +
                          '-preferred'
                      "
                    >
                      <span class="row">
                        <span class="dial-code text-end col-2 ps-0">
                          {{ country.dialCode }}
                        </span>
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
                      </span>
                    </button>
                  </li>
                </template>
              </ul>
              <div class="form-floating col">
                <input
                  type="text"
                  class="form-control fw-bold text-center rounded-0"
                  :class="readOnlyClassesExtra"
                  id="telegram"
                  placeholder="Telegram"
                  v-model="localContactInfo.telegram.data.number"
                  :disabled="!editMode || localContactInfo.mobile.telegram"
                  :readonly="!editMode || localContactInfo.mobile.telegram"
                />
                <label for="telegram" class="opacity-100">
                  <i class="fab fa-telegram fa-fw me-1"></i>
                  <span class="">
                    Telegram
                  </span>
                </label>
              </div>
              <div
                class="input-group-text text-center flex-column pb-0"
                :class="readOnlyClasses"
                id="share-telegram"
              >
                <label class="form-check-label small" for="share-telegram">
                  Visible
                </label>
                <div class="form-check form-switch ps-0">
                  <input
                    class="form-check-input mt-0 ms-0 secondary"
                    type="checkbox"
                    role="switch"
                    id="share-telegram"
                    v-model="localContactInfo.telegram.visible"
                    :disabled="!editMode"
                    :readonly="!editMode"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <hr />
        <div class="row">
          <div class="col-12 mb-2">
            <div class="input-group">
              <div class="form-floating col">
                <input
                  type="text"
                  class="form-control text-center rounded-0 rounded-start"
                  :class="readOnlyClasses"
                  id="instagram"
                  placeholder="Instragram"
                  v-model="localContactInfo.instagram.data"
                  :disabled="!editMode"
                  :readonly="!editMode"
                />
                <label for="mobile" class="opacity-100">
                  <i class="fab fa-instagram fa-fw me-1"></i>
                  <span class="">
                    Instagram
                  </span>
                </label>
              </div>
              <div
                class="input-group-text text-center flex-column pb-0"
                :class="readOnlyClasses"
                id="share-instagram"
              >
                <label class="form-check-label small" for="share-instagram">
                  Visible
                </label>
                <div class="form-check form-switch ps-0">
                  <input
                    class="form-check-input mt-0 ms-0 secondary"
                    type="checkbox"
                    role="switch"
                    id="share-instagram"
                    v-model="localContactInfo.instagram.visible"
                    :disabled="!editMode"
                    :readonly="!editMode"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="col-12 col-xl-6 mb-2">
            <div class="input-group">
              <div class="form-floating col">
                <input
                  type="text"
                  class="form-control text-center rounded-0 rounded-start"
                  :class="readOnlyClasses"
                  id="tiktok"
                  placeholder="Tiktok"
                  v-model="localContactInfo.tiktok.data"
                  :disabled="!editMode"
                  :readonly="!editMode"
                />
                <label for="tiktok" class="opacity-100">
                  <i class="fab fa-tiktok fa-fw me-1"></i>
                  <span class="">
                    Tiktok
                  </span>
                </label>
              </div>
              <div
                class="input-group-text text-center flex-column pb-0"
                :class="readOnlyClasses"
                id="share-tiktok"
              >
                <label class="form-check-label small" for="share-tiktok">
                  Visible
                </label>
                <div class="form-check form-switch ps-0">
                  <input
                    class="form-check-input mt-0 ms-0 secondary"
                    type="checkbox"
                    role="switch"
                    id="share-tiktok"
                    v-model="localContactInfo.tiktok.visible"
                    :disabled="!editMode"
                    :readonly="!editMode"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="col-12 col-xl-6 mb-2">
            <div class="input-group">
              <div class="form-floating col">
                <input
                  type="text"
                  class="form-control text-center rounded-0 rounded-start"
                  :class="readOnlyClasses"
                  id="facebook"
                  placeholder="Facebook"
                  v-model="localContactInfo.facebook.data"
                  :disabled="!editMode"
                  :readonly="!editMode"
                />
                <label for="facebook" class="opacity-100">
                  <i class="fab fa-facebook fa-fw me-1"></i>
                  <span class="">
                    Facebook
                  </span>
                </label>
              </div>
              <div
                class="input-group-text text-center flex-column pb-0"
                :class="readOnlyClasses"
                id="share-facebook"
              >
                <label class="form-check-label small" for="share-facebook">
                  Visible
                </label>
                <div class="form-check form-switch ps-0">
                  <input
                    class="form-check-input mt-0 ms-0 secondary"
                    type="checkbox"
                    role="switch"
                    id="share-facebook"
                    v-model="localContactInfo.facebook.visible"
                    :disabled="!editMode"
                    :readonly="!editMode"
                  />
                </div>
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
import { Contact, SecuredDataRequest } from "@/store/Profile/ProfileInterfaces";
import { mapActions, mapGetters } from "vuex";
import { Country } from "@/store/System/SystemConfigInterfaces";

export default defineComponent({
  name: "contact",
  props: {
    contactInfo: {
      type: Object as () => Contact,
      default: {} as Contact,
      required: false
    },
    registrationDate: {
      type: Date,
      default: new Date(0),
      required: true
    },
    updated: {
      type: Boolean,
      default: false,
      required: true
    },
    error: {
      type: Boolean,
      default: false,
      required: true
    }
  },
  data() {
    return {
      editMode: false,
      localContactInfo: {
        email: {
          data: "",
          visible: true
        },
        mobile: {
          data: {
            dialCode: "",
            number: ""
          },
          whatsapp: false,
          telegram: false,
          visible: false
        },
        telegram: {
          data: {
            dialCode: "",
            number: ""
          },
          visible: false
        },
        whatsapp: {
          data: {
            dialCode: "",
            number: ""
          },
          visible: false
        },
        instagram: {
          data: "",
          visible: false
        },
        tiktok: {
          data: "",
          visible: false
        },
        facebook: {
          data: "",
          visible: false
        }
      } as Contact,
      saving: false
    };
  },
  emits: ["saveSecuredData", "error"],
  computed: {
    ...mapGetters("sys", ["getStarredCountries"]),
    countriesWithDialCodes(): Array<Country> {
      const starred = this.getStarredCountries
        .filter((country: Country) => {
          return (
            country.enabled === true &&
            country.dialCode &&
            country.dialCode !== ""
          );
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
    canSave(): boolean {
      return (
        this.localContactInfo.email.data !== this.contactInfo.email.data ||
        this.localContactInfo.email.visible !==
          this.contactInfo.email.visible ||
        this.localContactInfo.mobile?.data.dialCode !==
          this.contactInfo.mobile?.data.dialCode ||
        this.localContactInfo.mobile?.data.number !==
          this.contactInfo.mobile?.data.number ||
        this.localContactInfo.mobile?.whatsapp !==
          this.contactInfo.mobile?.whatsapp ||
        this.localContactInfo.mobile?.telegram !==
          this.contactInfo.mobile?.telegram ||
        this.localContactInfo.mobile?.visible !==
          this.contactInfo.mobile?.visible ||
        this.localContactInfo.whatsapp?.data.dialCode !==
          this.contactInfo.whatsapp?.data.dialCode ||
        this.localContactInfo.whatsapp?.data.number !==
          this.contactInfo.whatsapp?.data.number ||
        this.localContactInfo.whatsapp?.visible !==
          this.contactInfo.whatsapp?.visible ||
        this.localContactInfo.telegram?.data.dialCode !==
          this.contactInfo.telegram?.data.dialCode ||
        this.localContactInfo.telegram?.data.number !==
          this.contactInfo.telegram?.data.number ||
        this.localContactInfo.telegram?.visible !==
          this.contactInfo.telegram?.visible ||
        this.localContactInfo.instagram?.data !==
          this.contactInfo.instagram?.data ||
        this.localContactInfo.tiktok?.data !== this.contactInfo.tiktok?.data ||
        this.localContactInfo.facebook?.data !==
          this.contactInfo.facebook?.data ||
        this.localContactInfo.instagram?.visible !==
          this.contactInfo.instagram?.visible ||
        this.localContactInfo.tiktok?.visible !==
          this.contactInfo.tiktok?.visible ||
        this.localContactInfo.facebook?.visible !==
          this.contactInfo.facebook?.visible
      );
    },
    readOnlyClasses(): any {
      return {
        "bg-light": this.editMode,
        "bg-body": !this.editMode,
        "bg-gradient": !this.editMode,
        "text-secondary": !this.editMode
      };
    },
    readOnlyClassesExtra(): any {
      return {
        "bg-light": this.editMode,
        "bg-body": !this.editMode || this.localContactInfo.mobile?.whatsapp,
        "bg-gradient": !this.editMode || this.localContactInfo.mobile?.whatsapp,
        "text-secondary":
          !this.editMode || this.localContactInfo.mobile?.whatsapp
      };
    }
  },
  methods: {
    ...mapActions("profile", ["doUpdateUserContactInfo"]),
    edit() {
      this.editMode = true;
      // Patch because this.$nextTick() doesn't work when emits are used
      setTimeout((): void => {
        (this.$refs.email as HTMLInputElement).select();
      }, 200);
    },
    save() {
      this.saving = true;
      const hoursSinceRegistration =
        Math.abs(
          new Date(this.registrationDate).getTime() - new Date().getTime()
        ) / 36e5;

      // if email is the same or the
      // change is less than 26 hours
      // then update without confirmation code
      // eslint-disable-next-line no-constant-condition
      if (
        this.localContactInfo.email.data === this.contactInfo.email.data ||
        (this.localContactInfo.email.data !== this.contactInfo.email.data &&
          hoursSinceRegistration < 26)
      ) {
        this.doUpdateUserContactInfo(this.localContactInfo)
          .then(() => {
            this.editMode = false;
          })
          .catch((error: any) => {
            if (error.name && error.name != "") {
              if (error.name === "CONFIRMATION_CODE_REQUIRED") {
                this.saveSecuredData();
              } else {
                this.$emit("error", error);
              }
            } else {
              this.$emit("error", error);
            }
          })
          .finally(() => {
            this.saving = false;
          });
      } else {
        this.saveSecuredData();
      }
    },
    saveSecuredData() {
      this.$emit("saveSecuredData", {
        type: "email",
        data: this.localContactInfo,
        requestId: "",
        requestTag: ""
      } as SecuredDataRequest);
    },
    cancelEdit() {
      this.setLocalContactInfo(this.contactInfo);
      this.editMode = false;
    },
    setLocalContactInfo(newValue: Contact) {
      this.localContactInfo = {
        ...this.localContactInfo,
        ...(JSON.parse(JSON.stringify(newValue)) as Contact)
      };
      if (this.localContactInfo.mobile?.whatsapp) {
        this.localContactInfo.whatsapp = {
          data: this.localContactInfo.mobile.data,
          visible: this.localContactInfo.whatsapp
            ? this.localContactInfo.whatsapp.visible
            : false
        };
      }

      if (this.localContactInfo.mobile?.telegram) {
        this.localContactInfo.telegram = {
          data: this.localContactInfo.mobile.data,
          visible: this.localContactInfo.telegram
            ? this.localContactInfo.telegram.visible
            : false
        };
      }
    },
    sameForWhatsapp() {
      if (
        !this.localContactInfo.mobile?.whatsapp &&
        this.localContactInfo.mobile?.data.dialCode
      ) {
        this.localContactInfo.whatsapp = {
          data: this.localContactInfo.mobile.data,
          visible: this.localContactInfo.whatsapp
            ? this.localContactInfo.whatsapp.visible
            : this.localContactInfo.mobile.visible
        };
      } else {
        this.localContactInfo.whatsapp = {
          ...this.contactInfo.whatsapp,
          data: {
            ...(this.contactInfo.whatsapp?.data || {
              dialCode: "",
              number: ""
            })
          },
          visible: this.contactInfo.whatsapp
            ? this.contactInfo.whatsapp.visible
            : false
        };
      }
    },
    sameForTelegram() {
      if (
        !this.localContactInfo.mobile?.telegram &&
        this.localContactInfo.mobile?.data.dialCode
      ) {
        this.localContactInfo.telegram = {
          data: this.localContactInfo.mobile.data,
          visible: this.localContactInfo.telegram
            ? this.localContactInfo.telegram.visible
            : this.localContactInfo.mobile.visible
        };
      } else {
        this.localContactInfo.telegram = {
          ...this.contactInfo.telegram,
          data: {
            ...(this.contactInfo.telegram?.data || {
              dialCode: "",
              number: ""
            })
          },
          visible: this.contactInfo.telegram
            ? this.contactInfo.telegram.visible
            : false
        };
      }
    }
  },
  mounted() {
    this.setLocalContactInfo(this.contactInfo);
  },
  watch: {
    contactInfo: {
      handler(newValue: Contact) {
        this.setLocalContactInfo(newValue);
      },
      immediate: true
    },
    updated: {
      handler(newValue: boolean) {
        if (newValue) {
          this.editMode = false;
          this.saving = false;
        }
      }
    },
    error: {
      handler(newValue: boolean) {
        if (newValue) {
          this.saving = false;
        }
      }
    }
  }
});
</script>

<style lang="scss" scoped>
button.dropdown-item.text-muted:hover > span {
  color: $white;
}
@media screen and (max-width: map-get($grid-breakpoints, "sm")) {
  #celuar-input-group {
    #celular-intl-code {
      border-bottom-left-radius: 0;
    }
    #celular-number {
      border-top-right-radius: 0.25rem !important;
    }
    #same-number {
      border-bottom-left-radius: 0.25rem;
      margin-left: 0px;
    }
    #share-mobile {
      border-top-right-radius: 0 !important;
      margin-right: 1px;
    }
  }
}
</style>
