// import { UserPayout } from "@/../functions/src/System/SystemInterfaces";
// Actions
// export const action = "action";
export const doGetPayoutsList = "doGetPayoutsList";
export const doGetPayoutDetails = "doGetPayoutDetails";
export const unsubscribeListener = "unsubscribeListener";

// Mutations
// export const MUTATION_EXAMPLE = "MUTATION_EXAMPLE";
export const CLEAR_PAYOUTS = "CLEAR_PAYOUTS";
export const CLEAR_PAYOUTS_LIST = "CLEAR_PAYOUTS_LIST";
export const SET_PAYOUTS_LIST = "SET_PAYOUTS_LIST";
export const ADD_PAYOUT = "ADD_PAYOUT";
export const UPDATE_PAYOUT = "UPDATE_PAYOUT";
export const DELETE_PAYOUT = "DELETE_PAYOUT";
export const SET_LISTENER = "SET_LISTENER";

export interface PayoutsStoreState {
  payouts: Array<Payout>;
  payoutsList: Array<string>;
  snapshotListeners: {
    payouts: any;
  };
}

export interface Payout {
  _id: string;
  date: Date;
  // payouts: Array<UserPayout> | undefined;
}

export interface SetListenerRequest {
  listenerId: "payouts";
  listener: any;
}
