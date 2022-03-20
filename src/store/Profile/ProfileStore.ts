import * as fb from "../../firebase";
import {
  SET_AUTH_PROFILE_DATA,
  SET_USER_PERSONAL,
  SET_USER_ADDRESS,
  SET_USER_CONTACT,
  SET_USER_FINANCIAL,
  SET_USER_WEKNOW_DATA,
  ProfileStoreState,
  UserProfileData,
  Address,
  Contact,
  Financial,
  PersonalInfo,
  Metadata,
  SET_USER_METADATA,
  doGetUserPersonalData,
  doGetUserAddressData,
  doGetUserContactData,
  doGetUserFinancialData,
  doGetUserBasicProfileData,
  SecuredDataRequest,
  ProcessSecuredDataRequest,
  SET_USER_NICKNAME,
  UpdateProfilePictureRequest,
  SET_USER_PROFILE_PICTURE,
  WeknowData
} from "./ProfileInterfaces";
import { images } from "@/mixins/images";
import { ActionContext } from "vuex";
import { UserProfile } from "../Auth/AuthInterfaces";

const initialState: ProfileStoreState = {};

const state = { ...initialState };

const mutations = {
  SET_AUTH_PROFILE_DATA(state: ProfileStoreState, authProfile: UserProfile) {
    const userData: UserProfileData = {
      _uid: authProfile._uid,
      _usernamePK: authProfile._usernamePK,
      binarySide: authProfile.binarySide,
      currentRank: authProfile.currentRank,
      enroller: authProfile.enroller,
      nickname: authProfile.nickname,
      pictureUrl: authProfile.pictureUrl,
      username: authProfile.username,
      contact: {
        email: {
          data: authProfile.email,
          visible: true
        }
      } as Contact
    };
    if (state.userProfileData == undefined) {
      state.userProfileData = userData;
    } else {
      state.userProfileData = { ...state.userProfileData, ...userData };
    }
  },
  SET_USER_PERSONAL(state: ProfileStoreState, personalInfo: PersonalInfo) {
    if (state.userProfileData != undefined) {
      state.userProfileData.personal = personalInfo;
    }
  },
  SET_USER_ADDRESS(state: ProfileStoreState, address: Address) {
    if (state.userProfileData != undefined) {
      state.userProfileData.address = address;
    }
  },
  SET_USER_CONTACT(state: ProfileStoreState, contact: Contact) {
    if (state.userProfileData != undefined) {
      state.userProfileData.contact = {
        ...state.userProfileData.contact,
        ...contact
      };
    }
  },
  SET_USER_FINANCIAL(state: ProfileStoreState, financial: Financial) {
    if (state.userProfileData != undefined) {
      state.userProfileData.financial = financial;
    }
  },
  SET_USER_NICKNAME(state: ProfileStoreState, nickname: string) {
    if (state.userProfileData != undefined) {
      state.userProfileData.nickname = nickname;
    }
  },
  SET_USER_PROFILE_PICTURE(state: ProfileStoreState, pictureUrl: string) {
    if (state.userProfileData != undefined) {
      state.userProfileData.pictureUrl = pictureUrl;
    }
  },
  SET_USER_METADATA(state: ProfileStoreState, metadata: Metadata) {
    if (state.userProfileData != undefined) {
      state.userProfileData.metadata = metadata;
    }
  },
  SET_USER_WEKNOW_DATA(state: ProfileStoreState, weknowData: WeknowData) {
    if (state.userProfileData != undefined) {
      state.userProfileData.weknowData = weknowData;
    }
  },
  CLEAR_USER_PROFILE_DETAIL(state: ProfileStoreState) {
    state.userProfileData = undefined;
  }
};

const actions = {
  doGetUserProfileData(context: ActionContext<ProfileStoreState, any>) {
    context.dispatch(doGetUserBasicProfileData);

    const doGetUserMetadata = fb.func.httpsCallable("doGetUserMetadata");

    doGetUserMetadata(state.userProfileData?.contact.email.data).then(
      (response: any) => {
        if (response.data.OPCODE == "SUCCESS") {
          const dates: Metadata = {
            creationTime: new Date(response.data.DETAILS.creationTime),
            lastSignInTime: new Date(response.data.DETAILS.lastSignInTime),
            lastRefreshTime: new Date(response.data.DETAILS.lastRefreshTime)
          };
          context.commit(SET_USER_METADATA, dates);
        } else {
          console.log("Error getting user metadata");
        }
      }
    );

    context.dispatch(doGetUserPersonalData, state.userProfileData?._usernamePK);
    context.dispatch(doGetUserAddressData, state.userProfileData?._usernamePK);
    context.dispatch(doGetUserContactData, state.userProfileData?._usernamePK);
    context.dispatch(
      doGetUserFinancialData,
      state.userProfileData?._usernamePK
    );
  },
  doGetUserBasicProfileData(context: ActionContext<ProfileStoreState, any>) {
    const authProfile = context.rootGetters["auth/getUserProfile"];
    context.commit(SET_AUTH_PROFILE_DATA, authProfile);
  },
  doGetUserPersonalData(
    context: ActionContext<ProfileStoreState, any>,
    username: string
  ) {
    const _users = fb.fbfs.collection("users");
    const _userProfile = _users.doc(username).collection("/profile");

    _userProfile
      .doc("personalInformation")
      .get()
      .then((doc) => {
        let personal: PersonalInfo;
        if (doc.exists && doc.data() != undefined) {
          personal = doc.data() as PersonalInfo;
        } else {
          personal = {} as PersonalInfo;
        }
        context.commit(SET_USER_PERSONAL, personal);
      });
  },
  doGetUserAddressData(
    context: ActionContext<ProfileStoreState, any>,
    username: string
  ) {
    const _users = fb.fbfs.collection("users");
    const _userProfile = _users.doc(username).collection("/profile");

    _userProfile
      .doc("address")
      .get()
      .then((doc) => {
        if (doc.exists) {
          const address = doc.data();
          context.commit(SET_USER_ADDRESS, address);
        }
      });
  },
  doGetUserContactData(
    context: ActionContext<ProfileStoreState, any>,
    username: string
  ) {
    const _users = fb.fbfs.collection("users");
    const _userProfile = _users.doc(username).collection("/profile");
    _userProfile
      .doc("contact")
      .get()
      .then((doc) => {
        if (doc.exists) {
          const contact = doc.data();
          context.commit(SET_USER_CONTACT, contact);
        }
      });
  },
  doGetUserFinancialData(
    context: ActionContext<ProfileStoreState, any>,
    username: string
  ) {
    const _users = fb.fbfs.collection("users");
    const _userProfile = _users.doc(username).collection("/profile");

    _userProfile
      .doc("financial")
      .get()
      .then((doc) => {
        if (doc.exists) {
          const financial = doc.data();
          context.commit(SET_USER_FINANCIAL, financial);
        }
      });
  },
  doGetUserWeknowData(
    context: ActionContext<ProfileStoreState, any>,
    username: string
  ) {
    const _users = fb.fbfs.collection("users");
    const _userProfile = _users.doc(username).collection("/profile");

    _userProfile
      .doc("weknowData")
      .get()
      .then(async (doc) => {
        if (doc.exists) {
          const WeknowData = doc.data();
          if (context.state.userProfileData == undefined) {
            await context.dispatch(doGetUserBasicProfileData);
          }
          context.commit(SET_USER_WEKNOW_DATA, WeknowData);
        }
      });
  },

  doUpdateUserPersonalInfo(
    context: ActionContext<ProfileStoreState, any>,
    personalInfo: PersonalInfo
  ) {
    const updatePersonalInfo = fb.func.httpsCallable(
      "Profile-updatePersonalInfo"
    );
    return updatePersonalInfo(personalInfo)
      .then((response: any) => {
        if (response.data.OPCODE == "SUCCESS") {
          context.commit(SET_USER_PERSONAL, { ...personalInfo });
          return Promise.resolve();
        }
        return Promise.reject(response.data.ERROR);
      })
      .catch((error: any) => {
        return Promise.reject(error);
      });
  },

  doUpdateUserContactInfo(
    context: ActionContext<ProfileStoreState, any>,
    contactInfo: Contact
  ) {
    const updateContactInfo = fb.func.httpsCallable(
      "Profile-updateContactInfo"
    );
    return updateContactInfo(contactInfo)
      .then((response: any) => {
        if (response.data.OPCODE == "SUCCESS") {
          fb.auth.currentUser?.getIdToken(true).then(() => {
            if (fb.auth.currentUser) {
              fb.auth.currentUser.reload();
            }
          });
          context.commit(SET_USER_CONTACT, { ...contactInfo });
          return Promise.resolve();
        }
        return Promise.reject(response.data.error);
      })
      .catch((error: any) => {
        return Promise.reject(error);
      });
  },

  doUpdateUserAddressInfo(
    context: ActionContext<ProfileStoreState, any>,
    addressInfo: Address
  ) {
    const updateAddressInfo = fb.func.httpsCallable(
      "Profile-updateAddressInfo"
    );
    return updateAddressInfo(addressInfo)
      .then((response: any) => {
        if (response.data.OPCODE == "SUCCESS") {
          context.commit(SET_USER_ADDRESS, { ...addressInfo });
          return Promise.resolve();
        }
        return Promise.reject(response.data.error);
      })
      .catch((error: any) => {
        return Promise.reject(error);
      });
  },

  doUpdateNickname(
    context: ActionContext<ProfileStoreState, any>,
    nickname: string
  ) {
    const updateNickname = fb.func.httpsCallable("Profile-updateNickname");
    return updateNickname(nickname)
      .then((response: any) => {
        if (response.data.OPCODE == "SUCCESS") {
          context.commit(SET_USER_NICKNAME, nickname);
          return Promise.resolve();
        } else {
          return Promise.reject(response.data.error);
        }
      })
      .catch((error: any) => {
        return Promise.reject(error);
      });
  },
  requestSecuredDataUpdate(
    context: ActionContext<ProfileStoreState, any>,
    request: ProcessSecuredDataRequest
  ) {
    const requestSecuredDataUpdate = fb.func.httpsCallable(
      "Profile-requestSecuredDataUpdate"
    );
    return requestSecuredDataUpdate(request)
      .then((response: any) => {
        if (response.data.OPCODE == "SUCCESS") {
          return Promise.resolve();
        }
        return Promise.reject(response.data.message);
      })
      .catch((error: any) => {
        return Promise.reject(error);
      });
  },
  processSecuredDataUpdate(
    context: ActionContext<ProfileStoreState, any>,
    request: SecuredDataRequest
  ) {
    const processSecuredDataUpdate = fb.func.httpsCallable(
      "Profile-processSecuredDataUpdate"
    );
    return processSecuredDataUpdate(request)
      .then((response: any) => {
        if (response.data.OPCODE == "SUCCESS") {
          fb.auth.currentUser?.getIdToken(true).then(() => {
            if (fb.auth.currentUser) {
              fb.auth.currentUser.reload();
            }
          });
          return Promise.resolve(response.data);
        }
        return Promise.reject(response.data.error);
      })
      .catch((error: any) => {
        return Promise.reject(error);
      });
  },
  async updateProfilePicture(
    context: ActionContext<ProfileStoreState, any>,
    request: UpdateProfilePictureRequest
  ) {
    let success = false;
    if (!request.isDefaultImage) {
      success = await images.methods.setImage(request);
    }
    if (success || request.isDefaultImage) {
      const updatePicture = fb.func.httpsCallable("Users-updatePictureURL");
      return updatePicture({
        _usernamePK: request.usernamePK,
        pictureUrl: request.pictureUrl
      })
        .then(async (response) => {
          if (!request.isDefaultImage) {
            await images.methods.removeImage(request.originalUrl);
          }
          context.commit(SET_USER_PROFILE_PICTURE, request.pictureUrl);
          return Promise.resolve(response);
        })
        .catch((error) => {
          return Promise.reject(error);
        });
    }
  },
  async sendVerificationEmail(
    context: ActionContext<ProfileStoreState, any>,
    userEmail: string
  ) {
    const sendEmail = fb.func.httpsCallable("Users-sendEmail");
    return sendEmail(userEmail).then((response: any) => {
      if (response) {
        return true;
      } else {
        return Promise.reject(response);
      }
    });
  }
};

const getters = {
  getUserProfileDetail(state: ProfileStoreState): UserProfileData | undefined {
    return state.userProfileData;
  },
  getUserContactData(state: ProfileStoreState): Contact | undefined {
    return state.userProfileData?.contact;
  },
  getUserAddressData(state: ProfileStoreState): Address | undefined {
    return state.userProfileData?.address;
  },
  getUserFinancialData(state: ProfileStoreState): Financial | undefined {
    return state.userProfileData?.financial;
  },
  getUserPersonalData(state: ProfileStoreState): PersonalInfo | undefined {
    return state.userProfileData?.personal;
  },
  getUserWeknowData(state: ProfileStoreState): WeknowData | undefined {
    return state.userProfileData?.weknowData;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
