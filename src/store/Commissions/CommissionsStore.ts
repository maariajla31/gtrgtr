import { ActionContext } from "vuex";
import * as fb from "../../firebase";

import {
  ADD_USER_COMMISSION,
  Commission,
  DELETE_USER_COMMISSION,
  SetListenerRequest,
  SET_LISTENER,
  UPDATE_USER_COMMISSION,
  CommissionsState,
  CommissionsSummary,
  UPDATE_USER_COMMISSION_SUMMARY,
  CLEAR_USER_COMMISSIONS,
  CLEAR_LISTENER
} from "./CommissionsInterfaces";

const initialState: CommissionsState = {
  commissions: [],
  summary: {
    total: 0,
    pending: 0,
    paid: 0,
    totalUpdatedDate: undefined,
    pendingUpdatedDate: undefined,
    paidUpdatedDate: undefined
  },
  snapshotListeners: {
    commissions: () => {
      return;
    },
    summary: () => {
      return;
    }
  }
};

const state: CommissionsState = { ...initialState };

const mutations = {
  UPDATE_USER_COMMISSION_SUMMARY(
    state: CommissionsState,
    summary: CommissionsSummary
  ) {
    state.summary = summary;
  },
  ADD_USER_COMMISSION(state: CommissionsState, commission: Commission) {
    state.commissions.push(commission);
  },
  DELETE_USER_COMMISSION(state: CommissionsState, commissionId: number) {
    state.commissions = state.commissions.filter((item) => {
      return item._id != commissionId;
    });
  },
  UPDATE_USER_COMMISSION(state: CommissionsState, commission: Commission) {
    const index = state.commissions.findIndex((item: any) => {
      return item._id == commission._id;
    });
    state.commissions[index] = commission;
  },
  CLEAR_USER_COMMISSIONS(state: CommissionsState) {
    if (state) {
      state.summary = { ...initialState.summary };
      state.commissions = [];
    }
  },
  SET_LISTENER(state: CommissionsState, request: SetListenerRequest) {
    if (state && !state?.snapshotListeners) {
      if (request.listenerId == undefined) {
        state.snapshotListeners = {
          commissions: () => {
            return;
          },
          summary: () => {
            return;
          }
        };
      } else if (request.listenerId == "commissions") {
        state.snapshotListeners[request.listenerId] = () => {
          return;
        };
      } else if (request.listenerId == "summary") {
        state.snapshotListeners[request.listenerId] = () => {
          return;
        };
      }
    }

    if (state) {
      if (request.listenerId == undefined) {
        state.snapshotListeners["commissions"] = request.commisions;
        state.snapshotListeners["summary"] = request.summary;
      } else if (request.listenerId == "commissions") {
        state.snapshotListeners[request.listenerId] = request.commisions;
      } else if (request.listenerId == "summary") {
        state.snapshotListeners[request.listenerId] = request.summary;
      }
    }
  },
  CLEAR_LISTENER(
    state: CommissionsState,
    listenerId?: "commissions" | "summary"
  ) {
    if (state.snapshotListeners) {
      if (listenerId == undefined) {
        state.snapshotListeners["commissions"] = function() {
          return;
        };
        state.snapshotListeners["summary"] = function() {
          return;
        };
      } else {
        state.snapshotListeners[listenerId] = function() {
          return;
        };
      }
    } else {
      state.snapshotListeners = {
        commissions: () => {
          return;
        },
        summary: () => {
          return;
        }
      };
    }
  }
};

const actions = {
  async doGetCommissions(context: ActionContext<CommissionsState, any>) {
    context.commit(CLEAR_LISTENER);
    context.commit(CLEAR_USER_COMMISSIONS);

    //console.log(context.rootGetters["auth/getUsernamePK"]);
    const username = await context.rootGetters["auth/getUsernamePK"];
    //console.log("getCommissions: " + username);
    const _userCommissions = fb.fbfs.collection(
      "users/" + username + "/commissions/"
    );
    const _summaryRef = _userCommissions.where("_id", "==", 0);
    const summaryListener = _summaryRef.onSnapshot((querySnapshot) => {
      //console.log("snapshot", querySnapshot);
      querySnapshot.docChanges().forEach((change) => {
        const doc = change.doc;
        if (doc.data()) {
          const com = doc.data();
          //Commissions summary
          const summary = com as CommissionsSummary;
          summary.totalUpdatedDate = com.totalUpdatedDate.toDate() || undefined;
          summary.pendingUpdatedDate =
            com.pendingUpdatedDate.toDate() || undefined;
          summary.paidUpdatedDate = com.paidUpdateDate?.toDate() || undefined;

          //console.log("commit summary", summary);
          context.commit(UPDATE_USER_COMMISSION_SUMMARY, summary);
        }
      });
    });

    const _detailRef = _userCommissions.orderBy("_id", "desc").limit(100);
    const l = _detailRef.onSnapshot((querySnapshot) => {
      querySnapshot.docChanges().forEach((change) => {
        const doc = change.doc;
        if (doc.data()) {
          const com = doc.data();
          const commission = com as Commission;
          if (com._id != 0) {
            if (change.type == "added") {
              context.commit(ADD_USER_COMMISSION, commission);
            } else if (change.type == "modified") {
              context.commit(UPDATE_USER_COMMISSION, commission);
            }
          }
        } else if (change.type == "removed") {
          context.commit(DELETE_USER_COMMISSION, doc.id);
        }
      });
    });

    context.commit(SET_LISTENER, { commissions: l, summary: summaryListener });
  },
  unsubscribeListener(context: ActionContext<CommissionsState, any>) {
    context.commit(CLEAR_LISTENER);
  }
};
const getters = {
  getCommissions(state: CommissionsState): Array<Commission> {
    return state ? state.commissions : new Array<Commission>();
  },
  getSummary(state: CommissionsState): CommissionsSummary | undefined {
    return state ? state.summary : undefined;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
