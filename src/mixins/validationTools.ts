import * as fb from "../firebase";
// import {
//   validateEmail as _validateEmail,
//   validateUsername as _validateUsername,
//   validPassword as _validPassword,
//   UsernameValidationResponse as _UsernameValidationResponse,
//   EmailValidationResponse as _EmailValidationResponse,
//   PasswordValidationResponse as _PasswordValidationResponse
// } from "@/../functions/src/_utils/validationFunctions";

// export class UsernameValidationResponse extends _UsernameValidationResponse {
//   constructor() {
//     super();
//   }
// }
// export class EmailValidationResponse extends _EmailValidationResponse {
//   constructor() {
//     super();
//   }
// }

// export class PasswordValidationResponse extends _PasswordValidationResponse {
//   constructor() {
//     super();
//   }
// }

// export function validateEmail(email: string): EmailValidationResponse {
//   return _validateEmail(email);
// }

// export async function validateUsername(
//   username: string,
//   checkAvailability: boolean = true
// ): Promise<UsernameValidationResponse> {
//   const response = _validateUsername(username);

  // response.status =
  //   response.status == "SUCCESS" ? "PROCESSING" : response.status;

//   if (abstra) {
//     const GetUsernameAvailability = fb.func.httpsCallable(
//       "GetUsernameAvailability"
//     );
//     response.isAvailable = await GetUsernameAvailability(username)
//       .then((response: any) => {
//         if (response.data.OPCODE == "SUCCESS") {
//           return true;
//         } else if (response.data.OPCODE == "UNAVAILABLE") {
//           return false;
//         } else {
//           return Promise.reject(response.data);
//         }
//       })
//       .catch((error) => {
//         console.log(error);
//         response.hasError = true;
//         response.status = "ERROR";
//         response.code = "SERVER_ERROR";
//         response.systemMessage = "Server error";
//         response.userMessage = "Error en el servidor.";
//         return false;
//       });
//   }
//   response.status =
//     response.status == "PROCESSING" ? "SUCCESS" : response.status;
//   return response;
// }

// export function validPassword(password: string): PasswordValidationResponse {
//   return _validPassword(password);
// }

export const validationTools = {
  methods: {
    // validateEmail,
    // validateUsername,
    // validPassword
  }
};
