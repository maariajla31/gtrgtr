import {
  AccountSummary,
  AccountSummaryState,
  INFO_ACCOUNT_SUMMARY,
  UPDATE_PROMOTIONS
} from "./AccountInterface";
import { ActionContext } from "vuex";
import * as fb from "../../firebase";

const initialState: AccountSummaryState = {
  account: {
    academyDaysLeft: 0,
    distributorDaysLeft: 0,
    directAffiliates: 0,
    hasBinaryNetworkBonus: false,
    bonusRemainingDays: 0,
    configuredWallet: false,
    binaryBonusExpiringSide: undefined,
    binarySide: undefined,
    promotions: {
      tradingAcademy: 0,
      distributorLicense: 0,
      both: 0
    },
    innerLegUnlocked: undefined,
    scholarshipPoints: 0,
    scholarshipStartDate: undefined,
    scholarshipEndDate: undefined
  }
};

const state: AccountSummaryState = { ...initialState };

const mutations = {
  INFO_ACCOUNT_SUMMARY(state: AccountSummaryState, summary: AccountSummary) {
    if (state == undefined) {
      state = initialState;
    }
    state.account = summary;
  },
  UPDATE_PROMOTIONS(state: AccountSummaryState, promotions: any) {
    if (state.account.promotions) {
      state.account.promotions = promotions;
    }
  }
};

const actions = {
  async initializeAccountSummary(
    context: ActionContext<AccountSummaryState, any>,
    username: string
  ) {
    const accountResponse: AccountSummary = {
      academyDaysLeft: 0,
      distributorDaysLeft: 0,
      directAffiliates: 0,
      hasBinaryNetworkBonus: false,
      bonusRemainingDays: 0,
      configuredWallet: false,
      binaryBonusExpiringSide: undefined,
      binarySide: undefined,
      promotions: {
        tradingAcademy: 0,
        distributorLicense: 0,
        both: 0
      },
      innerLegUnlocked: undefined,
      scholarshipPoints: 0,
      scholarshipStartDate: undefined,
      scholarshipEndDate: undefined
    };
    const _usernamePK = username.toLowerCase();
    const _user = fb.fbfs.doc("users/" + _usernamePK);
    const _distributorLicense = _user
      .collection("subscriptions")
      .doc("distributor-license");
    const _tradingAcademy = _user
      .collection("subscriptions")
      .doc("trading-academy");
    const _networkData = _user.collection("networkData");
    const _directAffiliates = _networkData.doc("directAffiliates");
    const _networkBasic = _networkData.doc("basic");
    const _networkScholarship = _networkData.doc("scholarship");
    const _financial = _user.collection("profile").doc("financial");

    const distributorPromise = _distributorLicense
      .get()
      .then((response) => {
        const subsInfo = response.data();
        if (
          subsInfo?.endDate != undefined &&
          subsInfo?.startDate != undefined
        ) {
          accountResponse.distributorDaysLeft = Math.ceil(
            (subsInfo.endDate.toDate().valueOf() - new Date().valueOf()) /
              (1000 * 3600 * 24)
          );
        } else {
          accountResponse.distributorDaysLeft = 0;
        }
        return Promise.resolve();
      })
      .catch((error) => {
        return Promise.reject(error);
      });

    const academyPromise = _tradingAcademy
      .get()
      .then((response) => {
        const subsInfo = response.data();
        if (
          subsInfo?.endDate != undefined &&
          subsInfo?.startDate != undefined
        ) {
          accountResponse.academyDaysLeft = Math.ceil(
            (subsInfo.endDate.toDate().valueOf() - new Date().valueOf()) /
              (1000 * 3600 * 24)
          );
          accountResponse.scholarshipStartDate = subsInfo.endDate.toDate();
        } else {
          accountResponse.academyDaysLeft = 0;
        }
        return Promise.resolve();
      })
      .catch((error) => {
        return Promise.reject(error);
      });

    const bonusPromise = await Promise.all([distributorPromise, academyPromise])
      .then(() => {
        _networkBasic
          .get()
          .then((response) => {
            const basicInfo = response.data();
            const expirationDts = basicInfo?.binaryExpiration;

            accountResponse.innerLegUnlocked = basicInfo?.innerLegUnlocked;
            accountResponse.binarySide = basicInfo?.binarySide;

            if (
              accountResponse.academyDaysLeft > 0 &&
              accountResponse.distributorDaysLeft > 0 &&
              expirationDts != undefined &&
              expirationDts.left != undefined &&
              expirationDts.right != undefined &&
              expirationDts.left.endDate != undefined &&
              expirationDts.right.endDate != undefined &&
              expirationDts.left.endDate != "" &&
              expirationDts.right.endDate != ""
            ) {
              const leftDate = expirationDts.left.endDate.toDate().valueOf();
              const rightDate = expirationDts.right.endDate.toDate().valueOf();
              const today = new Date().valueOf();

              if (leftDate - today > 0 && rightDate - today > 0) {
                const leftDays = Math.ceil(
                  (leftDate - today) / (1000 * 3600 * 24)
                );
                const rightDays = Math.ceil(
                  (rightDate - today) / (1000 * 3600 * 24)
                );
                if (leftDays >= rightDays) {
                  accountResponse.hasBinaryNetworkBonus = true;
                  accountResponse.bonusRemainingDays = rightDays;
                  accountResponse.binaryBonusExpiringSide = "right";
                } else {
                  accountResponse.hasBinaryNetworkBonus = true;
                  accountResponse.bonusRemainingDays = leftDays;
                  accountResponse.binaryBonusExpiringSide = "left";
                }
              }
              return Promise.resolve();
            } else {
              return Promise.resolve();
            }
          })
          .catch((error) => {
            return Promise.reject(error);
          });
      })
      .catch((error) => {
        return Promise.reject(error);
      });

    const affiliatesPromise = _directAffiliates
      .get()
      .then((response) => {
        const affiliates = response.data();
        accountResponse.directAffiliates = affiliates?.directsCount;
        return Promise.resolve();
      })
      .catch((error) => {
        return Promise.reject(error);
      });

    const financialPromise = _financial
      .get()
      .then((response) => {
        const financial = response.data();
        if (financial?.btcWallet && financial?.btcWallet.address.trim() != "") {
          accountResponse.configuredWallet = true;
        } else {
          accountResponse.configuredWallet = false;
        }
        return Promise.resolve();
      })
      .catch((error) => {
        return Promise.reject(error);
      });

    const scholarshipPromise = _networkScholarship
      .get()
      .then((response) => {
        const scholarship = response.data();
        if (scholarship) {
          accountResponse.scholarshipPoints = scholarship.periodPoints;
          accountResponse.scholarshipEndDate = scholarship.periodEndDate.toDate();
          accountResponse.scholarshipStartDate = scholarship.periodStartDate.toDate();
          if (scholarship.periodStartDate.toDate() > new Date()) {
            accountResponse.scholarshipPoints = -100;
          }
        } else {
          accountResponse.scholarshipPoints = -100;
        }
        return Promise.resolve();
      })
      .catch((error) => {
        return Promise.reject(error);
      });

    const promotionsPromise = _networkData.onSnapshot((snapshot) => {
      snapshot.docChanges().forEach((change) => {
        const doc = change.doc;
        if (doc.id == "promotions") {
          if (change.type == "added" || change.type == "modified") {
            const promotions: any = doc.data();
            accountResponse.promotions.tradingAcademy =
              promotions["trading-academy"] || 0;
            accountResponse.promotions.distributorLicense =
              promotions["distributor-license"] || 0;
            accountResponse.promotions.both = promotions["both"] || 0;
            context.commit(UPDATE_PROMOTIONS, accountResponse.promotions);
          }
        }
      });
      return Promise.resolve();
    });

    return await Promise.all([
      distributorPromise,
      academyPromise,
      bonusPromise,
      affiliatesPromise,
      financialPromise,
      promotionsPromise,
      scholarshipPromise
    ])
      .then(() => {
        context.commit(INFO_ACCOUNT_SUMMARY, accountResponse);
        return Promise.resolve();
      })
      .catch((error) => {
        return {
          OPCODE: "ERROR",
          message: error.message,
          errorDetail: error
        };
      });
  }
};

const getters = {
  getAccountSummary(state: AccountSummaryState): AccountSummary {
    return state.account;
  },
  getPromotions(state: AccountSummaryState) {
    return state?.account.promotions;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
