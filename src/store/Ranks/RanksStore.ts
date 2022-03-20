import { ActionContext } from "vuex";
import * as fb from "../../firebase";
import { GET_RANKS_SUCCESS, Rank, RanksStoreState } from "./RanksInterfaces";
// import router from "../../router";

const initialState: RanksStoreState = {
  RanksInfo: undefined
};

const state: RanksStoreState = { ...initialState };

const mutations = {
  GET_RANKS_SUCCESS(state: RanksStoreState, ranksInfo: Map<string, Rank>) {
    state.RanksInfo = ranksInfo;
  }
};
const actions = {
  doGetRanksInfo(context: ActionContext<RanksStoreState, any>) {
    const ranks = new Map<string, Rank>();
    fb.ranksCollection
      .where("status", "==", "active")
      .orderBy("priority", "asc")
      .get()
      .then((ranksDocs) => {
        ranksDocs.forEach((r) => {
          const rankData = r.data();
          if (rankData) {
            ranks.set(rankData._id, rankData as Rank);
          }
        });
        context.commit(GET_RANKS_SUCCESS, ranks);
      })
      .catch((error) => {
        alert("Error al traer Definición de Rangos" + error);
      });
  }
};

const getters = {
  rankById(state: RanksStoreState) {
    return (rankID: string): Rank | undefined => {
      if (state.RanksInfo?.get) {
        return state.RanksInfo.get(rankID);
      }
    };
  },

  nextRank(state: RanksStoreState) {
    return (rankID: string): Rank | undefined => {
      if (state.RanksInfo?.get) {
        return state.RanksInfo.get(rankID);
      }
    };
  },

  rankName(state: RanksStoreState, getters: any) {
    return (rankID: string): string => {
      const _rank = getters.rankById(rankID);
      return _rank == undefined ? "" : _rank.name;
    };
  },

  rankIconClass(state: RanksStoreState, getters: any) {
    return (rankID: string): string => {
      const _rank = getters.rankById(rankID);
      return _rank == undefined ? "" : _rank.iconClass;
    };
  },

  allRanks(state: RanksStoreState) {
    return (): Map<string, Rank> | undefined => {
      if (state.RanksInfo) {
        return state.RanksInfo;
      }
    };
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
