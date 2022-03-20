// export const  = "";
// Actions
// export const action = "action";
export const doGetPayments = "doGetPayments";
export const unsubscribeListener = "unsubscribeListener";

// Mutations
// export const MUTATION_EXAMPLE = "MUTATION_EXAMPLE";
export const ADD_USER_PAYMENT = "ADD_USER_PAYMENT";
export const UPDATE_USER_PAYMENT = "UPDATE_USER_PAYMENT";
export const DELETE_USER_PAYMENT = "DELETE_USER_PAYMENT";
export const CLEAR_USER_PAYMENTS = "CLEAR_USER_PAYMENTS";
export const SET_LISTENER = "SET_LISTENER";
export const CLEAR_LISTENER = "CLEAR_LISTENER";

export interface PaymentsState {
  payments: Array<Payment>;
  snapshotListeners: {
    payments: any;
  };
}

export interface Payment {
  _id: number;
  date: Date;
  concept: string;
  hash: string;
  originalAmount: string;
  originalCurrency: string;
  paidAmount: string;
  paidCurrency: string;
  status: string;
}

export interface SetListenerRequest {
  listenerId: "payments";
  listener: any;
}
