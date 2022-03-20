//export const  = "";
//Actions
export const doGetUserProfile = "doGetUserProfile";
export const getUserPermissions = "getUserPermissions";
export const Login = "login";
export const GetEmailAvailability = "GetEmailAvailability";
export const sendPasswordChangeEmail = "sendPasswordChangeEmail";

//Mutations
export const SET_USER_PROFILE = "SET_USER_PROFILE";
export const CLEAR_USER_PROFILE = "CLEAR_USER_PROFILE";
export const SET_USER_PERMISSIONS = "SET_USER_PERMISSIONS";
export const CLEAR_USER_PERMISSIONS = "CLEAR_USER_PERMISSIONS";
export const SET_EMAIL_STATUS = "SET_EMAIL_STATUS";
export const SET_PROFILE_SNAPSHOT_LISTENER = "SET_PROFILE_SNAPSHOT_LISTENER";
export const CLEAR_PROFILE_SNAPSHOT_LISTENER =
  "CLEAR_PROFILE_SNAPSHOT_LISTENER";

export interface LoginInfo {
  userIdentification: string;
  password: string;
}

export interface NewUserData {
  email: string;
  username: string;
  password: string;
  passwordConfirm: string;
  enroller: string;
  binarySide: string;
}

export interface RankStatus {
  _id: string;
  progress: number;
  status: "current" | "unlocked" | "next" | "locked";
  date?: Date;
  priority: number;
}

export interface UserProfile {
  _uid: string;
  _usernamePK: string;
  binarySide: string;
  currentRank: string;
  email: string;
  enroller: string;
  nickname: string;
  pictureUrl: string;
  username: string;
  ranksCarrerData: Map<string, RankStatus> | undefined;
}

export interface AuthStoreState {
  userProfileData: UserProfile | undefined;
  userPermissions: Array<string>;
  userVerified: boolean;
  profileSnapshopListener: () => void;
}

export interface DownlineUser {
  username: string;
  binarySide: "left" | "right";
}
