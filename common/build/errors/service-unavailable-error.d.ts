import { CustomError } from "./custom-error";
export declare class ServiceUnavailableError extends CustomError {
    message: string;
    statusCode: number;
    constructor(message: string);
    serializeErrors(): {
        message: string;
        field?: string | undefined;
    }[];
}
