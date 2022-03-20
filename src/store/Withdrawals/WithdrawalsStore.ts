import { ActionContext } from "vuex";
import * as fb from "../../firebase";

import {
  ADD_USER_WITHDRAWAL,
  Withdrawal,
  DELETE_USER_WITHDRAWAL,
  SetListenerRequest,
  SET_LISTENER,
  UPDATE_USER_WITHDRAWAL,
  WithdrawalsState
} from "./WithdrawalsInterfaces";

const initialState: WithdrawalsState = {
  withdrawals: [],
  snapshotListeners: {
    withdrawals: () => {
      return;
    }
  }
};

const state: WithdrawalsState = { ...initialState };

const mutations = {
  ADD_USER_WITHDRAWAL(state: WithdrawalsState, withdrawal: Withdrawal) {
    state.withdrawals.push(withdrawal);
  },
  DELETE_USER_WITHDRAWAL(state: WithdrawalsState, withdrawalId: number) {
    state.withdrawals = state.withdrawals.filter((item) => {
      return item._id != withdrawalId;
    });
  },
  UPDATE_USER_WITHDRAWAL(state: WithdrawalsState, withdrawal: Withdrawal) {
    const index = state.withdrawals.findIndex((item: any) => {
      return item._id == withdrawal._id;
    });
    state.withdrawals[index] = withdrawal;
  },
  CLEAR_USER_WITHDRAWALS(state: WithdrawalsState) {
    if (state) {
      state.withdrawals = [];
    }
  },
  SET_LISTENER(state: WithdrawalsState, request: SetListenerRequest) {
    if (!state.snapshotListeners) {
      state.snapshotListeners = {
        withdrawals: () => {
          return;
        }
      };
    }
    state.snapshotListeners[request.listenerId] = request.listener;
  },
  CLEAR_LISTENER(state: WithdrawalsState, listenerId: "withdrawals") {
    state.snapshotListeners[listenerId] = function() {
      return;
    };
  }
};

const actions = {
  doGetWithdrawals(context: ActionContext<WithdrawalsState, any>) {
    if (
      context.state &&
      context.state.snapshotListeners &&
      context.state.snapshotListeners["withdrawals"]
    ) {
      state.snapshotListeners["withdrawals"](); //Unsubscribe from previous listener
    }

    const username = context.rootState.auth.userProfileData._usernamePK;
    const _userWithdrawals = fb.fbfs
      .collection("users/" + username + "/withdrawals/")
      .orderBy("_id", "desc")
      .limit(100);

    const l = _userWithdrawals.onSnapshot((querySnapshot) => {
      querySnapshot.docChanges().forEach((change) => {
        const doc = change.doc;
        if (doc.data()) {
          const withdrawal = doc.data() as Withdrawal;
          if (change.type == "added") {
            context.commit(ADD_USER_WITHDRAWAL, withdrawal);
          } else if (change.type == "modified") {
            context.commit(UPDATE_USER_WITHDRAWAL, withdrawal);
          }
        } else if (change.type == "removed") {
          context.commit(DELETE_USER_WITHDRAWAL, doc.id);
        }
      });
    });

    context.commit(SET_LISTENER, { listenerId: "withdrawals", listener: l });
  },
  unsubscribeListener(
    context: ActionContext<WithdrawalsState, any>,
    listenerId: "withdrawals"
  ) {
    if (context.state.snapshotListeners[listenerId]) {
      context.state.snapshotListeners[listenerId]();
    }
  }
};
const getters = {
  getWithdrawals(state: WithdrawalsState): Array<Withdrawal> {
    return state ? state.withdrawals : new Array<Withdrawal>();
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
