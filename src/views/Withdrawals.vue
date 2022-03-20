<template>
  <div class="container-md mb-4">
    <withdrawals-detail> </withdrawals-detail>
  </div>
  <div class="d-none">
    <div class="row">
      <div class="col-xl-12 order-xl-1">
        <div class="row">
          <div class="col-xl-4">
            <div class="card border-0 bg-gradient-1">
              <div class="card-body">
                <div class="row">
                  <div class="col">
                    <h5
                      class="card-title text-uppercase text-muted mb-0 text-white"
                    >
                      Comisiones
                    </h5>
                    <span class="h2 font-weight-bold mb-0 text-white">
                      <i class="fas fa-hand-holding-usd"></i>
                      F0.00
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="col-xl-4">
            <div class="card border-0 bg-gradient-2">
              <div class="card-body">
                <div class="row">
                  <div class="col">
                    <h5
                      class="card-title text-uppercase text-muted mb-0 text-white"
                    >
                      Retiro total
                    </h5>
                    <span class="h2 font-weight-bold mb-0 text-white">
                      <i class="fas fa-hand-holding-usd"></i>
                      F1,075.24
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row my-2">
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
      id="withdrawalsDataTable"
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
            <div>Withdrawn</div>
          </th>
          <th role="columnheader" scope="col">
            <div>Fees</div>
          </th>
          <th role="columnheader" scope="col">
            <div>Total</div>
          </th>
          <th role="columnheader" scope="col">
            <div>TXID</div>
          </th>
          <th role="columnheader" scope="col">
            <div>Currency</div>
          </th>
          <th role="columnheader" scope="col">
            <div>Date</div>
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
          <td class="cell" role="cell">{{ item.withdrawn }}</td>
          <td class="cell" role="cell">{{ item.fees }}</td>
          <td class="cell" role="cell">{{ item.total }}</td>
          <td class="cell" role="cell">{{ item.txid }}</td>
          <td class="cell" role="cell">{{ item.currency }}</td>
          <td class="cell" role="cell">{{ item.date }}</td>
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
import { withdrawalsDetail } from "../components/withdrawals";

export default defineComponent({
  name: "Withdrawals",
  components: { withdrawalsDetail },

  data() {
    return {
      fromDate: "",
      toDate: "",
      perPage: 10,
      currentPage: 1,
      rows: 0,
      filteredItems: [
        {
          id: 0,
          withdrawn: "",
          fees: "",
          total: "",
          txid: "",
          currency: "",
          date: "",
          status: ""
        }
      ],
      items: [
        {
          id: 33721,
          withdrawn: "F$124,00",
          fees: "F$6,20",
          total: "F$117,80",
          txid:
            "511668ec5d6714ce38509af8d4acc1cb6550cf9e83286c9e447053dfd3b9c1df",
          currency: "BTC",
          date: "27/01/2021 12:00PM",
          status: "Confirmed"
        },
        {
          id: 33542,
          withdrawn: "F$51,72",
          fees: "F$2,59",
          total: "F$49,13",
          txid:
            "71b22f868bbd92bd7b846016d5a3f07231e49e4e543aa2262349823cf345432a",
          currency: "BTC",
          date: "22/01/2021 12:00PM",
          status: "Confirmed"
        },
        {
          id: 29828,
          withdrawn: "F$386,88",
          fees: "F$19,34",
          total: "F$367,54",
          txid:
            "361c957cdbc48c1967e50a515d0095cbafeb9ed991cf4562e891db70fb6ceb7c",
          currency: "BTC",
          date: "31/12/2020 12:00PM",
          status: "Confirmed"
        },
        {
          id: 29535,
          withdrawn: "F$180,00",
          fees: "F$9,00",
          total: "F$171,00",
          txid:
            "d129efc7d640141a5304614026fc225a5833b74bd9778f5793233fca14c3ed83",
          currency: "BTC",
          date: "17/12/2020 12:00PM",
          status: "Confirmed"
        },
        {
          id: 28040,
          withdrawn: "F$26,66",
          fees: "F$1,33",
          total: "F$25,33",
          txid:
            "9eacc78c2e53b2d260bbd4b45cfd414b4843084d83878d5ecca6436ca1c3d8f4",
          currency: "BTC",
          date: "07/12/2020 07:13PM",
          status: "Confirmed"
        },
        {
          id: 24265,
          withdrawn: "F$120,00",
          fees: "F$6,00",
          total: "F$114,00",
          txid:
            "f6074c7b3257e44bf70d0086356584cbe869c25a52f245ea9df57f9043fe14ee",
          currency: "BTC",
          date: "25/10/2020 12:15PM",
          status: "Confirmed"
        },
        {
          id: 22809,
          withdrawn: "F$22,14",
          fees: "F$1,11",
          total: "F$21,03",
          txid:
            "d4639bfaef574369c0d1dca62941a868efba30dd3c5cc18acc99a831b52b8e43",
          currency: "BTC",
          date: "04/10/2020 01:32PM",
          status: "Confirmed"
        },
        {
          id: 18293,
          withdrawn: "F$29,10",
          fees: "F$1,46",
          total: "F$27,65",
          txid:
            "e5c4dcfd0fff1ba6391f12de570654ac02a1dfc73ca74caf19cb209b83d8e8ba",
          currency: "BTC",
          date: "01/08/2020 03:40PM",
          status: "Confirmed"
        },
        {
          id: 17038,
          withdrawn: "F$50,00",
          fees: "F$2,50",
          total: "F$47,50",
          txid:
            "d5ab2111783856e6e9d971ad1df02b24b9ac823735529aa9a0457a0316b2268d",
          currency: "BTC",
          date: "25/07/2020 12:15PM",
          status: "Confirmed"
        },
        {
          id: 13434,
          withdrawn: "F$34,02",
          fees: "F$1,70",
          total: "F$32,32",
          txid:
            "621a65f4a510c94a207959e6870d6648df1bf3091382f61860410e915bfd2baa",
          currency: "BTC",
          date: "01/06/2020 10:20PM",
          status: "Confirmed"
        },
        {
          id: 6371,
          withdrawn: "F$23,24",
          fees: "F$1,16",
          total: "F$22,08",
          txid:
            "427e2beddb7498437cb33ec216172ab93756439b4367f7f62cf98f77a784711c",
          currency: "BTC",
          date: "02/03/2020 12:04AM",
          status: "Confirmed"
        },
        {
          id: 3848,
          withdrawn: "F$27,48",
          fees: "F$1,37",
          total: "F$26,11",
          txid:
            "edc7d615c5a92d5d50635e1c38bb69325da55423bbb00ad209f7838ddc051510",
          currency: "BTC",
          date: "01/02/2020 07:44PM",
          status: "Confirmed"
        }
      ]
    };
  },
  mounted() {
    this.filteredItems = this.items.slice(0, 10);
    //this.rows = this.items?.length;
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

<style>
.div-pagination {
  text-align: center;
}

.prev-btn {
  margin-right: 10px;
}

.next-btn {
  margin-left: 10px;
}
</style>
