<template>
  <div
    class="modal fade"
    id="profile-picture-gallery-modal"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
    tabindex="-1"
    aria-labelledby=""
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-header bg-secondary py-2 bg-gradient text-light">
          <h5 class="modal-title">
            <i class="fas fa-camera fa-fw me-2"></i>
            Cambiar Foto de Perfil
          </h5>
          <button
            type="button"
            class="btn-close btn-sm btn-close-white"
            aria-label="Close"
            ref="close"
            @click="closeModal"
          ></button>
        </div>
        <div class="modal-body">
          <section v-show="!modeCrop">
            <div class="row">
              <div class="col-6 col-sm-4 col-lg-2">
                <div
                  class="profile-image rounded border border-1 ratio ratio-1x1 mb-4"
                >
                  <button @click="selectPictureFile()" class="btn">
                    <i class="fa fa-upload d-block" aria-hidden="true"></i>
                    <span class="d-block">Subir foto</span>
                  </button>
                </div>
              </div>
              <template
                v-for="image of sortedDefaultImages"
                :key="image.fullPath"
              >
                <div class="col-6 col-sm-4 col-lg-2">
                  <div class="profile-image rounded border border-1 mb-4">
                    <button
                      class="btn p-0"
                      @click="saveProfilePicture(true, image.fullPath)"
                    >
                      <img
                        :src="image.url"
                        :alt="image.fullPath"
                        class="rounded ratio ratio-1x1"
                      />
                    </button>
                  </div>
                </div>
              </template>
            </div>
          </section>
          <section v-show="modeCrop">
            <input
              type="file"
              class="d-none"
              id="uploaded-image"
              accept="image/png,image/jpeg,image/jpg"
              ref="uploadedImage"
              @change="uploadImage($event)"
            />
            <div class="img-container">
              <div
                class=""
                style="height: 350px; max-height: 350px;"
                ref="imageWorkArea"
              ></div>
            </div>
          </section>
        </div>
        <div class="modal-footer">
          <section v-if="!modeCrop">
            <div class="d-flex justify-content-end">
              <button
                v-if="saving"
                type="button"
                class="btn btn-outline-secondary mx-3 order-1"
                disabled
              >
                <i class="fas fa-spinner fa-spin fa-fw me-1"></i>
                Actualizando
              </button>

              <button
                v-else
                type="button"
                class="btn btn-outline-primary mx-3 order-1"
                @click="closeModal"
              >
                Cerrar
              </button>
            </div>
          </section>
          <section v-else class="flex-grow-1">
            <div class="row">
              <div class="col-4 align-items-start mb-2">
                <button
                  type="button"
                  class="btn btn-outline-secondary"
                  @click="cancelCrop()"
                  :disabled="saving"
                >
                  <i class="far fa-arrow-alt-circle-left fa-fw me-1"></i
                  >Regresar
                </button>
              </div>
              <div
                class="col-8 col-md-4 d-flex justify-content-end justify-content-md-center mb-2"
              >
                <button
                  type="button"
                  class="btn btn-outline-secondary"
                  @click="selectPictureFile()"
                  :disabled="saving"
                >
                  <i class="fa fa-upload me-2" aria-hidden="true"></i>Subir otro
                  archivo
                </button>
              </div>
              <div class="col-12 col-md-4 d-flex justify-content-end mb-2">
                <button
                  type="button"
                  class="btn btn-outline-danger me-2"
                  @click="closeModal()"
                  :disabled="saving"
                >
                  <i class="fas fa-ban fa-fw me-1"></i>Cancelar
                </button>
                <button
                  type="button"
                  class="btn btn-outline-success"
                  @click="saveProfilePicture(false)"
                  :disabled="saving"
                >
                  <i
                    v-if="saving"
                    class="fas fa-spinner fa-spin fa-fw me-1"
                  ></i>
                  <i v-else class="fas fa-save fa-fw me-1"></i>Aceptar
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import firebase from "firebase/app";
import "firebase/storage";
import * as bs from "bootstrap";
import Cropper from "cropperjs";
import { mapGetters } from "vuex";
import { UpdateProfilePictureRequest } from "@/store/Profile/ProfileInterfaces";
import { generateDateKey } from "@/mixins/tools";

interface ImageData {
  url: string;
  name: string;
  fullPath: string;
}

export default defineComponent({
  name: "profile-picture-gallery-modal",
  data() {
    return {
      modalObject: {} as any,
      cropper: new Cropper(document.createElement("img")),
      modeCrop: false,
      defaultImages: Array<ImageData>(),
      saving: false
    };
  },
  computed: {
    ...mapGetters("auth", ["getUsernamePK", "getUserUid", "getUserPicture"]),
    sortedDefaultImages(): Array<ImageData> {
      const sorted = [...this.defaultImages];
      return sorted.sort((a, b) => {
        if (a.fullPath < b.fullPath) {
          return -1;
        }
        if (a.fullPath > b.fullPath) {
          return 1;
        }
        return 0;
      });
    }
  },
  methods: {
    selectPictureFile() {
      const input = this.$refs.uploadedImage as HTMLInputElement;
      input.click();
    },
    cancelCrop() {
      this.modeCrop = false;
    },
    uploadImage(event: Event) {
      console.log(event.target);
      if (event && event.target) {
        const target = event.target as HTMLInputElement;
        if (target && target.files && target.files.length > 0) {
          if (target.files[0].size > 5000000) {
            alert("Seleccione una imagen de máximo 5 MB");
            return;
          }
          this.modeCrop = true;

          const result = this.$refs.imageWorkArea as Element;
          result.innerHTML = "";
          this.cropper.clear();

          const reader = new FileReader();
          reader.onload = (e) => {
            if (e?.target?.result) {
              const img = document.createElement("img");
              img.id = "image";
              img.src = e.target.result as string;
              img.style.maxHeight = "350px";
              img.style.display = "block";
              img.style.maxWidth = "100%";
              result.appendChild(img);

              this.cropper = new Cropper(img, {
                aspectRatio: 1,
                viewMode: 1,
                background: false,
                zoomable: false
              });
            }
          };
          reader.readAsDataURL(target.files[0]);
        } else {
          const result = this.$refs.imageWorkArea as Element;
          console.log(result.innerHTML);
          alert("Seleccione una imagen");
        }
      }
    },
    closeModal() {
      this.modalObject.hide();
      setTimeout(() => {
        this.modeCrop = false;
        this.cropper.clear();
      }, 1000);
    },
    saveProfilePicture(isDefault: boolean, imgUrl?: string) {
      this.saving = true;
      let pictureUrl: string;
      let imgSrc: string | undefined;

      if (isDefault) {
        if (imgUrl) {
          pictureUrl = imgUrl;
        } else {
          alert("Seleccione una imagen");
          return;
        }
      } else {
        imgSrc = this.cropper.getCroppedCanvas({ width: 500 }).toDataURL();
        pictureUrl =
          "/profile-pictures/" +
          this.getUsernamePK +
          "/" +
          this.getUsernamePK +
          "_" +
          generateDateKey() +
          ".png";
      }

      const request: UpdateProfilePictureRequest = {
        usernamePK: this.getUsernamePK,
        originalUrl: this.getUserPicture,
        pictureUrl: pictureUrl,
        dataBase64Url: imgSrc,
        isDefaultImage: isDefault
      };

      this.$store
        .dispatch("profile/updateProfilePicture", request)
        .then(() => {
          this.closeModal();
        })
        .catch((error) => {
          alert("Error: " + error.message);
        })
        .finally(() => {
          this.saving = false;
        });
    }
  },
  mounted() {
    this.modalObject = bs.Modal.getOrCreateInstance(
      document.getElementById("profile-picture-gallery-modal")
    );
  },
  created() {
    firebase
      .storage()
      .ref("img/gtr-images/neon")
      .listAll()
      .then((res) => {
        res.prefixes.forEach((folderRef) => {
          folderRef.listAll().then((res) => {
            res.items.forEach((itemRef) => {
              itemRef.getDownloadURL().then((url) => {
                this.defaultImages.push({
                  url: url,
                  name: itemRef.name,
                  fullPath: itemRef.fullPath
                });
              });
            });
          });
        });
        res.items.forEach((itemRef) => {
          itemRef.getDownloadURL().then((url) => {
            this.defaultImages.push({
              url: url,
              name: itemRef.name,
              fullPath: itemRef.fullPath
            });
          });
        });
      });
  }
});
</script>

<style lang="scss" scoped>
.profile-image:hover {
  border-color: $input-focus-border-color;
  box-shadow: $input-focus-box-shadow;
}

.img-container {
  padding-top: 1rem;
  padding-bottom: 1rem;

  :deep(.cropper-modal) {
    margin-top: -1rem;
    margin-bottom: -1rem;
  }

  :deep(.cropper-view-box) {
    border-radius: 50%;
    outline-width: 3px;
  }
  :deep(.cropper-container img) {
    border: 2px solid $secondary;
  }
}
</style>
