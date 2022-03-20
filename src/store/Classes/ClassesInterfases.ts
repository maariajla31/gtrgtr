// Actions
export const doGetClasses = "doGetClasses";
export const doGetSchedules = "doGetSchedules";

// Mutations
export const SET_CLASSES = "SET_CLASSES";
export const SET_SCHEDULE_ACADEMY = "SET_SCHEDULE_ACADEMY";
export const SET_SCHEDULE_GTR = "SET_SCHEDULE_GTR";

export interface ClassesState {
  academy: Map<string, TimeWeekDefinition>;
  gtrSystem: Map<string, TimeWeekDefinition>;
}

export interface TimeWeekDefinition {
  monday?: ClassData[];
  tuesday?: ClassData[];
  wednesday?: ClassData[];
  thursday?: ClassData[];
  friday?: ClassData[];
  saturday?: ClassData[];
  sunday?: ClassData[];
}

export class EventCardParameters implements EventCardParametersBase {
  title: string;
  link: string;
  imageUrl?: string;
  registrationOpen?: boolean;
  requiredRank: string;
  constructor(title: string, link: string, requiredRank?: string) {
    this.title = title;
    this.link = link;
    this.requiredRank = requiredRank ? requiredRank : "INITIAL";
  }
}

export interface EventCardParametersBase {
  title?: string;
  link?: string;
  imageUrl?: string;
  registrationOpen?: boolean;
  requiredRank?: string;
}

export function classFactory(
  classType: string,
  params: EventCardParametersBase
) {
  switch (classType) {
    case "BinaryOptionsClass":
      return new BinaryOptionsClass(params);
    case "ForexClass":
      return new ForexClass(params);
    case "SportsTradingClass":
      return new SportsTradingClass(params);
    case "MarketkingClass":
      return new MarketkingClass(params);
    case "CryptospaceClass":
      return new CryptospaceClass(params);
    case "WakeupCall":
      return new WakeupCall(params);
    case "LlamadaTestimoniosCall":
      return new LlamadaTestimoniosCall(params);
    case "BusinessPlan":
      return new BusinessPlan(params);
    case "Mentorship":
      return new Mentorship(params);
    case "AdvancedMentorship":
      return new AdvancedMentorship(params);
    case "FastStartCall":
      return new FastStartCall(params);
    case "MindsetCall":
      return new MindsetCall(params);
    case "FreeClass":
      return new FreeClass(params);
    default:
      console.log(classType);
      throw new Error("Class Type not found");
  }
}

abstract class ClassData implements EventCardParameters {
  requiredRank: string;
  title: string;
  imageUrl: string;
  link: string;
  registrationOpen: boolean;
  constructor(params: EventCardParameters) {
    this.title = params.title;
    this.imageUrl =
      "" +
      (params.imageUrl == undefined ? "default-card.jpg" : params.imageUrl);
    this.link = params.link;
    this.registrationOpen =
      params.registrationOpen == undefined ? false : params.registrationOpen;
    this.requiredRank = params.requiredRank;
  }
}

export class BinaryOptionsClass extends ClassData {
  constructor(params: EventCardParametersBase) {
    params =
      params == undefined
        ? new EventCardParameters("Opciones Binarias", "http://zoom.us/j/0")
        : params;
    params.link = params.link == undefined ? "http://zoom.us/j/0" : params.link;
    params.title =
      params.title == undefined ? "Opciones Binarias" : params.title;
    params.imageUrl =
      params.imageUrl == undefined ? "binarias.png" : params.imageUrl;
    super(params as EventCardParameters);
  }
}

export class ForexClass extends ClassData {
  constructor(params?: EventCardParametersBase) {
    params =
      params == undefined
        ? new EventCardParameters("Forex", "http://zoom.us/j/0")
        : params;
    params.link = params.link == undefined ? "http://zoom.us/j/0" : params.link;
    params.title = params.title == undefined ? "Forex" : params.title;
    params.imageUrl =
      params.imageUrl == undefined ? "forex.png" : params.imageUrl;
    super(params as EventCardParameters);
  }
}

export class SportsTradingClass extends ClassData {
  constructor(params?: EventCardParametersBase) {
    params =
      params == undefined
        ? new EventCardParameters("Trading Deportivo", "http://zoom.us/j/0")
        : params;
    params.link = params.link == undefined ? "http://zoom.us/j/0" : params.link;
    params.title =
      params.title == undefined ? "Trading Deportivo" : params.title;
    params.imageUrl =
      params.imageUrl == undefined ? "deportes.png" : params.imageUrl;
    super(params as EventCardParameters);
  }
}

export class MarketkingClass extends ClassData {
  constructor(params: EventCardParametersBase) {
    params =
      params == undefined
        ? new EventCardParameters("MarketKing", "http://zoom.us/j/0")
        : params;
    params.link == undefined ? "http://zoom.us/j/0" : params.link;
    params.title = params.title == undefined ? "MarketKing" : params.title;
    params.imageUrl =
      params.imageUrl == undefined ? "marketking.png" : params.imageUrl;
    super(params as EventCardParameters);
  }
}

export class CryptospaceClass extends ClassData {
  constructor(params: EventCardParametersBase) {
    params =
      params == undefined
        ? new EventCardParameters("Criptospace", "http://zoom.us/j/0")
        : params;
    params.link == undefined ? "http://zoom.us/j/0" : params.link;
    params.title = params.title == undefined ? "Cryptospace" : params.title;
    params.imageUrl =
      params.imageUrl == undefined ? "cryptospace.png" : params.imageUrl;
    super(params as EventCardParameters);
  }
}

export class WakeupCall extends ClassData {
  constructor(params?: EventCardParametersBase) {
    params =
      params == undefined
        ? new EventCardParameters(
            "Wake Up Call",
            "https://www.vibragtr.com/wakeup"
          )
        : params;
    params.link = "https://www.vibragtr.com/wakeup";
    params.title = params.title == undefined ? "Wake Up Call" : params.title;
    params.imageUrl =
      params.imageUrl == undefined ? "wakeup_call.png" : params.imageUrl;
    super(params as EventCardParameters);
  }
}
export class LlamadaTestimoniosCall extends ClassData {
  constructor(params?: EventCardParametersBase) {
    params =
      params == undefined
        ? new EventCardParameters(
            "Llamada de Testimonios",
            "http://www.vibragtr.com/fblive"
          )
        : params;
    params.link = "http://www.vibragtr.com/fblive";
    params.title =
      params.title == undefined ? "Llamada de Testimonios" : params.title;
    params.imageUrl =
      params.imageUrl == undefined ? "testimonios.png" : params.imageUrl;
    super(params as EventCardParameters);
  }
}
export class BusinessPlan extends ClassData {
  constructor(params?: EventCardParametersBase) {
    params =
      params == undefined
        ? new EventCardParameters(
            "Plan de Negocios",
            "https://vibragtr.com/Lanuevaeconomia"
          )
        : params;
    params.link = "https://vibragtr.com/Lanuevaeconomia";
    params.title =
      params.title == undefined ? "Plan de Negocios" : params.title;
    params.imageUrl =
      params.imageUrl == undefined ? "plan_de_negocios.png" : params.imageUrl;
    super(params as EventCardParameters);
  }
}
export class Mentorship extends ClassData {
  constructor(params?: EventCardParametersBase) {
    params =
      params == undefined
        ? new EventCardParameters(
            "Mentoria",
            "https://vibragtr.com/Mentoriagtr"
          )
        : params;
    params.link = "https://vibragtr.com/Mentoriagtr";
    params.title = params.title == undefined ? "Mentoria" : params.title;
    params.imageUrl =
      params.imageUrl == undefined ? "mentoria2.png" : params.imageUrl;
    super(params as EventCardParameters);
  }
}
export class AdvancedMentorship extends ClassData {
  constructor(params?: EventCardParametersBase) {
    params =
      params == undefined
        ? new EventCardParameters(
            "Cap Influencers +",
            "https://vibragtr.com/Influencer",
            "INF"
          )
        : params;
    params.link = "https://vibragtr.com/Influencer";
    params.title =
      params.title == undefined ? "Capacitación Influencers & +" : params.title;
    params.imageUrl =
      params.imageUrl == undefined ? "600_y_sup.png" : params.imageUrl;
    super(params as EventCardParameters);
  }
}
export class FastStartCall extends ClassData {
  constructor(params?: EventCardParametersBase) {
    params =
      params == undefined
        ? new EventCardParameters(
            "Inicio Rápido",
            "https://vibragtr.com/Mentoriagtr"
          )
        : params;
    params.link = "https://vibragtr.com/Mentoriagtr";
    params.title = params.title == undefined ? "Inicio Rápido" : params.title;
    params.imageUrl =
      params.imageUrl == undefined ? "inicio_rapido.png" : params.imageUrl;
    super(params as EventCardParameters);
  }
}
export class MindsetCall extends ClassData {
  constructor(params?: EventCardParametersBase) {
    params =
      params == undefined
        ? new EventCardParameters(
            "Mindset Call",
            "https://vibragtr.com/mindset"
          )
        : params;
    params.link = "https://vibragtr.com/mindset";
    params.title = params.title == undefined ? "Mindset Call" : params.title;
    params.imageUrl =
      params.imageUrl == undefined ? "mindsetcall.png" : params.imageUrl;
    super(params as EventCardParameters);
  }
}

export class FreeClass extends ClassData {
  constructor(params?: EventCardParametersBase) {
    params =
      params == undefined
        ? new EventCardParameters(
            "Clase Gratis",
            "https://vibragtr.com/Clasegratis"
          )
        : params;
    params.link = "https://vibragtr.com/Clasegratis";
    params.title = params.title == undefined ? "Clase Gratis" : params.title;
    params.imageUrl =
      params.imageUrl == undefined ? "clase_gratis_lap.png" : params.imageUrl;
    super(params as EventCardParameters);
  }
}

export function sortTime(
  a: [string, TimeWeekDefinition],
  b: [string, TimeWeekDefinition]
) {
  let r = 0;
  let aHour = parseInt(a[0].split(":")[0]);
  let bHour = parseInt(b[0].split(":")[0]);
  aHour = a[0].endsWith("pm") && aHour != 12 ? aHour + 12 : aHour;
  bHour = b[0].endsWith("pm") && bHour != 12 ? bHour + 12 : bHour;
  r = aHour - bHour;
  if (r === 0) {
    const aMins = parseInt(a[0].split(":")[1].substring(0, 2));
    const bMins = parseInt(b[0].split(":")[1].substring(0, 2));
    //console.log(a[0], aMins, b[0], bMins, " ->", r);
    r = aMins - bMins;
  }
  //console.log(a[0], aHour, b[0], bHour, " ->", r);
  return r;
}

export function BuildSchedule(
  querySnapshot: any,
  day: string,
  scheludeMap: Map<string, TimeWeekDefinition>
) {
  for (const doc of querySnapshot.docs) {
    const h = doc.id;
    const data = doc.data();
    for (const c of Object.keys(data)) {
      if (data[c].active) {
        if (!scheludeMap.has(h)) {
          scheludeMap.set(h, {} as TimeWeekDefinition);
        }
        const hour = scheludeMap.get(h) || {};
        if (!hour[day as keyof TimeWeekDefinition]) {
          hour[day as keyof TimeWeekDefinition] = [];
        }

        hour[day as keyof TimeWeekDefinition]?.push(classFactory(c, data[c]));
      }
    }
  }
}

export const TradingAcademySchedule: Map<string, TimeWeekDefinition> = new Map([
  [
    "8:00am",
    {
      monday: [
        new BinaryOptionsClass({ link: "https://www.vibragtr.com/LB8AM" })
      ],
      tuesday: [
        new BinaryOptionsClass({ link: "https://www.vibragtr.com/MB8AM" })
      ],
      wednesday: [
        new BinaryOptionsClass({ link: "https://www.vibragtr.com/MIB8AM" })
      ],
      thursday: [
        new BinaryOptionsClass({ link: "https://www.vibragtr.com/JB8AM" })
      ],
      friday: [
        new BinaryOptionsClass({ link: "https://www.vibragtr.com/VB8AM" })
      ]
    }
  ],
  // [
  //   "9:00am",
  //   {
  //     thursday: [
  //       new BinaryOptionsClass({
  //         link: "https://vibragtr.com/MaratonBinarias",
  //         title: "Maratón de Binarias"
  //       })
  //     ]
  //   }
  // ],
  [
    "10:00am",
    {
      monday: [
        new BinaryOptionsClass({ link: "https://www.vibragtr.com/LB10AM" })
      ],
      tuesday: [
        new BinaryOptionsClass({ link: "https://www.vibragtr.com/MB10AM" })
      ],
      wednesday: [
        new BinaryOptionsClass({ link: "https://www.vibragtr.com/MIB10AM" })
      ],
      thursday: [
        new BinaryOptionsClass({ link: "https://www.vibragtr.com/JB10AM" })
        // new BinaryOptionsClass({
        //   link: "https://vibragtr.com/MaratonBinarias",
        //   title: "Maratón de Binarias"
        // })
      ],
      friday: [
        new BinaryOptionsClass({ link: "https://www.vibragtr.com/VB10AM" })
      ],
      sunday: [
        new MarketkingClass({ link: "https://www.vibragtr.com/DMK10AM" })
      ]
    }
  ],
  [
    "11:00am",
    {
      // wednesday: [
      //   new BinaryOptionsClass({
      //     link: "https://vibragtr.com/MaratonBinarias",
      //     title: "Maratón de Binarias"
      //   })
      // ],
      saturday: [
        new SportsTradingClass({ link: "https://www.vibragtr.com/SD11AM" })
      ]
    }
  ],
  [
    "9:00pm",
    {
      monday: [new ForexClass({ link: "https://www.vibragtr.com/LF9PM" })],
      tuesday: [new ForexClass({ link: "https://www.vibragtr.com/MF9PM" })],
      wednesday: [
        new SportsTradingClass({ link: "https://www.vibragtr.com/MID9PM" }),
        new CryptospaceClass({ link: "https://www.vibragtr.com/MiC9PM" })
      ],
      thursday: [new ForexClass({ link: "https://www.vibragtr.com/JF9PM" })],
      friday: [new CryptospaceClass({ link: "https://www.vibragtr.com/VC9PM" })]
    }
  ],
  [
    "11:00pm",
    {
      monday: [
        new BinaryOptionsClass({ link: "https://www.vibragtr.com/LB11PM" })
      ],
      tuesday: [
        new BinaryOptionsClass({ link: "https://www.vibragtr.com/MB11PM" })
      ],
      wednesday: [
        new BinaryOptionsClass({ link: "https://www.vibragtr.com/MiB11PM" }),
        new MarketkingClass({ link: "https://www.vibragtr.com/MiMK11PM" })
      ],
      thursday: [
        new BinaryOptionsClass({ link: "https://www.vibragtr.com/JB11PM" })
      ]
    }
  ]
]);

export const GtrSystem: Map<string, TimeWeekDefinition> = new Map([
  [
    "9:00am",
    {
      monday: [new WakeupCall()],
      wednesday: [new WakeupCall()],
      friday: [new WakeupCall()]
    }
  ],
  [
    "12:00pm",
    {
      saturday: [new AdvancedMentorship()]
    }
  ],
  [
    "2:00pm",
    {
      saturday: [
        new BusinessPlan({
          title: "From Human to Hero",
          link: "https://vibragtr.com/FHH"
        })
      ]
    }
  ],
  [
    "6:00pm",
    {
      wednesday: [new LlamadaTestimoniosCall()]
    }
  ],
  [
    "8:00pm",
    {
      monday: [new BusinessPlan()],
      tuesday: [new BusinessPlan()],
      wednesday: [new BusinessPlan()],
      thursday: [new BusinessPlan()],
      friday: [new BusinessPlan()],
      sunday: [new BusinessPlan()]
    }
  ],
  [
    "9:30pm",
    {
      wednesday: [new FreeClass()],
      friday: [new FreeClass()]
    }
  ],
  [
    "10:00pm",
    {
      monday: [new FastStartCall()],
      tuesday: [new Mentorship()],
      thursday: [new Mentorship()],
      sunday: [new MindsetCall()]
    }
  ]
]);
