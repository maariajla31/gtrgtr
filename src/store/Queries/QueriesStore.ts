/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ActionContext } from "vuex";
import * as fb from "../../firebase";
import {
  CLEAR_INCOME_REPORT,
  IncomeDataRequest,
  IncomeEntry,
  QueriesState,
  SET_INCOME_REPORT,
  UserInfo
} from "./QueriesInterfaces";

const initialState: QueriesState = {
  incomeReport: undefined
};

const state: QueriesState = { ...initialState };
const mutations = {
  SET_INCOME_REPORT(state: QueriesState, incomeReport: Array<IncomeEntry>) {
    state.incomeReport = incomeReport;
  },
  CLEAR_INCOME_REPORT() {
    state.incomeReport = undefined;
  }
};

const actions = {
  async doGetIncomeData(
    context: ActionContext<QueriesState, any>,
    request: IncomeDataRequest
  ) {
    //const _usersRef = fb.fbfs.collection("users");
    const _paymentsRef = fb.fbfs.collectionGroup("payments");
    const reportRows = new Array<IncomeEntry>();

    //const users = await _usersRef.get();
    //for(const user of users.docs) {
    //const userInfo: UserInfo = user.data()! as UserInfo;
    await _paymentsRef
      //await user.ref.collection("payments")
      .where("dateUpdated", ">=", new Date(request.fromDate))
      .where("dateUpdated", "<", new Date(request.toDate))
      .where("status", "in", ["complete", "paidOver"])
      .orderBy("dateUpdated", "asc")
      .get()
      .then(async (payments) => {
        for (const p of payments.docs) {
          const paymentData = p.data()!;
          const userInfo: UserInfo = await p.ref.parent
            .parent!.get()
            .then((userSnapshot) => {
              return userSnapshot.data()! as UserInfo;
            });
          try {
            const row: IncomeEntry = {
              username: userInfo._usernamePK,
              enroller: userInfo.enroller,
              concept: paymentData.concept,
              date: paymentData.dateUpdated,
              value:
                paymentData.originalAmount + " " + paymentData.originalCurrency,
              paid:
                Number(paymentData.paidAmount).toFixed(8) +
                " " +
                paymentData.expectedCurrency
            };
            reportRows.push(row);
          } catch (error) {
            console.log(
              "Error inserting row",
              p.data(),
              "- User: ",
              p.ref.parent.parent?.id
            );
          }
        }
      });
    //}
    context.commit(SET_INCOME_REPORT, reportRows);
  },
  clearIncomeData(context: ActionContext<QueriesState, any>) {
    context.commit(CLEAR_INCOME_REPORT);
  }
};
const getters = {
  getIncomeReport(state: QueriesState): Array<IncomeEntry> | undefined {
    return state.incomeReport;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
