// Actions
// export const action = "action";
export const doGetIncomeData = "doGetIncomeData";
export const clearIncomeData = "clearIncomeData";

// Mutations
// export const MUTATION_EXAMPLE = "MUTATION_EXAMPLE";
export const SET_INCOME_REPORT = "SET_INCOME_REPORT";
export const CLEAR_INCOME_REPORT = "CLEAR_INCOME_REPORT";

export interface QueriesState {
  incomeReport: Array<IncomeEntry> | undefined;
}

export interface IncomeEntry {
  date: Date;
  username: string;
  enroller: string;
  concept: string;
  value: string;
  paid: string;
}

export interface IncomeDataRequest {
  fromDate: Date;
  toDate: Date;
}

export interface UserInfo {
  enroller: string;
  _usernamePK: string;
}
