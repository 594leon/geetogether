import { CustomError } from './custom-error';

export class TokenExpiredError extends CustomError {
    statusCode = 401;

    constructor() {
        super('Token has expired');
    }

    serializeErrors(): { message: string; field?: string | undefined; }[] {
        return [{ message: 'Token has expiredv' }];
    }
}