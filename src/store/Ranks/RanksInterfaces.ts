//export const  = "";
//Actions
export const doGetRanksInfo = "doGetRanksInfo";
export const setCurrentUserRanksInfo = "setCurrentUserRanksInfo";

//Mutations
export const GET_RANKS_SUCCESS = "GET_RANKS_SUCCESS";
export const SET_CURRENT_USER_RANKS_INFO = "SET_CURRENT_USER_RANKS_INFO";

export interface RanksStoreState {
  RanksInfo: Map<string, Rank> | undefined;
}

export interface RankElements {
  readonly priority: number;
  readonly _id: string;
  readonly name: string;
  readonly iconClass: string;
  readonly backgroundImage: string;
  readonly requiredPoints: number | 0;
  readonly requiredAffiliates: number | 0;
  readonly requiredAffiliatesInDays: number | 0;
  readonly requiredEarning: number | 0;
}

export class Rank implements RankElements {
  constructor(
    readonly priority: number,
    readonly _id: string,
    readonly name: string,
    readonly iconClass: string,
    readonly backgroundImage: string,
    readonly requiredPoints: number | 0,
    readonly requiredAffiliates: number | 0,
    readonly requiredAffiliatesInDays: number | 0,
    readonly requiredEarning: number | 0
  ) {}
}
