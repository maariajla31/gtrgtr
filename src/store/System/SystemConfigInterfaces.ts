export interface SystemState {
  ProfilePermissions: Array<ProfilePermissions>;
  UserMenu: Array<MenuItem>;
  SystemConfig: SystemConfig;
  SystemCatalogs: {
    countries: Map<string, Country>;
  };
  SysConfigListener: () => void;
}

export interface SystemConfig {
  offline: boolean;
  slogan: Array<string>;
  wideNotices: Array<NoticeParams>;
}

export interface NoticeParams {
  src: string;
  link?: string;
  interval: number | 8000;
}
interface MenuItemElements {
  readonly Priority: number;
  readonly Key: string;
  readonly Label: string;
  readonly Icon: string;
  readonly Color: string;
  readonly Route: string;
}
export class MenuItem implements MenuItemElements {
  constructor(
    readonly Priority: number,
    readonly Key: string,
    readonly Label: string,
    readonly Icon: string,
    readonly Color: string,
    readonly Route: string
  ) {}
}

export interface Country {
  readonly alpha3Code: string;
  readonly alpha2Code: string;
  readonly enabled: boolean;
  readonly priority: number;
  readonly starred: boolean;
  readonly spanish: string;
  readonly english: string;
  readonly french: string;
  readonly dialCode?: string;
}

// export const Menu = {
//   _UserMenu: [
//     // eslint-disable-next-line
//     new MenuItem(100, "home", "Inicio", "bi bi-clipboard-data", "red", "/home"),
//     // eslint-disable-next-line
//     new MenuItem(200, "subscriptions", "Suscripciones", "bi bi-award","indigo", "/subscriptions"),
//     // eslint-disable-next-line
//     new MenuItem(300, "commissions", "Comisiones", "bi bi-wallet2","green", "/commissions"),
//     // eslint-disable-next-line
//     new MenuItem(400, "withdrawals", "Retiros", "fa fab fa-bitcoin","yellow", "/withdrawals"),
//     // eslint-disable-next-line
//     new MenuItem(500, "payments", "Pagos Realizados", "bi bi-credit-card","cyan", "/payments"),
//     // eslint-disable-next-line
//     new MenuItem(600, "unilevel", "Afiliados", "bi bi-diagram-3","orange", "/unilevel"),
//     // eslint-disable-next-line
//     new MenuItem(700, "binary-network", "Red Binaria", "bi bi-diagram-2","purple", "/binary-network"),
//     // eslint-disable-next-line
//     new MenuItem(800, "profile", "Mi Perfil", "bi bi-person","blue", "/profile"),
//     // eslint-disable-next-line
//     new MenuItem(900, "queries", "Consultas", "bi bi-card-list","pink", "/queries"),
//     // eslint-disable-next-line
//     new MenuItem(1010, "channels", "Canales", "bi bi-chat-text","teal", "/channels"),
//     // eslint-disable-next-line
//     new MenuItem(1020, "alerts", "Alertas", "bi bi-broadcast-pin","red", "/alerts"),
//     // eslint-disable-next-line
//     //move to SysAdmin Menus
//     new MenuItem(
//       2000,
//       "sys-config",
//       "System Configuration",
//       "fa fas fa-cogs",
//       "red",
//       "/sys-config"
//     )
//     //new MenuItem(1020, "marketplace", "Marketplace", "bi bi-shop","teal", "marketplace"),
//   ]
// // };

// const _NetworkAdminMenu: Array<MenuItem> = [];
// const _RootMenu: Array<MenuItem> = [];
// const _SysAdminMenu: Array<MenuItem> = [];
// const _TraderMenu: Array<MenuItem> = [];

// export interface SystemMenus {
//   UserMenu: Array<MenuItem>;
//   NetworkAdminMenu: Array<MenuItem>;
//   RootMenu: Array<MenuItem>;
//   SysAdminMenu: Array<MenuItem>;
//   TraderMenu: Array<MenuItem>;
// }

// export const SystemMenus: SystemMenus = {
//   UserMenu: Menu._UserMenu,
//   NetworkAdminMenu: _NetworkAdminMenu,
//   RootMenu: _RootMenu,
//   SysAdminMenu: _SysAdminMenu,
//   TraderMenu: _TraderMenu
// };

export interface ProfilePermissions {
  profileId: string;
  data?: Array<string>;
}

export const GET_PROFILES_CONFIG_SUCCESS = "GET_PROFILES_CONFIG_SUCCESS";
export const GET_MENU_SUCCESS = "GET_MENU_SUCCESS";
export const SET_SYSTEM_CONFIG = "SET_SYSTEM_CONFIG";
export const SET_CONFIG_LISTENER = "SET_CONFIG_LISTENER";
export const CLEAR_CONFIG_LISTENER = "CLEAR_CONFIG_LISTENER";
export const SET_SYSTEM_CATALOG_COUNTRIES = "SET_SYSTEM_CATALOG_COUNTRIES";
export const SET_SYSTEM_CATALOG_COUNTRIES_LISTENER =
  "SET_SYSTEM_CATALOG_COUNTRIES_LISTENER";
export const CLEAR_SYSTEM_CATALOG_COUNTRIES_LISTENER =
  "CLEAR_SYSTEM_CATALOG_COUNTRIES_LISTENER";
