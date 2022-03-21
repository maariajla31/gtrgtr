<template>
  <div class="card mb-4">
    <div class="">
      <h5 class="card-header d-flex align-items-center">
        <span
          ><i class="bi bi-trophy-fill text-yellow me-2"></i> Tablero de
          Líderes</span
        >
      </h5>
    </div>
    <div class="mt-2">
      <ul class="nav nav-tabs ps-3" id="leaderboardTabs" role="tablist">
        <li class="nav-item" role="presentation">
          <a
            class="nav-link active"
            id="current-tab"
            data-bs-toggle="tab"
            href="#current-leaderboard"
            role="tab"
            aria-controls="current"
            aria-selected="true"
            >Actual</a
          >
        </li>
        <li class="nav-item" role="presentation">
          <a
            class="nav-link"
            id="current-tab"
            data-bs-toggle="tab"
            href="#past-leaderboard"
            role="tab"
            aria-controls="current"
            aria-selected="false"
            >Anterior
          </a>
        </li>
      </ul>
    </div>
    <div class="tab-content">
      <div id="current-leaderboard" class="tab-pane fade show active">
        <table class="table table-striped align-middle">
          <thead class="table-secondary">
            <tr>
              <th scope="col" class="text-center">#</th>
              <th colspan="2" scope="colgroup">Nombre</th>
              <th scope="col" class="text-center">Afiliados</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="l in CurrentLeaderboard" :key="l.Position">
              <th scope="row" class="text-center">{{ l.Position }}</th>
              <td class="text-center">
                <img :src="l.Picture" class="avatar avatar-sm shadow-none" />
              </td>
              <td>
                <div class="leader-name">
                  <span class="fw-bold">{{ l.Name }}</span>
                  <div class="small text-muted">
                    <i :class="rankIconClass(l.Rank) + ' ps-2 pe-1 small'"></i
                    >{{ rankName(l.Rank) }}
                  </div>
                </div>
              </td>
              <td class="text-center fw-bold fs-4">{{ l.Enrolled }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div id="past-leaderboard" class="tab-pane fade">
        <table class="table table-striped align-middle">
          <thead>
            <tr>
              <th scope="col" class="text-center">#</th>
              <th colspan="2" scope="colgroup">Nombre</th>
              <th scope="col" class="text-center">Afiliados</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="l in PreviousLeaderboard" :key="l.Position">
              <th scope="row" class="text-center">{{ l.Position }}</th>
              <td class="text-center">
                <img :src="l.Picture" class="avatar avatar-sm shadow-none" />
              </td>
              <td>
                <div class="leader-name">
                  <span class="fw-bold">{{ l.Name }}</span>
                  <div class="small text-muted">
                    <i :class="rankIconClass(l.Rank) + ' ps-2 pe-1 small'"></i
                    >{{ rankName(l.Rank) }}
                  </div>
                </div>
              </td>
              <td class="text-center fw-bold fs-4">{{ l.Enrolled }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { mapGetters } from "vuex";

export default defineComponent({
  name: "leader-board-card",
  data() {
    return {
      CurrentLeaderboard: [
        // eslint-disable-next-line prettier/prettier
        {
          Position: 1,
          Name: "Saúl Savala",
          Picture: require("../assets/img/profile-blue.png"),
          Rank: "GAL-REPUBLIC",
          Enrolled: "25"
        },
        // eslint-disable-next-line prettier/prettier
        {
          Position: 2,
          Name: "Frida Millonaria",
          Picture: require("../assets/img/profile-blue.png"),
          Rank: "JEDI",
          Enrolled: "22"
        },
        // eslint-disable-next-line prettier/prettier
        {
          Position: 3,
          Name: "A Silva",
          Picture: require("../assets/img/profile-blue.png"),
          Rank: "JEDI-ORDER",
          Enrolled: "20"
        },
        // eslint-disable-next-line prettier/prettier
        {
          Position: 4,
          Name: "Modo Hervir",
          Picture: require("../assets/img/profile-blue.png"),
          Rank: "JEDI",
          Enrolled: "19"
        },
        // eslint-disable-next-line prettier/prettier
        {
          Position: 5,
          Name: "Carlos 077",
          Picture: require("../assets/img/profile-blue.png"),
          Rank: "JEDI",
          Enrolled: "17"
        },
        // eslint-disable-next-line prettier/prettier
        {
          Position: 6,
          Name: "Carmen Martínez",
          Picture: require("../assets/img/profile-blue.png"),
          Rank: "JEDI",
          Enrolled: "16"
        },
        // eslint-disable-next-line prettier/prettier
        {
          Position: 7,
          Name: "Julio Santander",
          Picture: require("../assets/img/profile-blue.png"),
          Rank: "GAL-SENATE",
          Enrolled: "10"
        },
        // eslint-disable-next-line prettier/prettier
        {
          Position: 8,
          Name: "José Luis",
          Picture: require("../assets/img/profile-blue.png"),
          Rank: "OLD-REPUBLIC",
          Enrolled: "8"
        },
        // eslint-disable-next-line prettier/prettier
        {
          Position: 9,
          Name: "Daniela Baez",
          Picture: require("../assets/img/profile-blue.png"),
          Rank: "JEDI",
          Enrolled: "6"
        },
        // eslint-disable-next-line prettier/prettier
        {
          Position: 10,
          Name: "Mariana Lopez",
          Picture: require("../assets/img/profile-blue.png"),
          Rank: "JEDI",
          Enrolled: "6"
        }
      ],
      PreviousLeaderboard: [
        // eslint-disable-next-line prettier/prettier
        {
          Position: 1,
          Name: "A Silva",
          Picture: require("../assets/img/profile-blue.png"),
          Rank: "JEDI-ORDER",
          Enrolled: "15"
        },
        // eslint-disable-next-line prettier/prettier
        {
          Position: 2,
          Name: "Modo Hervir",
          Picture: require("../assets/img/profile-blue.png"),
          Rank: "JEDI",
          Enrolled: "12"
        },
        // eslint-disable-next-line prettier/prettier
        {
          Position: 3,
          Name: "Frida Millonaria",
          Picture: require("../assets/img/profile-blue.png"),
          Rank: "JEDI",
          Enrolled: "8"
        }
      ]
    };
  },
  computed: {
    ...mapGetters("ranks", ["rankName", "rankIconClass"])
  }
});
</script>
<style lang="scss" scoped>
.leader-name {
  line-height: 1rem;
}
</style>
