// import { SubscriptionInfo } from "functions/src/Subscriptions/SubscriptionsInterfaces";
// import { UserSubscription } from "functions/src/Users/UsersInterfaces";

//Actions
export const doGetUserSubscriptions = "doGetUserSubscriptions";
export const doGetSubscriptionsConfig = "doGetSubscriptionsConfig";
export const updateUserSubscription = "updateUserSubscription";
export const quoteSubscription = "quoteSubscription";

//Mutations
export const SET_SUBS_CONFIG = "SET_SUBS_CONFIG";
export const UNSET_SUBS_CONFIG = "UNSET_SUBS_CONFIG";
export const SET_USER_SUBS = "SET_USER_SUBS";
export const UNSET_USER_SUBS = "UNSET_USER_SUBS";
export const CLEAR_USER_SUBS = "CLEAR_USER_SUBS";

export interface SubscriptionsState {
  UserSubscriptions: Array<any>;
  SubscriptionsConfiguration: Array<any>;
}
