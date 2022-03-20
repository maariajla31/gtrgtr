<template>
  <div class="tree-container d-flex pt-2">
    <div class="flex-grow-1">
      <div class="d-flex justify-content-center mb-2">
        <div class="btn-group" role="group">
          <button
            class="btn btn-outline-secondary"
            @click="changeTreeRoot(rootUserNode?.parent)"
          >
            <i class="bi bi-chevron-up me-2"></i>Subir Nivel
          </button>
          <button class="btn btn-outline-secondary" @click="changeTreeRoot('')">
            Ir la Inicio<i class="bi bi-chevron-double-up ms-2"></i>
          </button>
        </div>
      </div>
      <div
        id="binary-tree-level-1"
        class="binary-level-1 d-flex flex-row row-nowrap pb-4 border rounded border-2"
      >
        <binary-node :username="rootUserNode?.username || ''"></binary-node>
      </div>
      <div class="d-flex row-nowrap my-4">
        <div class="col-6 text-center d-flex justify-content-center">
          <div class="card team-card flex-grow-1 mx-4">
            <h6 class="card-header">
              <i class="bi bi-diagram-2 fs-4 text-pink me-2"></i>Equipo
              Izquierdo
            </h6>
            <div class="card-body d-flex align-self-center col-12 col-xxl-11">
              <table class="table small">
                <tbody class="">
                  <tr class="h5 text-end">
                    <td class="col-7 col-xl-6 col-xl-7 text-nowrap">
                      <span class="d-none d-sm-inline">Puntos</span> Pendientes:
                    </td>
                    <td class="col-3 col-xl-2  col-xxl-1 fw-bold">
                      {{
                        rootUserNode?.points.left.pending.toLocaleString() || 0
                      }}
                    </td>
                    <td class="col-2 col-xl-3 col-xxl-4"></td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr class="text-end text-info">
                    <td class="text-end">
                      <span class="d-none d-sm-inline text-nowrap">Puntos</span>
                      Pagados:
                    </td>
                    <td class=" fw-bold">
                      {{ rootUserNode?.points.left.paid.toLocaleString() || 0 }}
                    </td>
                    <td></td>
                  </tr>
                  <tr class="text-end text-green">
                    <td class="text-end">
                      <span class="d-none d-sm-inline text-nowrap">Puntos</span>
                      Totales:
                    </td>
                    <td class=" fw-bold">
                      <span class="">{{
                        totalLeftPoints.toLocaleString()
                      }}</span>
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
            <div class="card-footer">
              <div class="h6 text-start small">Enlace de registro:</div>
              <div
                v-if="sideUnlocked('left')"
                class="input-group input-group-sm"
              >
                <input
                  type="text"
                  id="referralUrl_izq"
                  class="form-control text-center"
                  :value="leftLink"
                  readonly
                />
                <button
                  class="btn btn-outline-info"
                  type="button"
                  @click="copyToClipboard('izq')"
                >
                  <i class="far fa-copy"></i>
                </button>
              </div>
              <div v-else class="input-group input-group-sm">
                <input
                  type="text"
                  id="sideLocked"
                  class="form-control text-center"
                  value="Bloqueado"
                  readonly
                />
                <button class="btn btn-outline-info" type="button" disabled>
                  <i class="fas fa-lock"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="col-6 text-center d-flex justify-content-center">
          <div class="card team-card flex-grow-1 mx-4">
            <h6 class="card-header">
              Equipo Derecho<i class="bi bi-diagram-2 fs-4 text-teal ms-2"></i>
            </h6>
            <div class="card-body d-flex align-self-center col-12 col-xxl-11">
              <table class="table small">
                <tbody class="">
                  <tr class="h5 text-end">
                    <td class="col-7 col-xl-6 col-xl-7 text-nowrap">
                      <span class="d-none d-sm-inline">Puntos</span> Pendientes:
                    </td>
                    <td class="col-3 col-xl-2  col-xxl-1 fw-bold">
                      {{
                        rootUserNode?.points.right.pending.toLocaleString() || 0
                      }}
                    </td>
                    <td class="col-2 col-xl-3 col-xxl-4"></td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr class="text-end text-info">
                    <td class="text-end">
                      <span class="d-none d-sm-inline text-nowrap">Puntos</span>
                      Pagados:
                    </td>
                    <td class=" fw-bold">
                      {{
                        rootUserNode?.points.right.paid.toLocaleString() || 0
                      }}
                    </td>
                    <td></td>
                  </tr>
                  <tr class="text-end text-green">
                    <td class="text-end">
                      <span class="d-none d-sm-inline text-nowrap">Puntos</span>
                      Totales:
                    </td>
                    <td class=" fw-bold">
                      {{ totalRightPoints.toLocaleString() }}
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
            <div class="card-footer">
              <div class="h6 text-start small">Enlace de registro:</div>
              <div
                v-if="sideUnlocked('right')"
                class="input-group input-group-sm"
              >
                <input
                  type="text"
                  id="referralUrl_der"
                  class="form-control text-center"
                  :value="rightLink"
                  readonly
                />
                <button
                  class="btn btn-outline-info"
                  type="button"
                  @click="copyToClipboard('der')"
                >
                  <i class="far fa-copy"></i>
                </button>
              </div>
              <div v-else class="input-group input-group-sm">
                <input
                  type="text"
                  id="sideLocked"
                  class="form-control text-center"
                  value="Bloqueado"
                  readonly
                />
                <button class="btn btn-outline-info" type="button" disabled>
                  <i class="fas fa-lock"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { AccountSummary } from "@/store/Account/AccountInterface";
import {
  initializeTree,
  setRootUsername
} from "@/store/UserNetwork/UserNetworkInterfaces";
import { defineComponent } from "vue";
import { mapGetters } from "vuex";
import BinaryNode from "../components/BinaryNode.vue";

export default defineComponent({
  components: { BinaryNode },
  name: "binary-network",
  data() {
    return {
      leftLink: "",
      rightLink: ""
    };
  },
  computed: {
    ...mapGetters("auth", ["getUsernamePK"]),
    ...mapGetters("userNetwork", {
      rootUserNode: "getRootUserNode"
    }),
    ...mapGetters("auth", ["getUsernamePK"]),
    ...mapGetters("account", ["getAccountSummary"]),
    accountSummary(): AccountSummary {
      return this.getAccountSummary;
    },
    linkBase(): string {
      const hrefArray = window.location.href.split("/");
      return hrefArray[0] + "//" + hrefArray[2] + "/registro/";
    },
    totalRightPoints(): number {
      return (
        this.rootUserNode?.points.right.pending +
          this.rootUserNode?.points.right.paid || 0
      );
    },
    totalLeftPoints(): number {
      return (
        this.rootUserNode?.points.left.pending +
          this.rootUserNode?.points.left.paid || 0
      );
    },
    totalPoints(): number {
      return this.totalRightPoints + this.totalLeftPoints || 0;
    },
    binarySide(): string {
      return this.accountSummary?.binarySide
        ? this.accountSummary?.binarySide
        : "";
    },
    innerLegUnlocked(): boolean {
      if (this.accountSummary?.innerLegUnlocked == undefined) {
        return true;
      }
      return this.accountSummary?.innerLegUnlocked
        ? this.accountSummary?.innerLegUnlocked
        : false;
    }
  },
  methods: {
    async initializeTree() {
      await this.$store.dispatch("userNetwork/" + initializeTree);
    },
    changeTreeRoot(newUsername: string) {
      //console.log(newUsername);
      if (newUsername != undefined)
        this.$store.dispatch("userNetwork/" + setRootUsername, newUsername);
    },
    copyToClipboard(side: string) {
      const el = document.getElementById(
        "referralUrl_" + side
      ) as HTMLInputElement;
      el.select();
      el.setSelectionRange(0, 99999);
      document.execCommand("copy");
    },
    sideUnlocked(btnSide: "right" | "left"): boolean {
      if (
        btnSide == "left" &&
        this.binarySide == "right" &&
        this.innerLegUnlocked == false
      ) {
        return false;
      } else if (
        btnSide == "right" &&
        this.binarySide == "left" &&
        this.innerLegUnlocked == false
      ) {
        return false;
      }
      return true;
    }
  },
  async created() {
    await this.initializeTree();
  },
  mounted() {
    this.leftLink = this.linkBase + this.getUsernamePK + "/izq";
    this.rightLink = this.linkBase + this.getUsernamePK + "/der";
  }
});
</script>
<style lang="scss" scoped>
.tree-container {
  overflow-y: auto;
}
.team-card {
  max-width: 450px;
}
.binary-level-1::before,
.binary-level-1::after {
  border: none;
}

.binary-level-1 {
  min-height: 500px;
}
@include media-breakpoint-up(md) {
  .tree-container {
    --min-width: 600px;
    --max-width: 1400px;
  }
}
</style>
