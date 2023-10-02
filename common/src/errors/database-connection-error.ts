// import { CustomError } from "./custom-error";

// export class DatabaseConnectionError extends CustomError {

//     statusCode = 500

//     constructor() {
//         super('Error connecting to database');
//     }

//     serializeErrors(): { message: string; field?: string | undefined; }[] {
//         return [
//             { message: 'Error connecting to database' }
//         ];
//     }

// }