/* eslint-disable @typescript-eslint/no-unused-vars */
import * as fb from "../../firebase";
// import router from "../../router";
import { CommitInterface } from "..";
import {
  MenuItem,
  GET_MENU_SUCCESS,
  ProfilePermissions,
  SystemState,
  SystemConfig,
  SET_SYSTEM_CONFIG,
  SET_CONFIG_LISTENER,
  CLEAR_CONFIG_LISTENER,
  NoticeParams,
  Country,
  SET_SYSTEM_CATALOG_COUNTRIES
} from "./SystemConfigInterfaces";

const state: SystemState = {
  UserMenu: new Array<MenuItem>(),
  ProfilePermissions: new Array<ProfilePermissions>(),
  SystemConfig: {
    offline: false,
    slogan: ["¡Llegó tu momento!"],
    wideNotices: []
  },
  SystemCatalogs: {
    countries: new Map<string, Country>()
  },
  SysConfigListener: () => {
    return;
  }
};

const mutations = {
  GET_PROFILES_CONFIG_SUCCESS(
    state: SystemState,
    profilePermissions: Array<ProfilePermissions>
  ) {
    state.ProfilePermissions = profilePermissions;
  },
  GET_MENU_SUCCESS(state: SystemState, options: Array<MenuItem>) {
    state.UserMenu = options;
  },
  SET_SYSTEM_CONFIG(state: SystemState, options: SystemConfig) {
    state.SystemConfig = options;
  },
  SET_SYSTEM_CATALOG_COUNTRIES(
    state: SystemState,
    countries: Map<string, Country>
  ) {
    state.SystemCatalogs.countries = countries;
  },
  SET_CONFIG_LISTENER(state: SystemState, listener: () => void) {
    state.SysConfigListener = listener;
  },
  CLEAR_CONFIG_LISTENER(state: SystemState) {
    state.SysConfigListener = function() {
      return;
    };
  }
};
const actions = {
  async doGetSystemConfig({ commit }: CommitInterface) {
    const _systemCatalogsRef = fb.fbfs.collection("systemCatalogs");
    const _systemConfigRef = fb.fbfs.collection("systemConfiguration");
    const configListener = _systemConfigRef
      .doc("frontend")
      .onSnapshot((doc) => {
        if (doc.data()) {
          const config = doc.data() as SystemConfig;
          commit(SET_SYSTEM_CONFIG, config);
        }
      });
    commit(SET_CONFIG_LISTENER, configListener);
    //const countriesListener =
    _systemCatalogsRef
      .doc("countries")
      .get()
      .then((doc) => {
        if (doc.data()) {
          const countries = doc.data() as Map<string, Country>;
          commit(SET_SYSTEM_CATALOG_COUNTRIES, countries);
        }
      });
  },
  clearConfigListener({ commit }: CommitInterface) {
    commit(CLEAR_CONFIG_LISTENER);
  },
  async doGetAllProfiles({ commit }: CommitInterface) {
    const _permissions = fb.fbfs.collection("permissions");
    return _permissions
      .get()
      .then((profiles) => {
        if (profiles.size > 0) {
          const confs: any[] = [];
          profiles.forEach((d) => {
            const s = d.data();
            s.profileId = d.id;
            confs.push(s);
          });
          //commit(GET_PROFILES_CONFIG_SUCCESS, confs);
          return Promise.resolve(confs);
        } else {
          throw "No configured profiles could be retreived";
        }
      })
      .catch((error) => {
        return Promise.reject(error);
      });
  },
  async doGetMenu({ commit }: CommitInterface) {
    const _menu = fb.fbfs.collection("menu");
    return _menu
      .get()
      .then((items) => {
        if (items.size > 0) {
          let menu: any[] = [];
          items.forEach((d) => {
            const s = d.data();
            menu.push(s);
          });
          menu = menu.sort((a, b) =>
            a.Priority > b.Priority ? 1 : b.Priority > a.Priority ? -1 : 0
          );

          commit(GET_MENU_SUCCESS, menu);
        } else {
          throw "No configured menu could be retreived";
        }
      })
      .catch((error) => {
        return Promise.reject(error);
      });
  },
  async addProfile({ commit }: CommitInterface, request: ProfilePermissions) {
    return fb.fbfs
      .doc("permissions/" + request.profileId)
      .set({
        data: request.data
      })
      .then(() => {
        return {
          OPCODE: "SUCCESS",
          message: "Successfully added class in collection"
        };
      })
      .catch((error) => {
        return {
          OPCODE: "ERROR",
          message: error.message,
          errorDetail: error
        };
      });
  },
  async updateProfile(
    { commit }: CommitInterface,
    request: ProfilePermissions
  ) {
    return fb.fbfs
      .doc("permissions/" + request.profileId)
      .update({
        data: request.data
      })
      .then(() => {
        return {
          OPCODE: "SUCCESS",
          message: "Successfully updated class in collection"
        };
      })
      .catch((error) => {
        return {
          OPCODE: "ERROR",
          message: error.message,
          errorDetail: error
        };
      });
  },
  async doGetAllUsers({ commit }: CommitInterface) {
    const _users = fb.fbfs.collection("users");
    return _users
      .get()
      .then((users) => {
        if (users.size > 0) {
          const response: any[] = [];
          users.forEach((d) => {
            const u = d.data();
            u.userPK = d.id;
            response.push({ userPK: u.userPK, roles: u.roles });
          });
          return Promise.resolve(response);
        } else {
          throw "No configured users could be retreived";
        }
      })
      .catch((error) => {
        return Promise.reject(error);
      });
  },
  async updateUserProfiles({ commit }: CommitInterface, request: any) {
    const _user = request.userPK;
    const _roles = request.roles;

    return fb.fbfs
      .doc("users/" + _user)
      .update({
        roles: _roles
      })
      .then(() => {
        return {
          OPCODE: "SUCCESS",
          message: "Successfully updated permissions in collection"
        };
      })
      .catch((error) => {
        return {
          OPCODE: "ERROR",
          message: error.message,
          errorDetail: error
        };
      });
  }
};
const getters = {
  getUserMenuItemByRoute(state: SystemState) {
    return (menuName: string): MenuItem => {
      const menuResponse = state.UserMenu.find((menu: MenuItem) => {
        return menu.Key === menuName;
      });
      if (!menuResponse) {
        switch (menuName) {
          case "trading-academy":
            return new MenuItem(
              0,
              "",
              "Academia Virtual",
              "fas fa-chalkboard-teacher",
              "",
              ""
            );
          case "gtr-system":
            return new MenuItem(
              0,
              "",
              "Sistema GTR Academy",
              "fas fa-brain",
              "",
              ""
            );
          case "distributor-license":
            return new MenuItem(
              0,
              "",
              "Licencia de Distribuidor",
              "bi bi-briefcase-fill",
              "",
              ""
            );
          default:
            return new MenuItem(
              0,
              "",
              "Not Found",
              "fas fa-bug text-cyan",
              "",
              ""
            );
        }
      } else {
        return menuResponse;
      }
    };
  },
  getProfilesPermissions(state: SystemState): Array<ProfilePermissions> {
    return state.ProfilePermissions;
  },
  getSystemConfig(state: SystemState): SystemConfig {
    return state.SystemConfig;
  },
  isOffline(state: SystemState): boolean {
    return state.SystemConfig.offline;
  },
  getSlogan(state: SystemState): Array<string> {
    return state.SystemConfig.slogan;
  },
  getWideNotices(state: SystemState): Array<NoticeParams> {
    return state.SystemConfig.wideNotices;
  },
  getCountries(state: SystemState): Array<Country> {
    const countriesObject = new Object(state.SystemCatalogs.countries);
    const countriesArray = Object.values(countriesObject);
    if (countriesArray.length > 0) {
      return countriesArray;
    } else {
      return [];
    }
  },
  getEnabledCountries(state: SystemState): Array<Country> {
    const countriesObject = new Object(state.SystemCatalogs.countries);
    const countriesArray = Object.values(countriesObject);
    if (countriesArray.length > 0) {
      const resp = countriesArray.filter((country) => {
        return country.enabled === true;
      });
      return resp;
    } else {
      return [];
    }
  },
  getStarredCountries(state: SystemState): Array<Country> {
    const countriesObject = new Object(state.SystemCatalogs.countries);
    const countriesArray = Object.values(countriesObject);
    const starred = countriesArray
      .filter((country: Country) => {
        return country.starred === true;
      })
      .sort((a: Country, b: Country) => {
        if (a.priority === b.priority) {
          return a.spanish.localeCompare(b.spanish);
        } else {
          return a.priority - b.priority;
        }
      });
    return starred;
  },
  getCountryByAlpha3Code(state: SystemState) {
    return (alpha3Code: string): Country | undefined => {
      const countriesObject = new Object(state.SystemCatalogs.countries);
      const countriesArray = Object.values(countriesObject) as Array<Country>;
      if (countriesArray.length > 0) {
        const resp = countriesArray.find((country) => {
          return country.alpha3Code === alpha3Code;
        });
        return resp;
      } else {
        return undefined;
      }
    };
  },
  getCountryByAlpha2Code(state: SystemState) {
    return (alpha2Code: string): Country | undefined => {
      const countriesObject = new Object(state.SystemCatalogs.countries);
      const countriesArray = Object.values(countriesObject) as Array<Country>;
      if (countriesArray.length > 0) {
        const resp = countriesArray.find((country) => {
          return country.alpha2Code === alpha2Code;
        });
        return resp;
      } else {
        return undefined;
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
