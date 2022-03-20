/* eslint-disable @typescript-eslint/no-unused-vars */
import * as fb from "../../firebase";
// import {
//   QuoteSubscriptionRequest,
//   SubscriptionInfo
// } from "functions/src/Subscriptions/SubscriptionsInterfaces";
// import { UserSubscription } from "functions/src/Users/UsersInterfaces";
import {
  SET_SUBS_CONFIG,
  SET_USER_SUBS,
  SubscriptionsState,
  UNSET_SUBS_CONFIG,
  UNSET_USER_SUBS
} from "./SubscriptionsConsts";
import { ActionContext } from "vuex";

const initialState: SubscriptionsState = {
  SubscriptionsConfiguration: [],
  UserSubscriptions: []
};

const state = { ...initialState };

const mutations = {
  SET_SUBS_CONFIG(state: SubscriptionsState) {
    const index = state.SubscriptionsConfiguration.findIndex((item: any) => {
      return item[0] == "";
    });
    if (index >= 0) {
      // state.SubscriptionsConfiguration[index] = [
      //   subscription.subscriptionId,
      //   subscription
      // ];
    } else {
      // state.SubscriptionsConfiguration.push([
      //   subscription.subscriptionId,
      //   subscription
      // ]);
    }
  },
  SET_USER_SUBS(state: SubscriptionsState) {
    const index = state.UserSubscriptions.findIndex((item: any) => {
      // return item[0] == subscription.subscriptionId;
    });
    if (index >= 0) {
      state.UserSubscriptions[index] = [
        // subscription.subscriptionId,
        // subscription
      ];
    } else {
      // state.UserSubscriptions.push([subscription.subscriptionId, subscription]);
    }
  },
  UNSET_USER_SUBS(state: SubscriptionsState, subscriptionId: string) {
    state.UserSubscriptions = state.UserSubscriptions.filter((item) => {
      return item[0] != subscriptionId;
    });
  },
  CLEAR_USER_SUBS(state: SubscriptionsState) {
    state.UserSubscriptions = [];
  },
  UNSET_SUBS_CONFIG(state: SubscriptionsState, subscriptionId: string) {
    state.SubscriptionsConfiguration = state.SubscriptionsConfiguration.filter(
      (item) => {
        return item[0] != subscriptionId;
      }
    );
  }
};

const actions = {
  async doGetUserSubscriptions(
    context: ActionContext<SubscriptionsState, any>
  ) {
    const username = context.rootState.auth.userProfileData._usernamePK;
    const _userSubscriptions = fb.fbfs.collection(
      "users/" + username + "/subscriptions/"
    );
    //try {
    _userSubscriptions.onSnapshot((querySnapshot) => {
      querySnapshot.docChanges().forEach((change) => {
        const doc = change.doc;
        if (change.type == "added" || change.type == "modified") {
          const startDate = doc.data().startDate.toDate();
          const endDate = doc.data().endDate.toDate();
          const lastPayDate = doc.data().lastPayDate.toDate();

          const subscription = {
            subscriptionId: doc.id,
            startDate: startDate,
            endDate: endDate,
            lastPayDate: lastPayDate,
            username: username
          };
          context.commit(SET_USER_SUBS, subscription);
        } else if (change.type == "removed") {
          context.commit(UNSET_USER_SUBS, doc.id);
        }
      });
    });
    //} catch (error) {
    //  return await Promise.reject(error);
    //}
  },
  async doGetSubscriptionsConfig(
    context: ActionContext<SubscriptionsState, any>
  ) {
    const _subscriptions = fb.fbfs.collection("subscriptions");
    _subscriptions.onSnapshot((querySnapshot) => {
      querySnapshot.docChanges().forEach((change) => {
        const doc = change.doc;

        if (change.type == "added" || change.type == "modified") {
          const subscription = doc.data();
          subscription.subscriptionId = doc.id;
          context.commit(SET_SUBS_CONFIG, subscription);
        } else if (change.type == "removed") {
          context.commit(UNSET_SUBS_CONFIG, doc.id);
        }
      });
    });
  },
  async quoteSubscription(
    context: ActionContext<SubscriptionsState, any>,
    request: "QuoteSubscriptionRequest"
  ) {
    const quoteSubs = fb.func.httpsCallable("Payments-QuoteSubscription");
    return quoteSubs(request)
      .then((r) => {
        if (r.data.OPCODE == "ERROR") {
          return r.data;
        } else {
          r.data.expirationTime = new Date(r.data.expirationTime);
          return r.data;
        }
      })
      .catch((error) => {
        console.log("Error: ", error);
        throw new Error(error);
      });
  }
};

const getters = {
  // getUserSubscriptions(state: SubscriptionsState): Array<UserSubscription> {
  //   return state.UserSubscriptions;
  // },

  // getSubscriptionsConfig(state: SubscriptionsState): Array<SubscriptionInfo> {
  //   return state.SubscriptionsConfiguration;
  // },

  // getUserSubscription(state: SubscriptionsState, getters: any, rootState: any) {
  //   return (subscriptionId: string): UserSubscription => {
  //     const s = new Map(...[state.UserSubscriptions]).get(
  //       subscriptionId
  //     ) as UserSubscription;
  //     return (
  //       s || {
  //         username: rootState.auth.userProfileData?._usernamePK,
  //         subscriptionId: subscriptionId,
  //         isActive: false
  //       }
  //     );
  //   };
  // },

  // getSubscriptionConfig(state: SubscriptionsState) {
  //   return (subscriptionId: string): SubscriptionInfo | undefined => {
  //     return new Map(...[state.SubscriptionsConfiguration]).get(
  //       subscriptionId
  //     ) as SubscriptionInfo;
  //   };
  // },
  durationUnitLocalized(state: SubscriptionsState) {
    return (duration: number, durationUnit: string): string => {
      let response = "";
      const lang = "es-MX";
      if (lang == "es-MX") {
        switch (durationUnit) {
          case "days":
            switch (duration as number) {
              case 1:
                response = "día";
                break;
              case 0:
              default:
                response = "días";
                break;
            }
            break;
          case "months":
            switch (duration as number) {
              case 1:
                response = "mes";
                break;
              case 0:
              default:
                response = "meses";
                break;
            }
            break;
          case "years":
            switch (duration as number) {
              case 1:
                response = "año";
                break;
              case 0:
              default:
                response = "años";
                break;
            }
            break;
        }
      }
      return response;
    };
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
