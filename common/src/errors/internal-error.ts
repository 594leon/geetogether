import { CustomError } from './custom-error';

export class InternalError extends CustomError {
    statusCode = 500;

    constructor() {
        super('an internal error has occurred');
    }
    serializeErrors(): { message: string; field?: string | undefined; }[] {
        return [{ message: 'an internal error has occurred' }]
    }

}