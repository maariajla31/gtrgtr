import * as fb from "../../firebase";
import { RankStatus } from "../Auth/AuthInterfaces";

//export const  = "";
//Actions
//export const action = "action";
export const initializeTeam = "initializeTeam";
export const doGetLeaderData = "doGetLeaderData";
export const doGetTeam = "doGetTeam";
export const setLeaderUsername = "setLeaderUsername";

//Mutations
//export const MUTATION_EXAMPLE = "MUTATION_EXAMPLE";
export const INIT = "INIT";
export const ADD_TEAM_DATA = "ADD_TEAM_DATA";
export const ADD_MEMBER_TO_TEAM = "ADD_MEMBER_TO_TEAM";
export const CHANGE_TEAM_LEADER = "CHANGE_TEAM_LEADER";

export interface UnilevelState {
  teamLeader: string;
  team: UnilevelTeam | undefined;
  teamMap: Map<string, UnilevelTeam>;
}

export interface UnilevelPoints {
  valid: {
    right: number;
    left: number;
  };
  current: number;
  qualifying: number;
  left: number;
  right: number;
}

export interface UnilevelMember extends AffiliatesData {
  usernamePK: string;
  nickname: string;
  username: string;
  currentRank: string;
  currentRankPriority: number;
  pictureUrl: string;
  enroller: string;
  // Subscription Name -> remaining days
  subscriptions: Map<string, number>;
  ranksCarrerData: Map<string, RankStatus>;
  nextRank: string;
  nextRankRequiredPoints: number;
  scholarshipData?: ScholarshipData;
}

export interface AffiliatesData {
  points: UnilevelPoints;
  invoicedTotal: number;
  directAffiliates: number;
}

export interface ScholarshipData {
  periodPoints: number;
  periodEndDate: Date;
}

export interface UnilevelTeam {
  leader: UnilevelMember;
  leftTeam: Array<UnilevelTeam>;
  rightTeam: Array<UnilevelTeam>;
}

export class UnilevelMember implements UnilevelMember {
  constructor(
    nickname: string,
    username: string,
    rank: string,
    pictureUrl: string,
    enroller: string,
    ranksCarrerData: Map<string, RankStatus>
  ) {
    this.nickname = nickname;
    this.usernamePK = username.toLowerCase();
    this.username = username;
    this.currentRank = rank;
    this.pictureUrl = pictureUrl;
    this.enroller = enroller;
    this.points = {
      valid: {
        right: 0,
        left: 0
      },
      current: 0,
      left: 0,
      right: 0,
      qualifying: 0
    };
    this.invoicedTotal = 0;
    this.subscriptions = new Map<string, number>();
    this.directAffiliates = 0;
    this.ranksCarrerData = ranksCarrerData;
  }
}

export function _getMemberAffiliatesData(
  username: string
): Promise<AffiliatesData | undefined> {
  const _usernamePK = username.toLowerCase();
  const _user = fb.fbfs.collection("users").doc(_usernamePK);
  return _user
    .collection("networkData")
    .doc("directAffiliates")
    .get()
    .then((da) => {
      if (da.exists && da.data()) {
        const daData = da.data();
        const affData: AffiliatesData = {
          directAffiliates: daData?.directsCount,
          invoicedTotal: daData?.invoicedTotal,
          points: daData?.points
        };
        return Promise.resolve(affData);
      }
    })
    .catch((e) => {
      return Promise.reject(
        "Error al obtener datos de Afiliados directos: " + e
      );
    });
}

export function _getMemberSubscriptionsData(
  username: string
): Promise<Map<string, number>> {
  const _usernamePK = username.toLowerCase();
  const _user = fb.fbfs.collection("users").doc(_usernamePK);
  const currentDate = new Date();

  return _user
    .collection("subscriptions")
    .get()
    .then((subs) => {
      const subsMap = new Map<string, number>();
      if (!subs.empty) {
        subs.docs.forEach((doc) => {
          const subsData = doc.data();
          const remainingDays = Math.ceil(
            (subsData.endDate.toDate() - currentDate.getTime()) /
              (1000 * 3600 * 24)
          );
          subsMap.set(doc.id, remainingDays);
        });
      }
      return Promise.resolve(subsMap);
    })
    .catch((e) => {
      return Promise.reject("Error al obtener datos de Subscripciones: " + e);
    });
}

export async function _getMemberData(userData: any): Promise<UnilevelMember> {
  const _usernamePK = userData.username.toLowerCase();
  const memberData: UnilevelMember = new UnilevelMember(
    userData.nickname,
    userData.username,
    userData.currentRank,
    userData.pictureUrl,
    userData.enroller,
    userData.ranksCarrerData
  );
  memberData.nextRank = nextRank(userData.ranksCarrerData);
  const daPromise = _getMemberAffiliatesData(_usernamePK).then((da) => {
    if (da != undefined) {
      memberData.invoicedTotal = da.invoicedTotal;
      memberData.points = da.points;
      memberData.points.valid = { right: 0, left: 0 };
      memberData.directAffiliates = da.directAffiliates;
    }
  });
  const subsPromise = _getMemberSubscriptionsData(_usernamePK).then((subs) => {
    memberData.subscriptions = subs;
  });
  return await Promise.all([daPromise, subsPromise]).then(() => {
    return Promise.resolve(memberData);
  });
}

function nextRank(ranksCarrerData: any): string {
  for (const prop in ranksCarrerData) {
    if (ranksCarrerData[prop].status === "next") {
      return prop;
    }
  }
  return "INITIAL";
}
