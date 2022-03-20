import { CommitInterface } from "..";
import * as fb from "../../firebase";
import {
  BuildSchedule,
  ClassesState,
  sortTime,
  TimeWeekDefinition
} from "./ClassesInterfases";

const initialState: ClassesState = {
  academy: new Map<string, TimeWeekDefinition>(),
  gtrSystem: new Map<string, TimeWeekDefinition>()
};

const state = initialState;

const mutations = {
  SET_CLASSES(
    state: ClassesState,
    data: { scheduleId: string; schedule: Map<string, TimeWeekDefinition> }
  ) {
    switch (data.scheduleId) {
      case "academy":
        state.academy = data.schedule;
        break;
      case "gtrSystem":
        state.gtrSystem = data.schedule;
        break;
    }
  },
  SET_SCHEDULE_ACADEMY(
    state: ClassesState,
    schedule: Map<string, TimeWeekDefinition>
  ) {
    state.academy = schedule;
  },
  SET_SCHEDULE_GTR(
    state: ClassesState,
    schedule: Map<string, TimeWeekDefinition>
  ) {
    state.gtrSystem = schedule;
  }
};

const actions = {
  doGetSchedules({ commit }: CommitInterface) {
    const _schedule = fb.fbfs.collection("schedule");

    let academyClasses = new Map<string, TimeWeekDefinition>();
    let gtrClasses = new Map<string, TimeWeekDefinition>();

    const days = [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday"
    ];

    const academyPromises = [];
    for (let i = 0; i < days.length; i++) {
      const day = days[i];
      const academyP = _schedule
        .doc("academy")
        .collection(day)
        .get()
        .then((querySnapshot) => {
          if (!querySnapshot.empty) {
            BuildSchedule(querySnapshot, day, academyClasses);
            return Promise.resolve();
          }
        });
      academyPromises.push(academyP);

      const gtrP = _schedule
        .doc("gtrSystem")
        .collection(day)
        .get()
        .then((querySnapshot) => {
          if (!querySnapshot.empty) {
            BuildSchedule(querySnapshot, day, gtrClasses);
            return Promise.resolve();
          }
        });
      academyPromises.push(gtrP);
    }

    Promise.all(academyPromises).then(() => {
      academyClasses = new Map([...academyClasses].sort(sortTime));
      commit("SET_SCHEDULE_ACADEMY", academyClasses);
      //console.log(academyClasses);

      gtrClasses = new Map([...gtrClasses].sort(sortTime));
      commit("SET_SCHEDULE_GTR", gtrClasses);
      //console.log(gtrClasses);
    });
  }
};

const getters = {
  getAcademySchedule(state: ClassesState): Map<string, TimeWeekDefinition> {
    return state.academy;
  },
  getGtrSystemSchedule(state: ClassesState): Map<string, TimeWeekDefinition> {
    return state.gtrSystem;
  },
  getSchedule(state: ClassesState) {
    return (scheduleId: string): Map<string, TimeWeekDefinition> => {
      switch (scheduleId) {
        case "trading-academy":
          return state.academy;
        case "gtr-system":
          return state.gtrSystem;
        default:
          return state.academy;
      }
    };
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
