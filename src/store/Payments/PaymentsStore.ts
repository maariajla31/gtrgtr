import { ActionContext } from "vuex";
import * as fb from "../../firebase";

import {
  ADD_USER_PAYMENT,
  Payment,
  DELETE_USER_PAYMENT,
  SetListenerRequest,
  SET_LISTENER,
  UPDATE_USER_PAYMENT,
  PaymentsState
} from "./PaymentsInterfaces";

const initialState: PaymentsState = {
  payments: [],
  snapshotListeners: {
    payments: () => {
      return;
    }
  }
};

const state: PaymentsState = initialState;

const mutations = {
  ADD_USER_PAYMENT(state: PaymentsState, payment: Payment) {
    state.payments.unshift(payment);
  },
  DELETE_USER_PAYMENT(state: PaymentsState, paymentId: number) {
    state.payments = state.payments.filter((item) => {
      return item._id != paymentId;
    });
  },
  UPDATE_USER_PAYMENT(state: PaymentsState, payment: Payment) {
    const index = state.payments.findIndex((item: any) => {
      return item._id == payment._id;
    });
    state.payments[index] = payment;
  },
  CLEAR_USER_PAYMENTS(state: PaymentsState) {
    if (state) {
      state.payments = [];
    }
  },
  SET_LISTENER(state: PaymentsState, request: SetListenerRequest) {
    if (!state.snapshotListeners) {
      state.snapshotListeners = {
        payments: () => {
          return;
        }
      };
    }
    state.snapshotListeners[request.listenerId] = request.listener;
  },
  CLEAR_LISTENER(state: PaymentsState, listenerId: "payments") {
    state.snapshotListeners[listenerId] = function() {
      return;
    };
  }
};

const actions = {
  doGetPayments(context: ActionContext<PaymentsState, any>) {
    if (
      context.state.snapshotListeners &&
      context.state.snapshotListeners["payments"]
    ) {
      state.snapshotListeners["payments"](); //Unsubscribe from previous listener
    }

    const username = context.rootState.auth.userProfileData._usernamePK;
    const _userPayments = fb.fbfs
      .collection("users/" + username + "/payments/")
      .orderBy("_id", "asc")
      .limit(100);

    const l = _userPayments.onSnapshot((querySnapshot) => {
      querySnapshot.docChanges().forEach((change) => {
        const doc = change.doc;
        if (doc.data()) {
          const payment = doc.data() as Payment;
          if (change.type == "added") {
            context.commit(ADD_USER_PAYMENT, payment);
          } else if (change.type == "modified") {
            context.commit(UPDATE_USER_PAYMENT, payment);
          }
        } else if (change.type == "removed") {
          context.commit(DELETE_USER_PAYMENT, doc.id);
        }
      });
    });

    context.commit(SET_LISTENER, { listenerId: "payments", listener: l });
  },
  unsubscribeListener(
    context: ActionContext<PaymentsState, any>,
    listenerId: "payments"
  ) {
    if (context.state.snapshotListeners[listenerId]) {
      context.state.snapshotListeners[listenerId]();
    }
  }
};
const getters = {
  getPayments(state: PaymentsState): Array<Payment> {
    return state ? state.payments : new Array<Payment>();
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
