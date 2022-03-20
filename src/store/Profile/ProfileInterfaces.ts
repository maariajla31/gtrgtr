//Mutations
//export const SET_USER_DETAIL = "SET_USER_DETAIL";
export const SET_AUTH_PROFILE_DATA = "SET_AUTH_PROFILE_DATA";
export const SET_USER_PERSONAL = "SET_USER_PERSONAL";
export const SET_USER_ADDRESS = "SET_USER_ADDRESS";
export const SET_USER_CONTACT = "SET_USER_CONTACT";
export const SET_USER_FINANCIAL = "SET_USER_FINANCIAL";
export const SET_USER_NICKNAME = "SET_USER_NICKNAME";
export const SET_USER_PROFILE_PICTURE = "SET_USER_PROFILE_PICTURE";
export const SET_USER_METADATA = "SET_USER_METADATA";
export const SET_USER_WEKNOW_DATA = "SET_USER_WEKNOW_DATA";
export const CLEAR_USER_PROFILE_DETAIL = "CLEAR_USER_PROFILE_DETAIL";

//Actions
export const doGetUserBasicProfileData = "doGetUserBasicProfileData";
export const doGetUserProfileData = "doGetUserProfileData";
export const doGetUserPersonalData = "doGetUserPersonalData";
export const doGetUserAddressData = "doGetUserAddressData";
export const doGetUserContactData = "doGetUserContactData";
export const doGetUserFinancialData = "doGetUserFinancialData";
export const doGetUserWeknowData = "doGetUserWeknowData";
export const requestSecuredDataUpdate = "requestSecuredDataUpdate";
export const processSecuredDataUpdate = "processSecuredDataUpdate";

//Getters
export const getUserProfileDetail = "getUserProfileDetail";
export const getUserContactData = "getUserContactData";
export const getUserAddressData = "getUserAddressData";
export const getUserFinancialData = "getUserFinancialData";
export const getUserPersonalData = "getUserPersonalData";

export interface ProfileStoreState {
  userProfileData?: UserProfileData;
}

export interface UserProfileData {
  _uid: string;
  _usernamePK: string;
  binarySide: string;
  currentRank: string;
  enroller: string;
  nickname: string;
  pictureUrl: string;
  coverPictureUrl?: string;
  username: string;

  personal?: PersonalInfo;
  address?: Address;
  contact: Contact;
  financial?: Financial;
  metadata?: Metadata;
  weknowData?: WeknowData;
}
export interface PersonalInfo {
  names?: string; //first+middle
  lastName?: string;
  motherLastname?: string;
  gender?: string;
  dateOfBirth?: string; //YYYY-MM-DD
  curp?: string;
}
export interface Contact {
  email: StringData;
  mobile?: MobileData;
  telegram?: NumberData;
  whatsapp?: NumberData;
  facebook?: StringData;
  instagram?: StringData;
  tiktok?: StringData;
}

interface Visible {
  visible: boolean;
}
interface StringData extends Visible {
  data: string;
}
interface NumberData extends Visible {
  data: {
    dialCode: string;
    number: string;
  };
}

interface MobileData extends NumberData {
  whatsapp: boolean;
  telegram: boolean;
}
export interface Address {
  city?: string;
  country?: string;
  neighborhood?: string;
  state?: string;
  street?: string;
  zipCode?: string;
}

export interface Financial {
  btcWallet?: WalletInfo;
}

export interface WalletInfo {
  address: string;
  label?: string;
}
export interface Metadata {
  creationTime: Date;
  lastSignInTime: Date;
  lastRefreshTime: Date;
}

export interface WeknowData {
  dateUpdated?: Date;
  endDate: Date;
  userId?: number;
  lastUserId?: number;
  status: "deleted" | "active";
}

export interface UserProfileCardData {
  currentRank: string;
  enroller: string;
  nickname: string;
  pictureUrl: string;
  coverPictureUrl?: string;
  username: string;
  city?: string;
  state?: string;
  country?: string;
  contact: Contact;
  metadata?: Metadata;
}

export interface SecuredDataRequest {
  data: any;
  type: "btcWallet" | "email";
  requestId: string;
  requestTag: string;
}

export interface ProcessSecuredDataRequest {
  requestTag: string;
  confirmationCode: string;
}

export interface UpdateProfilePictureRequest {
  usernamePK: string;
  originalUrl: string;
  pictureUrl: string;
  dataBase64Url?: string;
  isDefaultImage: boolean;
}
