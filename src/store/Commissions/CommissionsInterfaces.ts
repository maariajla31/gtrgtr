// Actions
export const doGetCommissions = "doGetCommissions";
export const unsubscribeListener = "unsubscribeListener";
export const getSummary = "getSummary";

// Mutations
export const UPDATE_USER_COMMISSION_SUMMARY = "UPDATE_USER_COMMISSION_SUMMARY";
export const ADD_USER_COMMISSION = "ADD_USER_COMMISSION";
export const UPDATE_USER_COMMISSION = "UPDATE_USER_COMMISSION";
export const DELETE_USER_COMMISSION = "DELETE_USER_COMMISSION";
export const CLEAR_USER_COMMISSIONS = "CLEAR_USER_COMMISSIONS";
export const SET_LISTENER = "SET_LISTENER";
export const CLEAR_LISTENER = "CLEAR_LISTENER";

export interface CommissionsState {
  commissions: Array<Commission>;
  summary: CommissionsSummary;
  snapshotListeners: {
    commissions: any;
    summary: any;
  };
}

export interface Commission {
  _id: number; // => this.date.getTime()
  date: Date;
  concept: string;
  source: string;
  amount: number;
  status: "pending" | "paid";
}

export interface CommissionsSummary {
  total: number;
  totalUpdatedDate: Date | undefined;
  pending: number;
  pendingUpdatedDate: Date | undefined;
  paid: number;
  paidUpdatedDate: Date | undefined;
}

export class CommissionsSummary {
  constructor() {
    this.total = 0;
    this.totalUpdatedDate = undefined;
    this.pending = 0;
    this.pendingUpdatedDate = undefined;
    this.paid = 0;
    this.paidUpdatedDate = undefined;
  }
}

export interface SetListenerRequest {
  listenerId: "commissions" | "summary" | undefined;
  commisions: any;
  summary: any;
}
