import { Commit, createStore, Dispatch } from "vuex";
//import createPersistedState from "vuex-persistedstate";
//import createMultiTabState from  "vuex-multi-tab-state";
import auth from "./Auth/AuthStore";
import userNetwork from "./UserNetwork/UserNetworkStore";
import ranks from "./Ranks/RanksStore";
import subs from "./Subscriptions/SubscriptionsStore";
import sys from "./System/SystemConfigStore";
import profile from "./Profile/ProfileStore";
import unilevel from "./Unilevel/UnilevelStore";
import classes from "./Classes/ClassesStore";
import commissions from "./Commissions/CommissionsStore";
import payouts from "./Payouts/PayoutsStore";
import payments from "./Payments/PaymentsStore";
import account from "./Account/AccountStore";
import withdrawals from "./Withdrawals/WithdrawalsStore";
import queries from "./Queries/QueriesStore";

const debug = process.env.NODE_ENV !== "production";

export const SET_LOADING_VALUE = "SET_LOADING_VALUE";

const state = {
  loading: false
};

const mutations = {
  SET_LOADING_VALUE(state: { loading: boolean }, value: boolean) {
    state.loading = value;
  }
};

const actions = {
  loading({ commit }: CommitInterface, value: boolean) {
    commit(SET_LOADING_VALUE, value);
  }
};

const getters = {
  isLoading(state: any) {
    return state.loading;
  }
};

export const store = createStore({
  modules: {
    auth,
    commissions,
    userNetwork,
    ranks,
    subs,
    sys,
    payments,
    payouts,
    profile,
    queries,
    unilevel,
    classes,
    account,
    withdrawals
  },
  plugins: [
    // createPersistedState({
    //   storage: window.sessionStorage
    // }),
    //createMultiTabState()
  ],
  devtools: debug,
  strict: debug,
  state: state,
  getters: getters,
  actions: actions,
  mutations: mutations
});

const initialStateCopy = JSON.parse(JSON.stringify(store.state));

export function resetState() {
  store.replaceState(JSON.parse(JSON.stringify(initialStateCopy)));
}

export interface CommitInterface {
  commit: Commit;
}

export interface DispatchInterface {
  dispatch: Dispatch;
}

/*******************************************************/
/************ New Store Template ***********************/
/*******************************************************/

// import { ActionContext } from "vuex";
// import * as fb from "../../firebase";
// import router from "../../router";

//const initialState: TypeState = {

// const state: TypeState = initialState;
// const mutations = {};
// const actions = {};
// const getters = {};

// export default {
//   namespaced: true,
//   state,
//   getters,
//   actions,
//   mutations
// };

/*******************************************************/
/************ Interfaces Template **********************/
/*******************************************************/
// export const  = "";
// Actions
// export const action = "action";

// Mutations
// export const MUTATION_EXAMPLE = "MUTATION_EXAMPLE";

// export interface TypeState { };
