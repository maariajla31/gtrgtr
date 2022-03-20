import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

// export function _GeneratePassword(): string {
//   const psw = Buffer.from(
//     Math.random()
//       .toString(36)
//       .substring(2)
//       .concat(
//         Math.random()
//           .toString(36)
//           .substring(2)
//       )
//       .substring(10)
//   )
//     .toString("base64")
//     .substring(2, 12);
//   return psw.length == 10 && psw.match(/^[A-Za-z]/i)
//     ? psw
//     : _GeneratePassword();
// }

// export function generateShortGUID(): string {
  // const str = Buffer.from(
  //   Math.random()
  //     .toString(36)
  //     .substring(2)
  //     .concat(
  //       Math.random()
  //         .toString(36)
  //         .substring(2)
  //     )
  //     .substring(10)
  // )
  //   .toString("base64")
  //   .substring(2, 6)
  //   .toUpperCase();
  // return str.length == 4 && str.match(/^[A-Z]/i)
  //   ? str + "-" + random4Digits()
  //   : generateShortGUID();
// }

export function generateDateKey(): string {
  const now = dayjs().utc();
  return now.format("YYYY-MM-DDTHH:mm:ss.SSS" + "-" + random3Digits());
}

export function random3Digits(): string {
  const str = Math.floor(Math.random() * (999 - 100 + 1) + 100);
  return str.toString().padStart(3, "0");
}

export function random4Digits(): string {
  const str = Math.floor(Math.random() * (9999 - 1000 + 1) + 1000);
  return str.toString().padStart(4, "0");
}

export const tools = {
  methods: {
    // generatePassword(): string {
    //   return _GeneratePassword();
    // },
    // generateShortGUID,
    generateDateKey,
    random3Digits,
    random4Digits
  }
};
