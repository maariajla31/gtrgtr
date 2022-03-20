<template>
  <div class="container-md mb-4">
    <payments-detail> </payments-detail>
  </div>
  <div class="d-none">
    <div class="row">
      <div class="col-xl-2 col-md-4">
        <select id="period" class="form-control" @change="filterTable($event)">
          <option value="-1">Últimos diez</option>
          <option value="0">Mes actual</option>
          <option value="1">Mes anterior</option>
          <option value="2">Dos meses atrás</option>
        </select>
      </div>
      <div class="col-xl-7 col-md-4">
        <span class="period-text">Periodo: </span>

        <input
          type="date"
          id="fromDt"
          name="fromDt"
          class="form-control w-25 input-date"
          v-model="fromDate"
        />

        <span class="period-text">al</span>
        <input
          type="date"
          class="form-control w-25 input-date"
          id="toDt"
          v-model="toDate"
          v-bind:min="this.fromDate"
        />
        <button
          class="btn btn-outline-info btn-search"
          @click="searchByDate()"
          :disabled="!this.fromDate || !this.toDate"
        >
          <i class="fas fa-search"></i>
        </button>
      </div>
      <div class="col-xl-3 col-md-4">
        <button
          class="btn btn-outline-info prev-btn"
          :disabled="currentPage == 1"
          @click.prevent="currentPage -= 1"
        >
          <i class="fas fa-angle-left"></i>
        </button>
        <span class="info-table">
          Página {{ currentPage }} de
          {{ Math.ceil(filteredItems.length / perPage) }}</span
        >
        <button
          class="btn btn-outline-info next-btn"
          :disabled="!((currentPage * perPage) / filteredItems.length < 1)"
          @click.prevent="currentPage += 1"
        >
          <i class="fas fa-angle-right"></i>
        </button>
      </div>
    </div>

    <hr class="my-2" />
    <table
      id="paymentsDataTable"
      role="table"
      aria-busy="false"
      aria-colcount="3"
      class="table b-table table-sm table-striped"
    >
      <thead role="rowgroup">
        <tr role="row" class="">
          <th role="columnheader" scope="col">
            <div>Id</div>
          </th>
          <th role="columnheader" scope="col">
            <div>Transaction Hash</div>
          </th>
          <th role="columnheader" scope="col">
            <div>Price</div>
          </th>
          <th role="columnheader" scope="col">
            <div>Confirmed at</div>
          </th>
          <th role="columnheader" scope="col">
            <div>Pack</div>
          </th>
          <th role="columnheader" scope="col">
            <div>Status</div>
          </th>
        </tr>
      </thead>
      <tbody role="rowgroup">
        <tr
          role="row"
          v-for="(item, index) in filteredItems"
          :key="item.id"
          v-show="
            (currentPage - 1) * perPage <= index &&
              currentPage * perPage > index
          "
        >
          <td class="cell" role="cell">{{ item.id }}</td>
          <td class="cell" role="cell">{{ item.hash }}</td>
          <td class="cell" role="cell">
            <i class="fab fa-btc"></i> <strong>{{ item.price }} BTC </strong>
          </td>
          <td class="cell" role="cell">{{ item.date }}</td>
          <td class="cell" role="cell">{{ item.pack }}</td>
          <td class="cell" role="cell">
            <i
              class="far fa-check-circle text-success"
              v-show="item.status == 'Confirmed'"
            ></i>
            {{ item.status }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { paymentsDetail } from "../components/payments";

export default defineComponent({
  name: "Payments",
  components: { paymentsDetail },
  data() {
    return {
      fromDate: "",
      toDate: "",
      perPage: 20,
      currentPage: 1,
      rows: 0,
      filteredItems: [
        { id: 0, hash: "", price: "", date: "", pack: "", status: "" }
      ],
      items: [
        {
          id: 70001,
          hash:
            "c28759ecf342b1f3aef2df4803d5afe8d7778d8797a9ed57a62dcc3b8ff68d3f",
          price: "0.00409237",
          date: "01/02/2021 02:46PM",
          pack: "F$139,00",
          status: "Confirmed"
        },
        {
          id: 69672,
          hash:
            "c41d51397d95c3be64922d49ccbdcfefc0c69751c4b4336f0342397ae48ec109",
          price: "0.00395216",
          date: "06/01/2021 01:24AM",
          pack: "F$139,00",
          status: "Confirmed"
        },
        {
          id: 69466,
          hash:
            "c5ed39ddffaebbe24747862ac0e79a4df441e59645e186d4c8ccfad6073f93a9",
          price: "0.00094847",
          date: "28/12/2020 03:44PM",
          pack: "F$25,00",
          status: "Confirmed"
        },
        {
          id: 68521,
          hash:
            "4c6757054556b89ab20ffd432d93ccc3dffb183daacc98555cd9cbf8492481b0",
          price: "0.00785101",
          date: "18/11/2020 02:14AM",
          pack: "F$139,00",
          status: "Confirmed"
        },
        {
          id: 67962,
          hash:
            "0ac35368d0408a1736f4380ab284c8080382e06675fc130bd14afd827583f4bd",
          price: "0.01076042",
          date: "23/10/2020 04:46PM",
          pack: "F$139,00",
          status: "Confirmed"
        },
        {
          id: 66575,
          hash:
            "2cc2064b3cac2b3161d844514e0f522ab975fcaa5e1eb571d999fae0879dda47",
          price: "0.01279382",
          date: "17/09/2020 02:02PM",
          pack: "F$139,00",
          status: "Confirmed"
        },
        {
          id: 64968,
          hash:
            "82e56a45f75b07cc9ee8c891d25b81c20891e7e1217df3d130eda67ea733224f",
          price: "0.01165551",
          date: "18/08/2020 11:32PM",
          pack: "F$139,00",
          status: "Confirmed"
        },
        {
          id: 60754,
          hash:
            "f62d1916e5b65782878c932e2f13ffff386241bdff6ccc9f4f7441372b221380",
          price: "0.01508833",
          date: "15/07/2020 02:40PM",
          pack: "F$139,00",
          status: "Confirmed"
        },
        {
          id: 57198,
          hash:
            "bbfe2a79b9669bafb1057792506ef6674681ab303be758fc4e93f5fccac727e4",
          price: "0.02431945",
          date: "12/06/2020 06:14PM",
          pack: "F$230,00",
          status: "Confirmed"
        },
        {
          id: 95201,
          hash:
            "97ef7578bc8d3d15d326ea2bc946d5ee0bf74a56a89c1b3779d3586ab962664",
          price: "0.0278443",
          date: "28/12/2019 11:02AM",
          pack: "F$200,00",
          status: "Confirmed"
        }
      ]
    };
  },
  mounted() {
    this.filteredItems = this.items.slice(0, 10);
    ////this.rows = this.items?.length;
  },
  methods: {
    filterTable(event: any) {
      this.fromDate = "";
      this.toDate = "";

      const months = event.target.value;

      if (months == -1) {
        this.filteredItems = this.items.slice(0, 10);
      } else {
        const today = new Date();

        const period = new Date(today.setMonth(today.getMonth() - months));
        const month = ("0" + (period.getMonth() + 1)).slice(-2);
        const year = period.getFullYear().toString();

        this.filteredItems = this.items.filter(
          (x) =>
            x.date.substring(3, 5) == month && x.date.substring(6, 10) == year
        );
      }
    },
    isBetweenDates(date: Date, from: Date, to: Date) {
      return date >= from && date <= to;
    },
    searchByDate() {
      this.filteredItems = this.items.filter((x) =>
        this.isBetweenDates(
          new Date(
            x.date.substring(6, 10) +
              "-" +
              x.date.substring(3, 5) +
              "-" +
              x.date.substring(0, 2)
          ),
          new Date(this.fromDate),
          new Date(this.toDate)
        )
      );
    }
  }
});
</script>

<style lang="scss">
.input-date {
  float: left;
}

.btn-search {
  margin-left: 10px;
}

.period-text {
  float: left;
  padding: 7px 15px 7px 15px;
}

.info-table {
  text-align: center;
  padding-top: 5px;
  font-size: 17px;
  font-weight: bold;
}

.prev-div {
  text-align: right;
  padding-right: 0px;
}

.next-div {
  text-align: left;
  padding-left: 0px;
}

.cell {
  font-size: small;
}

// select:focus {
//   border-color: cornflowerblue !important;
//   box-shadow: 0 0 10px #719ece !important;
// }

// input:focus {
//   border-color: cornflowerblue !important;
//   box-shadow: 0 0 10px #719ece !important;
// }
</style>
