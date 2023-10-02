import { CustomError } from "./custom-error";
import { ValidationError } from 'joi';

export class RequestValidationError extends CustomError {
    statusCode = 400;

    constructor(public validationError: ValidationError) {
        super('Invalid request parameters');
    }

    serializeErrors(): { message: string; field?: string; }[] {
        return this.validationError.details.map(item => {
            return { message: item.message, field: item.context?.label };
        })
    }

}