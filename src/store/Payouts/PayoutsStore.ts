// import { ActionContext } from "vuex";
import * as fb from "../../firebase";
// import router from "../../router";

import { ActionContext } from "vuex";
// import { UserPayout } from "@/../functions/src/System/SystemInterfaces";
import {
  ADD_PAYOUT,
  CLEAR_PAYOUTS,
  CLEAR_PAYOUTS_LIST,
  DELETE_PAYOUT,
  Payout,
  PayoutsStoreState,
  SetListenerRequest,
  SET_LISTENER,
  SET_PAYOUTS_LIST,
  unsubscribeListener,
  UPDATE_PAYOUT
} from "./PayoutsInterfaces";

const initialState: PayoutsStoreState = {
  payouts: new Array<Payout>(),
  payoutsList: new Array<string>(),
  snapshotListeners: {
    payouts: () => {
      return;
    }
  }
};

const state: PayoutsStoreState = { ...initialState };

const mutations = {
  SET_PAYOUTS_LIST(state: PayoutsStoreState, payoutsList: Array<string>) {
    state.payoutsList = payoutsList;
  },
  CLEAR_PAYOUTS_LIST(state: PayoutsStoreState) {
    if (state) {
      state.payoutsList = new Array<string>();
    }
  },
  CLEAR_PAYOUTS(state: PayoutsStoreState) {
    if (state) {
      state.payouts = new Array<Payout>();
    }
  },
  ADD_PAYOUT(state: PayoutsStoreState, payouts: Payout) {
    state.payouts?.push(payouts);
  },
  UPDATE_PAYOUT(state: PayoutsStoreState, updatedPayout: Payout) {
    const index = state.payouts.findIndex((p) => {
      return p._id == updatedPayout._id;
    });
    state.payouts[index] = updatedPayout;
  },
  DELETE_PAYOUT(state: PayoutsStoreState, payoutId: string) {
    state.payouts = state.payouts?.filter((p) => {
      return p._id != payoutId;
    });
  },
  SET_LISTENER(state: PayoutsStoreState, request: SetListenerRequest) {
    if (!state.snapshotListeners) {
      state.snapshotListeners = {
        payouts: () => {
          return;
        }
      };
    }
    state.snapshotListeners[request.listenerId] = request.listener;
  }
};

const actions = {
  async doGetPayoutsList(context: ActionContext<PayoutsStoreState, any>) {
    context.commit(CLEAR_PAYOUTS);
    context.commit(CLEAR_PAYOUTS_LIST);

    const payoutsList = fb.func.httpsCallable("System-payoutsList");
    payoutsList().then((payoutsList) => {
      context.commit(SET_PAYOUTS_LIST, payoutsList.data);
    });
  },
  doGetPayoutDetails(
    context: ActionContext<PayoutsStoreState, any>,
    payoutId: string
  ) {
    context.dispatch(unsubscribeListener, "payouts");
    context.commit(CLEAR_PAYOUTS);

    const withdrawalDetailRef = fb.fbfs
      .collection("system-log/withdrawals/" + payoutId)
      .orderBy("amount", "desc");

    const listener = withdrawalDetailRef.onSnapshot((querySnapshot) => {
      querySnapshot.docChanges().forEach((change) => {
        const doc = change.doc;
        if (doc.data()) {
          const payout = doc.data();
          if (change.type == "added") {
            context.commit(ADD_PAYOUT, payout);
          } else if (change.type == "modified") {
            context.commit(UPDATE_PAYOUT, payout);
          }
        } else if (change.type == "removed") {
          context.commit(DELETE_PAYOUT, doc.id);
        }
      });
    });
    context.commit(SET_LISTENER, { listenerId: "payouts", listener: listener });
  },
  unsubscribeListener(
    context: ActionContext<PayoutsStoreState, any>,
    listenerId: "payouts"
  ) {
    if (context.state.snapshotListeners[listenerId]) {
      context.state.snapshotListeners[listenerId]();
    }
  }
};
const getters = {
  getPayoutsList(state: PayoutsStoreState): Array<string> {
    return state ? state.payoutsList : new Array<string>();
  },
  getPayoutDetails(state: PayoutsStoreState): Array<Payout> {
    return state ? state.payouts : new Array<Payout>();
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
