import * as fb from "../../firebase";
// import router from "../../router";

// import { DataResponse } from "@/../functions/src/responseTypes";
import {
  ADD_NODES_TO_USER,
  CHANGE_ROOT_USERNAME,
  doGetUserTree,
  GetUserTreeRequest,
  INIT,
  UserNetworkState
} from "./UserNetworkInterfaces";
import { ActionContext } from "vuex";
// import { BinaryTreeNodeUser } from "@/../functions/src/Users/UsersInterfaces";

// const initialState: UserNetworkState = {
//   rootNodeUsername: "",
//   binaryTreeNodes: new Array<BinaryTreeNodeUser>(),
//   binaryTreeMap: new Map<string, BinaryTreeNodeUser>()
// };

// const state: UserNetworkState = { ...initialState };
const mutations = {
  INIT(state: UserNetworkState, currentUser: string) {
    state.rootNodeUsername = currentUser;
    // state.binaryTreeNodes = new Array<BinaryTreeNodeUser>();
    // state.binaryTreeMap = new Map<string, BinaryTreeNodeUser>();
  },
  // ADD_NODES_TO_USER(state: UserNetworkState, tree: BinaryTreeNodeUser[]) {
  //   if (state.binaryTreeNodes.length == 0 || state.binaryTreeMap.size == 0) {
  //     //Assign tree and Create tree Map
  //     state.binaryTreeNodes = tree;
  //     tree.forEach((n) => {
  //       state.binaryTreeMap.set(n.username, n);
  //     });
  //   } else {
  //     //Find user to update
  //     // asign left and right childs
  //     tree.forEach((n) => {
  //       const mapNode = state.binaryTreeMap.get(n.username);
  //       if (mapNode) {
  //         //If there is a node, update
  //         mapNode.loadedLevels = n.loadedLevels;
  //         mapNode.childLeft = n.childLeft;
  //         mapNode.childRight = n.childRight;
  //       } else {
  //         state.binaryTreeNodes.push(n);
  //         state.binaryTreeMap.set(n.username, n);
  //       }
  //     });
  //   }
  // },
  CHANGE_ROOT_USERNAME(state: UserNetworkState, newUsername: string) {
    state.rootNodeUsername = newUsername;
  }
};

const actions = {
  async initializeTree(context: ActionContext<UserNetworkState, any>) {
    //if (state.binaryTreeNodes.length == 0) {
    context.commit(INIT, context.rootState.auth.userProfileData._usernamePK);
    await context.dispatch(doGetUserTree, {
      username: context.rootState.auth.userProfileData._usernamePK,
      levels: 4
    });
    //}
  },
  async doGetUserTree(
    context: ActionContext<UserNetworkState, any>,
    request: GetUserTreeRequest
  ) {
    const getBinaryTree = fb.func.httpsCallable("Users-getBinaryTree");
    try {
      const r = await getBinaryTree(request);
      // const response: DataResponse<BinaryTreeNodeUser[]> = r.data;
      // const tree: BinaryTreeNodeUser[] = response.data;
      context.commit(ADD_NODES_TO_USER);
    } catch (e) {
      alert(e);
    }
  },
  async setRootUsername(
    context: ActionContext<UserNetworkState, any>,
    newUsername: string
  ) {
    newUsername =
      newUsername == "" || newUsername == undefined
        ? context.rootState.auth.userProfileData._usernamePK
        : newUsername;
    context.commit(CHANGE_ROOT_USERNAME, newUsername);
  }
};

const getters = {
  getTreeForUser(state: UserNetworkState, getters: any, rootState: any) {
    // return (username?: string): BinaryTreeNodeUser => {
    //   username =
    //     username?.toLowerCase() || rootState.auth.userProfileData._usernamePK;
    //   // console.log(username);
    //   // console.log("treeMap", state.binaryTreeMap);
    //   // console.log("treeNodes", state.binaryTreeNodes);
    //   if (username && state.binaryTreeMap.get) {
    //     const node = state.binaryTreeMap.get(username);
    //     if (node) {
    //       return node;
    //     }
    //   }
    //   return new BinaryTreeNodeUser();
    // };
  }
  // ,
  // getRootUserNode(state: UserNetworkState): undefined {
  //   // if (state.binaryTreeMap.get) {
  //   //   return state.binaryTreeMap.get(state.rootNodeUsername);
  //   // }
  // }
};

export default {
  namespaced: true,
  // state,
  getters,
  actions,
  mutations
};
