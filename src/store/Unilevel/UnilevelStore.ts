/* eslint-disable @typescript-eslint/no-non-null-assertion */
import firebase from "firebase/app";
import "firebase/firestore";
import { ActionContext } from "vuex";
import * as fb from "../../firebase";
import { DownlineUser } from "../Auth/AuthInterfaces";
//import router from "../../router";
import {
  ADD_MEMBER_TO_TEAM,
  CHANGE_TEAM_LEADER,
  doGetLeaderData,
  doGetTeam,
  INIT,
  UnilevelMember,
  UnilevelState,
  UnilevelTeam
} from "./UnilevelInterfaces";

const initialState: UnilevelState = {
  teamLeader: "",
  team: undefined,
  teamMap: new Map<string, UnilevelTeam>()
};
const state: UnilevelState = { ...initialState };

const mutations = {
  INIT(state: UnilevelState, rootLeader: UnilevelMember) {
    const team: UnilevelTeam = {
      leader: rootLeader,
      leftTeam: new Array<UnilevelTeam>(),
      rightTeam: new Array<UnilevelTeam>()
    };
    state.teamLeader = rootLeader.username.toLowerCase();
    state.team = team;
    state.teamMap = new Map<string, UnilevelTeam>();
    state.teamMap.set(rootLeader.username.toLowerCase(), team);
  },
  ADD_TEAM_DATA(state: UnilevelState, team: UnilevelTeam) {
    const teamLeaderNode = state.teamMap.get(
      team.leader.username.toLowerCase()
    );
    if (teamLeaderNode != undefined) {
      teamLeaderNode.leftTeam = team.leftTeam;
      teamLeaderNode.rightTeam = team.rightTeam;
      team.leftTeam.forEach((e) => {
        state.teamMap.set(e.leader.username.toLowerCase(), e);
      });
      team.rightTeam.forEach((e) => {
        state.teamMap.set(e.leader.username.toLowerCase(), e);
      });
    }
  },
  ADD_MEMBER_TO_TEAM(
    state: UnilevelState,
    payload: {
      leaderUsername: string;
      side: "left" | "right";
      member: UnilevelMember;
    }
  ) {
    const teamLeaderNode = state.teamMap.get(
      payload.leaderUsername.toLowerCase()
    );
    if (teamLeaderNode != undefined) {
      const newTeam: UnilevelTeam = {
        leader: payload.member,
        leftTeam: new Array<UnilevelTeam>(),
        rightTeam: new Array<UnilevelTeam>()
      };
      const nextRankRequiredPoints =
        teamLeaderNode.leader.nextRankRequiredPoints;
      if (payload.side == "left") {
        if (
          !teamLeaderNode.leftTeam.find((u) => {
            return u.leader.usernamePK == payload.member.usernamePK;
          })
        ) {
          if (newTeam.leader.points.qualifying > nextRankRequiredPoints * 0.4)
            teamLeaderNode.leader.points.valid.left +=
              nextRankRequiredPoints * 0.4;
          else {
            teamLeaderNode.leader.points.valid.left +=
              newTeam.leader.points.qualifying;
          }
          teamLeaderNode.leftTeam.push(newTeam);
        }
      } else if (payload.side == "right") {
        if (
          !teamLeaderNode.rightTeam.find((u) => {
            return u.leader.usernamePK == payload.member.usernamePK;
          })
        ) {
          if (newTeam.leader.points.qualifying > nextRankRequiredPoints * 0.4)
            teamLeaderNode.leader.points.valid.right +=
              nextRankRequiredPoints * 0.4;
          else {
            teamLeaderNode.leader.points.valid.right +=
              newTeam.leader.points.qualifying;
          }
          teamLeaderNode.rightTeam.push(newTeam);
        }
      }
      state.teamMap.set(newTeam.leader.username.toLowerCase(), newTeam);
    }
  },
  CHANGE_TEAM_LEADER(state: UnilevelState, newLeaderUsername: string) {
    state.teamLeader = newLeaderUsername;
  }
};

const actions = {
  async initializeTeam(context: ActionContext<UnilevelState, any>) {
    await context.dispatch(
      doGetLeaderData,
      context.rootState.auth.userProfileData._usernamePK
    );
    await context.dispatch(
      doGetTeam,
      context.rootState.auth.userProfileData._usernamePK
    );
  },
  async doGetLeaderData(
    context: ActionContext<UnilevelState, any>,
    username: string
  ) {
    const _usernamePK = username.toLowerCase();
    const getLeaderData = fb.func.httpsCallable("Unilevel-getLeaderData");
    const result: UnilevelMember | undefined = await getLeaderData({
      username: _usernamePK
    }).then((result) => {
      if (result.data.OPCODE == "SUCCESS") {
        const memberData = result.data.data;
        for (const rankData in memberData.ranksCarrerData) {
          const timestamp = new firebase.firestore.Timestamp(
            memberData.ranksCarrerData[rankData].date._seconds,
            memberData.ranksCarrerData[rankData].date._nanoseconds
          );
          memberData.ranksCarrerData[rankData].date = timestamp;
        }
        memberData.subscriptions = new Map(
          Object.entries(memberData.subscriptions)
        );

        if (memberData.scholarshipData != undefined) {
          memberData.scholarshipData.periodEndDate = new firebase.firestore.Timestamp(
            memberData.scholarshipData.periodEndDate._seconds,
            memberData.scholarshipData.periodEndDate._nanoseconds
          ).toDate();
        }

        return memberData as UnilevelMember;
      } else {
        return undefined;
      }
    });
    if (result != undefined) {
      context.commit(INIT, result);
    }
  },
  async doGetTeam(
    context: ActionContext<UnilevelState, any>,
    username: string
  ) {
    const _usernamePK = username.toLowerCase();

    const getEnrolledUsers = fb.func.httpsCallable("Users-getEnrolledUsers");
    const getLeaderData = fb.func.httpsCallable("Unilevel-getLeaderData");

    const downlineUsers: Array<DownlineUser> = await getEnrolledUsers({
      username: username
    }).then((result) => {
      if (result.data.OPCODE == "SUCCESS") {
        const users = result.data.data;
        return users;
      } else {
        return new Array<DownlineUser>();
      }
    });

    //downlineUsers.forEach((user) => {
    for (const user of downlineUsers) {
      getLeaderData({ username: user.username }).then((result) => {
        if (result.data.OPCODE == "SUCCESS") {
          const memberData = result.data.data;
          for (const rankData in memberData.ranksCarrerData) {
            const timestamp = new firebase.firestore.Timestamp(
              memberData.ranksCarrerData[rankData].date._seconds,
              memberData.ranksCarrerData[rankData].date._nanoseconds
            );
            memberData.ranksCarrerData[rankData].date = timestamp;
          }
          memberData.subscriptions = new Map(
            Object.entries(memberData.subscriptions)
          );
          if (memberData.scholarshipData != undefined) {
            memberData.scholarshipData.periodEndDate = new firebase.firestore.Timestamp(
              memberData.scholarshipData.periodEndDate._seconds,
              memberData.scholarshipData.periodEndDate._nanoseconds
            ).toDate();
          }

          context.commit(ADD_MEMBER_TO_TEAM, {
            leaderUsername: _usernamePK,
            side: user.binarySide,
            member: memberData
          });
        }
      });
    }
  },
  async setLeaderUsername(
    context: ActionContext<UnilevelState, any>,
    newLeaderUsername: string
  ) {
    newLeaderUsername =
      newLeaderUsername == "" || newLeaderUsername == undefined
        ? context.rootState.auth.userProfileData._usernamePK
        : newLeaderUsername.toLocaleLowerCase();
    context.commit(CHANGE_TEAM_LEADER, newLeaderUsername);
  }
};

const getters = {
  getTeam(state: UnilevelState, getters: any, rootState: any) {
    return (username?: string): UnilevelTeam | undefined => {
      username =
        username?.toLowerCase() || rootState.auth.userProfileData._usernamePK;
      if (username) {
        const team = state.teamMap.get(username);
        if (team) {
          return team;
        }
      }
    };
  },
  getCurrentTeam(state: UnilevelState): UnilevelTeam | undefined {
    const team = state.teamMap.get(state.teamLeader);
    return team;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
