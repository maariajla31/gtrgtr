// Actions
export const doGetWithdrawals = "doGetWithdrawals";
export const unsubscribeListener = "unsubscribeListener";

// Mutations
export const ADD_USER_WITHDRAWAL = "ADD_USER_WITHDRAWAL";
export const UPDATE_USER_WITHDRAWAL = "UPDATE_USER_WITHDRAWAL";
export const DELETE_USER_WITHDRAWAL = "DELETE_USER_WITHDRAWAL";
export const CLEAR_USER_WITHDRAWALS = "CLEAR_USER_WITHDRAWALS";
export const SET_LISTENER = "SET_LISTENER";
export const CLEAR_LISTENER = "CLEAR_LISTENER";

export interface WithdrawalsState {
  withdrawals: Array<Withdrawal>;
  snapshotListeners: {
    withdrawals: any;
  };
}

export interface Withdrawal {
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
  listenerId: "withdrawals";
  listener: any;
}
