/* eslint-disable @typescript-eslint/no-unused-vars */
import { images } from "@/mixins/images";
import { ActionContext } from "vuex";
import * as fb from "../../firebase";
import router from "../../router";
import { Rank } from "../Ranks/RanksInterfaces";
import {
  CLEAR_USER_PROFILE,
  doGetUserProfile,
  LoginInfo,
  NewUserData,
  SET_USER_PROFILE,
  UserProfile,
  AuthStoreState,
  RankStatus,
  SET_USER_PERMISSIONS,
  CLEAR_USER_PERMISSIONS,
  getUserPermissions,
  sendPasswordChangeEmail,
  SET_EMAIL_STATUS,
  SET_PROFILE_SNAPSHOT_LISTENER,
  CLEAR_PROFILE_SNAPSHOT_LISTENER
} from "./AuthInterfaces";
import { auth } from "../../firebase";

const initialState: AuthStoreState = {
  userProfileData: undefined,
  userPermissions: Array<string>(),
  userVerified: false,
  profileSnapshopListener: () => {
    return;
  }
};

const state: AuthStoreState = { ...initialState };

const mutations = {
  SET_USER_PROFILE(
    state: { userProfileData: UserProfile },
    profileData: UserProfile
  ) {
    state.userProfileData = profileData;
  },
  CLEAR_USER_PROFILE(state: { userProfileData: {} }) {
    state.userProfileData = {};
  },
  SET_USER_PERMISSIONS(
    state: { userPermissions: Array<string> },
    permissions: Array<string>
  ) {
    state.userPermissions = permissions;
  },
  CLEAR_USER_PERMISSIONS(state: { userPermissions: {} }) {
    state.userPermissions = {};
  },
  SET_EMAIL_STATUS(state: { userVerified: boolean }, status: boolean) {
    state.userVerified = status;
  },
  CLEAR_PROFILE_SNAPSHOT_LISTENER(state: AuthStoreState) {
    state.profileSnapshopListener = () => {
      return;
    };
  },
  SET_PROFILE_SNAPSHOT_LISTENER(state: AuthStoreState, listener: () => void) {
    state.profileSnapshopListener = listener;
  }
};

const actions = {
  getEmailStatus(context: ActionContext<AuthStoreState, any>, email: string) {
    const getEmailStatus = fb.func.httpsCallable("getEmailStatus");
    return getEmailStatus(email).then((response: any) => {
      if (response.data.OPCODE == "SUCCESS") {
        context.commit(SET_EMAIL_STATUS, response.data.status);
        return Promise.resolve(response.data.status);
      } else {
        return Promise.reject(response);
      }
    });
  },
  async login(
    context: ActionContext<AuthStoreState, any>,
    form: LoginInfo
  ): Promise<boolean> {
    //Email authentication
    if (form.userIdentification.includes("@")) {
      const email = form.userIdentification;
      // sign user in
      let userCredential: firebase.default.auth.UserCredential;
      return await fb.auth
        .signInWithEmailAndPassword(email, form.password)
        .then(async (response) => {
          userCredential = response;
          // fetch user profile and set in state
          const loadPromises = [];
          loadPromises.push(
            context.dispatch(doGetUserProfile, userCredential.user)
          );
          loadPromises.push(
            context.dispatch(
              getUserPermissions,
              userCredential.user?.displayName
            )
          );
          // change route to dashboard
          return await Promise.all(loadPromises).then(() => {
            return Promise.resolve(true);
          });
        })
        .catch((error) => {
          return Promise.reject(error);
        });
    } else {
      // Username authentication
      throw Error("Por el momento solo login con Email");
    }
  },
  async register(
    context: ActionContext<AuthStoreState, any>,
    userData: NewUserData
  ) {
    const registerUser = fb.func.httpsCallable("Users-registerUser");
    return registerUser(userData).then((response: any) => {
      if (response.data.OPCODE == "SUCCESS") {
        return Promise.resolve(response.data);
      } else {
        return Promise.reject(response.data);
      }
    });
  },
  async doGetUserProfile(
    context: ActionContext<UserProfile, any>,
    user: firebase.default.User
  ) {
    const username = user.displayName || "";
    const userProfileQuery = fb.usersCollection.doc(username);

    await userProfileQuery.get().then(async (querySnapshot) => {
      if (querySnapshot.exists) {
        const userProfile = querySnapshot.data() as UserProfile;
        userProfile.pictureUrl = await images.methods.getProfilePicture(
          userProfile.pictureUrl
        );
        // set user profile in state
        context.commit(SET_USER_PROFILE, userProfile);
      }
    });
    const userProfileListener = userProfileQuery.onSnapshot(async (ss) => {
      const userProfile = ss.data() as UserProfile;
      userProfile.pictureUrl = await images.methods.getProfilePicture(
        userProfile.pictureUrl
      );
      // set user profile in state
      context.commit(SET_USER_PROFILE, userProfile);
    });
    context.commit(SET_PROFILE_SNAPSHOT_LISTENER, userProfileListener);
  },
  async logout(context: ActionContext<AuthStoreState, any>) {
    await fb.auth.signOut();
    localStorage.clear();
    context.commit(CLEAR_USER_PROFILE);
    context.commit(CLEAR_USER_PERMISSIONS);
    context.commit(CLEAR_PROFILE_SNAPSHOT_LISTENER);
    context.commit("profile/CLEAR_USER_PROFILE_DETAIL", null, { root: true });
    context.commit("subs/CLEAR_USER_SUBS", null, { root: true });
    context.commit("commissions/CLEAR_USER_COMMISSIONS", null, { root: true });
    //context.dispatch("commissions/" + unsubscribeListener, "commissions", { root: true });

    //resetState();
    //router.push({ name: "login" });
  },
  async GetEmailAvailability(
    context: ActionContext<AuthStoreState, any>,
    userEmail: string
  ) {
    const GetEmailAvailability = fb.func.httpsCallable("GetEmailAvailability");
    return GetEmailAvailability(userEmail).then((response: any) => {
      if (
        response.data.OPCODE == "SUCCESS" ||
        response.data.OPCODE == "UNAVAILABLE"
      ) {
        return Promise.resolve(response.data);
      } else {
        return Promise.reject(response.data);
      }
    });
  },
  async GetUsernameAvailability(
    context: ActionContext<AuthStoreState, any>,
    username: string
  ) {
    const GetUsernameAvailability = fb.func.httpsCallable(
      "GetUsernameAvailability"
    );
    return GetUsernameAvailability(username).then((response: any) => {
      if (
        response.data.OPCODE == "SUCCESS" ||
        response.data.OPCODE == "UNAVAILABLE"
      ) {
        return Promise.resolve(response.data);
      } else {
        return Promise.reject(response.data);
      }
    });
  },
  updateSetUserProfile(
    context: ActionContext<AuthStoreState, any>,
    userProfile: UserProfile
  ) {
    context.commit(SET_USER_PROFILE, userProfile);
  },
  async validateEmail(
    context: ActionContext<AuthStoreState, any>,
    userData: string
  ) {
    const validateEmail = fb.func.httpsCallable("validateEmail");
    return validateEmail(userData).then((response: any) => {
      if (response.data.OPCODE == "SUCCESS") {
        return Promise.resolve(response);
      } else {
        return Promise.reject(response.data);
      }
    });
  },
  async getUserPermissions(
    context: ActionContext<AuthStoreState, any>,
    userName: string
  ) {
    const getUserPermissions = fb.func.httpsCallable("getUserPermissions");
    return getUserPermissions(userName).then((response: any) => {
      context.commit(SET_USER_PERMISSIONS, response.data.data);
      return Promise.resolve(response);
    });
  },
  async setUserPermissions(
    context: ActionContext<AuthStoreState, any>,
    permissions: any
  ) {
    context.commit(SET_USER_PERMISSIONS, permissions);
  },
  async setUnverifiedProfile(
    context: ActionContext<AuthStoreState, any>,
    user: any
  ) {
    return await fb.usersCollection
      .where("email", "==", user)
      .get()
      .then((userData) => {
        const user = userData.docs[0].data();
        const _roles = user.roles;

        if (!_roles.includes("unverified")) {
          return fb.fbfs
            .doc("users/" + user._usernamePK)
            .update({
              roles: ["unverified"]
            })
            .then(() => {
              return {
                OPCODE: "SUCCESS",
                message: "Profile has been added"
              };
            })
            .catch((error) => {
              return {
                OPCODE: "ERROR",
                message: error.message,
                errorDetail: error
              };
            });
        } else {
          return {
            OPCODE: "SUCCESS",
            message: "Profile previously added"
          };
        }
      });
  },
  async setVerifiedProfile(
    context: ActionContext<AuthStoreState, any>,
    user: any
  ) {
    return await fb.usersCollection
      .where("email", "==", user)
      .get()
      .then((userData) => {
        const user = userData.docs[0].data();
        let _roles = user.roles;

        if (!_roles.includes("associate")) {
          _roles = _roles.filter((x: any) => x != "unverified");
          _roles.push("associate");

          return fb.fbfs
            .doc("users/" + user._usernamePK)
            .update({
              roles: _roles
            })
            .then(() => {
              return {
                OPCODE: "SUCCESS",
                message: "Profile has been updated"
              };
            })
            .catch((error) => {
              return {
                OPCODE: "ERROR",
                message: error.message,
                errorDetail: error
              };
            });
        } else {
          return {
            OPCODE: "SUCCESS",
            message: "Profile previously updated"
          };
        }
      });
  },
  getEmailByUsername(
    context: ActionContext<AuthStoreState, any>,
    username: string
  ) {
    const getEmailByUsername = fb.func.httpsCallable("getEmailByUsername");
    return getEmailByUsername(username).then((response: any) => {
      if (response.data.OPCODE == "SUCCESS") {
        return Promise.resolve(response.data.email);
      } else {
        return Promise.reject(response);
      }
    });
  },
  async sendPasswordResetLink(
    context: ActionContext<AuthStoreState, any>,
    userEmail: string
  ) {
    const sendPasswordResetLink = fb.func.httpsCallable(
      "sendPasswordResetLink"
    );
    return sendPasswordResetLink(userEmail).then((response: any) => {
      if (response.data.OPCODE == "SUCCESS") {
        return Promise.resolve(response.data);
      } else {
        return Promise.reject(response);
      }
    });
  },
  async resetPassword(context: ActionContext<AuthStoreState, any>, data: any) {
    const _token = data.token;
    const _pw = data.pw;

    // Verify the password reset code is valid.
    return auth
      .verifyPasswordResetCode(_token)
      .then((email) => {
        // Save the new password.
        return auth
          .confirmPasswordReset(_token, _pw)
          .then((resp) => {
            context.dispatch(sendPasswordChangeEmail, email);
            return {
              OPCODE: "SUCCESS",
              message: "Password updated successfully"
            };
          })
          .catch((error) => {
            return {
              OPCODE: "ERROR",
              message: error
            };
          });
      })
      .catch((error) => {
        return {
          OPCODE: "ERROR",
          message: error.message,
          detail: error
        };
      });
  },
  async sendPasswordChangeEmail(
    context: ActionContext<AuthStoreState, any>,
    userEmail: string
  ) {
    const sendPasswordChangeEmail = fb.func.httpsCallable(
      "sendPasswordChangeEmail"
    );
    return sendPasswordChangeEmail(userEmail).then((response: any) => {
      return response;
    });
  }
};
const getters = {
  getUserUid(state: any) {
    return state.userProfileData?._uid;
  },
  getUsernamePK(state: any) {
    return state.userProfileData?._usernamePK;
  },
  getUseremail(state: any) {
    return state.userProfileData?.email;
  },
  getUserNickname(state: any) {
    return state.userProfileData?.nickname;
  },
  getUserPicture(state: any) {
    return state.userProfileData?.pictureUrl;
  },
  getUserProfile(state: any) {
    return state.userProfileData;
  },
  getUserVerifiedStatus(state: any) {
    return state.userVerified;
  },
  getUserBinarySide(state: any) {
    return state.userProfileData?.binarySide;
  },
  //Rank related functions
  isRank(state: AuthStoreState) {
    return (rankID: string, status: string): boolean => {
      if (state.userProfileData?.ranksCarrerData) {
        const r = state.userProfileData?.ranksCarrerData.get(rankID);
        return (r || false) && r.status == status;
      } else {
        return false;
      }
    };
  },

  isCurrentRank(state: AuthStoreState, getters: any) {
    return (rankID: string) => {
      return getters.isRank(rankID, "current");
    };
  },

  isNextRank(state: AuthStoreState, getters: any) {
    return (rankID: string) => {
      const r = getters.isRank(rankID, "next");
      return r;
    };
  },

  isRankLocked(state: AuthStoreState, getters: any) {
    return (rankID: string) => {
      return getters.isRank(rankID, "locked");
    };
  },

  isRankUnlocked(state: AuthStoreState, getters: any) {
    return (rankID: string) => {
      return getters.isRank(rankID, "unlocked");
    };
  },

  rankDate(state: AuthStoreState) {
    return (rankID: string) => {
      if (state.userProfileData?.ranksCarrerData) {
        const _rankCarrerData = state.userProfileData?.ranksCarrerData.get(
          rankID
        );
        return _rankCarrerData?.date;
      }
      return undefined;
    };
  },

  currentRank(state: AuthStoreState): RankStatus | undefined {
    if (state.userProfileData?.ranksCarrerData) {
      let currentRank;
      state.userProfileData?.ranksCarrerData.forEach((rank: RankStatus) => {
        if (rank.status === "current") {
          currentRank = rank;
          return;
        }
      });
      return currentRank;
    }
    return;
  },

  nextRank(state: AuthStoreState): RankStatus | undefined {
    if (
      state.userProfileData?.ranksCarrerData &&
      state.userProfileData?.ranksCarrerData.forEach
    ) {
      let nextRank;
      state.userProfileData?.ranksCarrerData.forEach((rank: RankStatus) => {
        if (rank.status === "next") {
          nextRank = rank;
          return;
        }
      });
      return nextRank;
    }
    return;
  },
  ranksCarrerDataLoaded(state: AuthStoreState): boolean {
    if (state.userProfileData?.ranksCarrerData) {
      return state.userProfileData?.ranksCarrerData?.size > 0;
    } else {
      return false;
    }
  },
  getRanksCarrerData(state: AuthStoreState): Map<string, RankStatus> {
    if (state.userProfileData?.ranksCarrerData) {
      return state.userProfileData?.ranksCarrerData;
    } else {
      return new Map<string, RankStatus>();
    }
  },
  getUserPermissions(state: any) {
    return state.userPermissions;
  },
  getUserRole(state: any) {
    return state.userProfileData.roles;
  }
};

//const modules= {}
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
