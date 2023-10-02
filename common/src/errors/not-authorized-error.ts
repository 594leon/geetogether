import { CustomError } from './custom-error';

export class NotAuthorizedError extends CustomError {
    statusCode = 401;

    constructor() {
        super('Not authorized');
    }

    serializeErrors(): { message: string; field?: string | undefined; }[] {
        return [{ message: 'Not authorized' }];
    }
}