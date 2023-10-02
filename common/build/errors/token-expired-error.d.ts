import { CustomError } from './custom-error';
export declare class TokenExpiredError extends CustomError {
    statusCode: number;
    constructor();
    serializeErrors(): {
        message: string;
        field?: string | undefined;
    }[];
}
