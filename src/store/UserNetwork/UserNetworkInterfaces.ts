// import { BinaryTreeNodeUser } from "@/../functions/src/Users/UsersInterfaces";

//export const  = "";
//Actions
export const initializeTree = "initializeTree";
export const doGetUserTree = "doGetUserTree";
export const setRootUsername = "setRootUsername";

//Mutations
export const INIT = "INIT";
export const ADD_NODES_TO_USER = "ADD_NODES_TO_USER";
export const CHANGE_ROOT_USERNAME = "CHANGE_ROOT_USERNAME";

export interface UserNetworkState {
  //binaryTree: BinaryTreeNodeUser | null;
  rootNodeUsername: string;
  // binaryTreeMap: Map<string, BinaryTreeNodeUser>;
  // binaryTreeNodes: Array<BinaryTreeNodeUser>;
}
export interface GetUserTreeRequest {
  username: string;
  levels: number | undefined;
}
