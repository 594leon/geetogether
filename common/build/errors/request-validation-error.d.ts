import { CustomError } from "./custom-error";
import { ValidationError } from 'joi';
export declare class RequestValidationError extends CustomError {
    validationError: ValidationError;
    statusCode: number;
    constructor(validationError: ValidationError);
    serializeErrors(): {
        message: string;
        field?: string;
    }[];
}
